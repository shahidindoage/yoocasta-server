import prisma from '../../config/db';

interface GetPublicProfileParams {
  username: string;
  viewerUserId?: string;
  viewerRole?: string;
}

export const getPublicProfile = async (params: GetPublicProfileParams) => {
  const { username, viewerUserId, viewerRole } = params;

  // 1. Find user by username (public route uses username, not ID)
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      talentProfile: {
        include: {
          categories: { include: { category: true } },
          languages: { include: { language: true } },
          dialects: { include: { dialect: true } },
          attributes: true,
          media: { orderBy: { order: 'asc' } },
          careerHistory: { orderBy: { startDate: 'desc' } },
          courses: {},
          ethnicity: true,
          city: { include: { country: true } },
        }
      },
      nationality: true,
    }
  });

  if (!user || !user.talentProfile) {
    throw { statusCode: 404, message: 'Talent profile not found' };
  }

  // 2. Increment views atomically
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { views: { increment: 1 } }
    }),
    prisma.talentProfile.update({
      where: { userId: user.id },
      data: { views: { increment: 1 } }
    })
  ]);

  // 3. THE VISIBILITY RULE: Internal Company Check
  let showContacts = false;
  if (viewerRole === 'RECRUITER' && viewerUserId) {
    const recruiterCompany = await prisma.companyProfile.findFirst({
      where: { userId: viewerUserId }
    });
    // Only show if explicitly flagged as "Our Company"
    showContacts = recruiterCompany?.isInternalCompany === true;
  }

  // 4. Construct safe response (Strip hidden fields if not allowed)
  const R2_BASE = process.env.R2_PUBLIC_URL;
  const safeUser = {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    image: user.image ? `${R2_BASE}/profile/${user.image}` : null,
    isVerified: user.isVerified,
    views: (user.views || 0) + 1, // Return the newly incremented count
    nationality: user.nationality,
    talentProfile: {
      ...user.talentProfile,
      // Apply the Internal Company visibility rule
      ...(showContacts ? {
        whatsappNo: user.talentProfile.whatsappNo,
        contactNumber: user.talentProfile.contactNumber,
        contactEmail: user.talentProfile.contactEmail,
      } : {
        whatsappNo: null,
        contactNumber: null,
        contactEmail: null,
      })
    }
  };

  return safeUser;
};