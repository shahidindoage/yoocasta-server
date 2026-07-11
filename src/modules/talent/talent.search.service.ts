import prisma from '../../config/db';

interface SearchParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  categories?: string[];
  ethnicities?: string[];
  gender?: string;
  ageFrom?: number;
  ageTo?: number;
  countryId?: string;
  cityId?: string;
  nationalities?: string[];
  languages?: string[];
  dialects?: string[];
  physical?: Record<string, string>;
  professional?: { key: string; value: string }[];
}

const calculateAge = (dob: Date | null | undefined): number | null => {
  if (!dob) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

export const searchTalents = async (params: SearchParams) => {
  const page = params.page || 1;
  const limit = params.limit || 12;
  const skip = (page - 1) * limit;

  const where: any = {
    role: 'TALENT',
    status: 'ACTIVE',
    profileCompleted: true,
  };

  // Everything that filters fields ON talentProfile goes in here,
  // then gets wrapped under `is` at the very end.
  const profileConditions: any = {};

  // 1. Text Search (Name or Bio)
  if (params.search) {
    where.OR = [
      { firstName: { contains: params.search, mode: 'insensitive' } },
      { lastName: { contains: params.search, mode: 'insensitive' } },
      {
        talentProfile: {
          is: {
            OR: [
              { bioDescription: { contains: params.search, mode: 'insensitive' } },
              { skillDescription: { contains: params.search, mode: 'insensitive' } },
            ],
          },
        },
      },
    ];
  }

  // 2. Categories
  if (params.categories?.length) {
    profileConditions.categories = { some: { categoryId: { in: params.categories } } };
  }

  // 3. Demographics
  if (params.gender) profileConditions.gender = params.gender;
  if (params.ethnicities?.length) profileConditions.ethnicityId = { in: params.ethnicities };
  if (params.nationalities?.length) where.nationalityId = { in: params.nationalities }; // direct User field, fine as-is
  if (params.languages?.length) profileConditions.languages = { some: { languageId: { in: params.languages } } };
  if (params.dialects?.length) profileConditions.dialects = { some: { dialectId: { in: params.dialects } } };

  // 4. Location
  if (params.countryId) profileConditions.city = { countryId: params.countryId };
  if (params.cityId) profileConditions.cityId = params.cityId;

  // 5. Age -> DOB range
  if (params.ageFrom || params.ageTo) {
    const today = new Date();
    let minDob: Date | null = null; // latest birthdate allowed (youngest / ageFrom)
    let maxDob: Date | null = null; // earliest birthdate allowed (oldest / ageTo)

    if (params.ageTo) maxDob = new Date(today.getFullYear() - params.ageTo, today.getMonth(), today.getDate());
    if (params.ageFrom) minDob = new Date(today.getFullYear() - params.ageFrom, today.getMonth(), today.getDate());

    profileConditions.dob = {
      ...(maxDob ? { gte: maxDob } : {}),
      ...(minDob ? { lte: minDob } : {}),
    };
  }

  // 6. Physical Filters
  if (params.physical) {
    Object.entries(params.physical).forEach(([key, value]) => {
      if (value) profileConditions[key] = value;
    });
  }

  // 7. Professional/EAV Filters (AND across all selected key/value pairs)
  if (params.professional?.length) {
    profileConditions.AND = params.professional.map(p => ({
      attributes: { some: { key: p.key, value: p.value } },
    }));
  }

  // Finally, attach the relation filter correctly
  where.talentProfile = {
    isNot: null,
    ...(Object.keys(profileConditions).length ? { is: profileConditions } : {}),
  };

  // 8. Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (params.sort === 'a-z') orderBy = { firstName: 'asc' };
  if (params.sort === 'z-a') orderBy = { firstName: 'desc' };
  if (params.sort === 'most_viewed') orderBy = { views: 'desc' };

  const [talents, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        image: true,
        // views: true,
        isVerified: true,
        talentProfile: {
          select: {
            categories: { select: { category: { select: { name: true } } } },
            city: { select: { name: true, country: { select: { name: true } } } },
            ethnicity: { select: { name: true } },
            gender: true,
            dob: true,
            views: true
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const R2_BASE = process.env.R2_PUBLIC_URL;
  const formattedTalents = talents.map(u => ({
  id: u.id,
  username: u.username,
  firstName: u.firstName,
  lastName: u.lastName,
  image: u.image ? `${R2_BASE}/profile/${u.image}` : null,
  isVerified: u.isVerified,
  categories: u.talentProfile?.categories.map(c => c.category.name) || [],
  city: u.talentProfile?.city?.name,
  country: u.talentProfile?.city?.country?.name,
  ethnicity: u.talentProfile?.ethnicity?.name,
  gender: u.talentProfile?.gender,
  age: calculateAge(u.talentProfile?.dob),
  views: u.talentProfile?.views ?? 0, // <-- added
}));

  return {
    data: formattedTalents,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Fetch options for dropdowns
export const getTalentFilterOptions = async () => {
  const [categories, countries, cities, nationalities, ethnicities, languages, dialects, attributes] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.country.findMany({ orderBy: { name: 'asc' } }),
    prisma.city.findMany({ orderBy: { name: 'asc' } }),
    prisma.nationality.findMany({ orderBy: { name: 'asc' } }),
    prisma.ethnicity.findMany({ orderBy: { name: 'asc' } }),
    prisma.language.findMany({ orderBy: { name: 'asc' } }),
    prisma.dialect.findMany({ orderBy: { name: 'asc' } }),
    prisma.profileAttribute.groupBy({ by: ['key'] }),
  ]);

  return { categories, countries, cities, nationalities, ethnicities, languages, dialects, attributes: attributes.map(a => a.key) };
};