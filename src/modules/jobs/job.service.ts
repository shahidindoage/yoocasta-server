import prisma from '../../config/db';

// ─── Form Options ──────────────────────────────────────────────
export const getFormOptions = async () => {
  const [categories, projectTypes, countries, cities, languages, dialects, ethnicities, nationalities] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.projectType.findMany({ orderBy: { name: 'asc' } }),
    prisma.country.findMany({ orderBy: { name: 'asc' } }),
    prisma.city.findMany({ orderBy: { name: 'asc' }, include: { country: true } }),
    prisma.language.findMany({ orderBy: { name: 'asc' } }),
    prisma.dialect.findMany({ orderBy: { name: 'asc' } }),
    prisma.ethnicity.findMany({ orderBy: { name: 'asc' } }),
    prisma.nationality.findMany({ orderBy: { name: 'asc' } }),
  ]);
  return { categories, projectTypes, countries, cities, languages, dialects, ethnicities, nationalities };
};

// ─── Get Company Profile ───────────────────────────────────────
const getCompanyProfile = async (userId: string) => {
  const company = await prisma.companyProfile.findUnique({ where: { userId } });
  if (!company) throw { statusCode: 404, message: 'Company profile not found' };
  return company;
};

// ─── Create Job (Step 1) ───────────────────────────────────────
export const createJob = async (userId: string, data: any) => {
  const company = await getCompanyProfile(userId);

  const job = await prisma.job.create({
    data: {
      companyId: company.id,
      castingService: data.castingService || 'portal',
      title: data.title || null,
      subTitle: data.subTitle || null,
      description: data.description || null,
      usage: data.usage || null,
      categoryId: data.categoryId || null,
      projectTypeId: data.projectTypeId || null,
      paymentInfo: data.paymentInfo || null,
      castingCityId: data.castingCityId || null,
      castingDates: data.castingDates ? JSON.stringify(data.castingDates) : null,
      lastDateToApply: data.lastDateToApply ? new Date(data.lastDateToApply) : null,
      shootingCityId: data.shootingCityId || null,
      shootingDates: data.shootingDates ? JSON.stringify(data.shootingDates) : null,
      status: 'PENDING',
    },
    include: { roles: true }
  });

  return job;
};

// ─── Get My Jobs ───────────────────────────────────────────────
export const getMyJobs = async (userId: string) => {
  const company = await getCompanyProfile(userId);

  const jobs = await prisma.job.findMany({
    where: { companyId: company.id },
    include: {
      category: true,
      projectType: true,
      castingCity: { include: { country: true } },
      shootingCity: { include: { country: true } },
      roles: {
        include: { 
          payment: true,
          applications: { select: { status: true } }
        }
      },
      _count: { select: { roles: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return jobs.map(job => {
    let totalApplications = 0;
    let shortlistedCount = 0;
    let selectedCount = 0;
    
    job.roles.forEach(role => {
      totalApplications += role.applications.length;
      role.applications.forEach(app => {
        if (app.status === 'SHORTLISTED') shortlistedCount++;
        if (app.status === 'SELECTED') selectedCount++;
      });
      // Optionally remove raw applications array if not needed frontend to save bandwidth
      // delete (role as any).applications;
    });

    return {
      ...job,
      totalApplications,
      shortlistedCount,
      selectedCount
    };
  });
};

// ─── Get Job By ID ─────────────────────────────────────────────
export const getJobById = async (jobId: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: { include: { user: { select: { firstName: true, email: true } } } },
      category: true,
      projectType: true,
      castingCity: { include: { country: true } },
      shootingCity: { include: { country: true } },
      roles: {
        include: { payment: true }
      },
    }
  });
  if (!job) throw { statusCode: 404, message: 'Job not found' };
  return job;
};

// ─── Update Job ────────────────────────────────────────────────
export const updateJob = async (userId: string, jobId: string, data: any) => {
  const company = await getCompanyProfile(userId);
  const job = await prisma.job.findFirst({ where: { id: jobId, companyId: company.id } });
  if (!job) throw { statusCode: 404, message: 'Job not found' };

  return prisma.job.update({
    where: { id: jobId },
    data: {
      title: data.title,
      subTitle: data.subTitle,
      description: data.description,
      usage: data.usage,
      categoryId: data.categoryId || null,
      projectTypeId: data.projectTypeId || null,
      paymentInfo: data.paymentInfo || null,
      castingCityId: data.castingCityId || null,
      castingDates: data.castingDates ? JSON.stringify(data.castingDates) : null,
      lastDateToApply: data.lastDateToApply ? new Date(data.lastDateToApply) : null,
      shootingCityId: data.shootingCityId || null,
      shootingDates: data.shootingDates ? JSON.stringify(data.shootingDates) : null,
    },
    include: { roles: true }
  });
};

// ─── Delete Job ────────────────────────────────────────────────
export const deleteJob = async (userId: string, jobId: string) => {
  const company = await getCompanyProfile(userId);
  const job = await prisma.job.findFirst({ where: { id: jobId, companyId: company.id } });
  if (!job) throw { statusCode: 404, message: 'Job not found' };

  await prisma.job.delete({ where: { id: jobId } });
  return { message: 'Job deleted successfully' };
};

// ─── Add Role ──────────────────────────────────────────────────
export const addRole = async (userId: string, jobId: string, data: any) => {
  const company = await getCompanyProfile(userId);
  const job = await prisma.job.findFirst({ where: { id: jobId, companyId: company.id } });
  if (!job) throw { statusCode: 404, message: 'Job not found' };

  const role = await prisma.role.create({
    data: {
      jobId,
      title: data.title,
      description: data.description || null,
      noOfCast: data.noOfCast ? parseInt(data.noOfCast) : null,
      ethnicity: data.ethnicityId || null,
      ethnicityAll: data.ethnicityAll || false,
      nationality: data.nationalityId || null,
      nationalityAll: data.nationalityAll || false,
      languageSpoken: data.languageIds ? JSON.stringify(data.languageIds) : null,
      dialectsSpoken: data.dialectIds ? JSON.stringify(data.dialectIds) : null,
      gender: data.gender || null,
      ageMin: data.ageMin ? parseInt(data.ageMin) : null,
      ageMax: data.ageMax ? parseInt(data.ageMax) : null,
      experience: data.experience ? JSON.stringify(data.experience) : null,
      experienceAll: data.experienceAll || false,
      paymentInfo: data.paymentInfo || null,
      paymentType: data.paymentType || null,
      usage: data.usage || null,
      locationCityId: data.locationCityId || null,
      locationCountry: data.locationCountry || null,
      question1: data.question1 || null,
      question2: data.question2 || null,
      question3: data.question3 || null,
      requiredProfileVideo: data.requiredProfileVideo || false,
      requiredCastingVideo: data.requiredCastingVideo || false,
    }
  });

  // Create role payment if payment type provided
  if (data.paymentType && data.paymentDetails) {
    await prisma.rolePayment.create({
      data: {
        roleId: role.id,
        ...buildPaymentData(data.paymentType, data.paymentDetails),
      }
    });
  }

  return prisma.role.findUnique({
    where: { id: role.id },
    include: { payment: true }
  });
};

// ─── Update Role ───────────────────────────────────────────────
export const updateRole = async (userId: string, jobId: string, roleId: string, data: any) => {
  const company = await getCompanyProfile(userId);
  const job = await prisma.job.findFirst({ where: { id: jobId, companyId: company.id } });
  if (!job) throw { statusCode: 404, message: 'Job not found' };

  const role = await prisma.role.findFirst({ where: { id: roleId, jobId } });
  if (!role) throw { statusCode: 404, message: 'Role not found' };

  await prisma.role.update({
    where: { id: roleId },
    data: {
      title: data.title,
      description: data.description || null,
      noOfCast: data.noOfCast ? parseInt(data.noOfCast) : null,
      ethnicity: data.ethnicityId || null,
      nationality: data.nationalityId || null,
      languageSpoken: data.languageIds ? JSON.stringify(data.languageIds) : null,
      dialectsSpoken: data.dialectIds ? JSON.stringify(data.dialectIds) : null,
      gender: data.gender || null,
      ageMin: data.ageMin ? parseInt(data.ageMin) : null,
      ageMax: data.ageMax ? parseInt(data.ageMax) : null,
      experience: data.experience ? JSON.stringify(data.experience) : null,
      paymentType: data.paymentType || null,
      locationCityId: data.locationCityId || null,
      question1: data.question1 || null,
      question2: data.question2 || null,
      question3: data.question3 || null,
      requiredProfileVideo: data.requiredProfileVideo || false,
      requiredCastingVideo: data.requiredCastingVideo || false,
    }
  });

  // Update payment
  if (data.paymentType && data.paymentDetails) {
    await prisma.rolePayment.upsert({
      where: { roleId },
      create: { roleId, ...buildPaymentData(data.paymentType, data.paymentDetails) },
      update: buildPaymentData(data.paymentType, data.paymentDetails),
    });
  }

  return prisma.role.findUnique({ where: { id: roleId }, include: { payment: true } });
};

// ─── Delete Role ───────────────────────────────────────────────
export const deleteRole = async (userId: string, jobId: string, roleId: string) => {
  const company = await getCompanyProfile(userId);
  const job = await prisma.job.findFirst({ where: { id: jobId, companyId: company.id } });
  if (!job) throw { statusCode: 404, message: 'Job not found' };

  await prisma.role.delete({ where: { id: roleId } });
  return { message: 'Role deleted' };
};

// ─── Build Payment Data ────────────────────────────────────────
const parseIntOrNull = (val: any) => val ? parseInt(val, 10) : null;

const buildPaymentData = (paymentType: string, d: any) => {
  switch (paymentType) {
    case 'per_hour':
      return { 
        hourPerDay: parseIntOrNull(d.hoursPerDay), 
        hourBudgetPerHour: parseIntOrNull(d.budgetPerHour), 
        hourNoOfDays: parseIntOrNull(d.noOfDays) 
      };
    case 'per_day':
      return { 
        dayFullDay: parseIntOrNull(d.fullDay), 
        dayHalfDay: parseIntOrNull(d.halfDay), 
        dayBudgetFullDay: parseIntOrNull(d.budgetFullDay), 
        dayBudgetHalfDay: parseIntOrNull(d.budgetHalfDay), 
        dayTotalBudget: parseIntOrNull(d.totalBudget) 
      };
    case 'per_week':
      return { 
        weekNoOfWeek: parseIntOrNull(d.noOfWeek), 
        weekDaysPerWeek: parseIntOrNull(d.daysPerWeek), 
        weekBudgetPerWeek: parseIntOrNull(d.budgetPerWeek) 
      };
    case 'per_month':
      return { 
        monthNoOfMonth: parseIntOrNull(d.noOfMonth), 
        monthDayPerMonth: parseIntOrNull(d.daysPerMonth), 
        monthBudgetPerMonth: parseIntOrNull(d.budgetPerMonth) 
      };
    case 'package':
      return { 
        packageBudgetFullDay: parseIntOrNull(d.fullDay), 
        packageBudgetHalfDay: parseIntOrNull(d.halfDay), 
        packageTotalBudget: parseIntOrNull(d.totalBudget) 
      };
    default:
      return {};
  }
};