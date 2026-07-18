import prisma from '../../config/db';
import { sendEmail } from '../../config/email';

export const applyForRole = async (userId: string, roleId: string, formData: any) => {
  const role = await prisma.role.findUnique({ where: { id: roleId }, include: { job: true } });
  if (!role) throw { statusCode: 404, message: 'Role not found' };
  if (!role.job) throw { statusCode: 404, message: 'Job not found' };

  const existing = await prisma.application.findUnique({
    where: { userId_roleId: { userId, roleId } },
  });
  if (existing) throw { statusCode: 409, message: 'You have already applied for this role' };

  const talentProfile = await prisma.talentProfile.findUnique({ where: { userId } });
  if (!talentProfile) throw { statusCode: 404, message: 'Talent profile not found' };

  const application = await prisma.application.create({
    data: {
      userId,
      roleId,
      status: 'APPLIED',
      formData,
    },
  });

  return application;
};

export const getMyApplications = async (userId: string) => {
  return prisma.application.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          job: {
            include: {
              company: { include: { user: { select: { firstName: true, email: true, image: true } } } },
              category: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getJobApplications = async (userId: string, jobId: string) => {
  const R2_BASE = process.env.R2_PUBLIC_URL as string;
  const company = await prisma.companyProfile.findUnique({ where: { userId } });
  if (!company) throw { statusCode: 404, message: 'Company profile not found' };

  const job = await prisma.job.findFirst({
    where: { id: jobId, companyId: company.id },
    include: {
      category: true,
      castingCity: { include: { country: true } },
      roles: {
        select: {
          id: true, title: true, gender: true, ageMin: true, ageMax: true,
          ethnicity: true, ethnicityAll: true, nationality: true, nationalityAll: true,
          languageSpoken: true, locationCityId: true,
        },
      },
    },
  });
  if (!job) throw { statusCode: 404, message: 'Job not found' };

  const applications = await prisma.application.findMany({
    where: { roleId: { in: job.roles.map(r => r.id) } },
    include: {
      role: {
        select: {
          id: true, title: true, gender: true, ageMin: true, ageMax: true,
          ethnicity: true, ethnicityAll: true, nationality: true, nationalityAll: true,
          languageSpoken: true, locationCityId: true,
        },
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          image: true,
          isVerified: true,
          city: { select: { id: true, name: true } },
          nationality: { select: { name: true, id: true } },
          talentProfile: {
            select: {
              age: true,
              gender: true,
              height: true,
              weight: true,
              hairColor: true,
              hairType: true,
              hairLength: true,
              eyeColor: true,
              chest: true,
              waist: true,
              shoeSize: true,
              bodyStructure: true,
              ethnicityId: true,
              categories: {
                include: { category: { select: { name: true } } },
              },
              languages: {
                include: { language: { select: { id: true } } },
              },
            },
          },
          subscription: {
            include: { plan: { select: { name: true, slug: true, priority: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    job: {
      id: job.id,
      title: job.title,
      subTitle: job.subTitle,
      description: job.description,
      category: job.category,
      companyName: company.companyName,
      location: job.castingCity ? `${job.castingCity.name}${job.castingCity.country ? `, ${job.castingCity.country.name}` : ''}` : null,
      roles: job.roles.map(r => ({
        ...r,
        applicationsCount: applications.filter(a => a.role.id === r.id).length,
      })),
    },
    applications: applications.map(app => ({
      id: app.id,
      status: app.status,
      formData: app.formData,
      appliedAt: app.createdAt,
      role: app.role,
      talent: {
        id: app.user.id,
        firstName: app.user.firstName,
        lastName: app.user.lastName,
        username: app.user.username,
        image: app.user.image ? `${R2_BASE}/profile/${app.user.image}` : null,
        isVerified: app.user.isVerified,
        gender: app.user.talentProfile?.gender,
        age: app.user.talentProfile?.age,
        city: app.user.city?.name,
        cityId: app.user.city?.id,
        nationality: app.user.nationality?.name,
        nationalityId: app.user.nationality?.id,
        ethnicityId: app.user.talentProfile?.ethnicityId,
        languageIds: app.user.talentProfile?.languages.map(l => l.language.id) || [],
        categories: app.user.talentProfile?.categories.map(tc => tc.category.name) || [],
        physical: app.user.talentProfile ? {
          height: app.user.talentProfile.height,
          weight: app.user.talentProfile.weight,
          hairColor: app.user.talentProfile.hairColor,
          hairType: app.user.talentProfile.hairType,
          hairLength: app.user.talentProfile.hairLength,
          eyeColor: app.user.talentProfile.eyeColor,
          chest: app.user.talentProfile.chest,
          waist: app.user.talentProfile.waist,
          shoeSize: app.user.talentProfile.shoeSize,
          bodyStructure: app.user.talentProfile.bodyStructure,
        } : null,
        plan: app.user.subscription?.plan?.slug || 'basic',
      },
    })),
  };
};

export const getApplicationById = async (userId: string, applicationId: string) => {
  const R2_BASE = process.env.R2_PUBLIC_URL as string;
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      role: {
        include: {
          job: {
            include: {
              company: true,
              castingCity: { include: { country: true } },
              shootingCity: { include: { country: true } },
              category: true,
            },
          },
          payment: true,
        },
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          phone: true,
          whatsappNo: true,
          image: true,
          isVerified: true,
          city: { select: { name: true } },
          nationality: { select: { name: true } },
          talentProfile: {
            include: {
              categories: { include: { category: { select: { name: true } } } },
              languages: { include: { language: { select: { name: true } } } },
              dialects: { include: { dialect: { select: { name: true } } } },
              media: { orderBy: { createdAt: 'desc' } },
              careerHistory: { orderBy: { startDate: 'desc' } },
              courses: { orderBy: { year: 'desc' } },
            },
          },
          subscription: {
            include: { plan: { select: { name: true, slug: true, priority: true } } },
          },
        },
      },
    },
  });
  if (!application) throw { statusCode: 404, message: 'Application not found' };

  // Verify recruiter owns the job this application belongs to
  const company = await prisma.companyProfile.findUnique({ where: { userId } });
  if (!company || application.role.job.companyId !== company.id) {
    throw { statusCode: 403, message: 'Forbidden' };
  }

  return {
    ...application,
    user: {
      ...application.user,
      image: application.user.image ? `${R2_BASE}/profile/${application.user.image}` : null,
    },
  };
};

const statusEmailTemplate = (name: string, jobTitle: string, roleTitle: string, status: string, body: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3835A4;">Application Status Update — Yoocasta</h2>
      <p>Hi ${name},</p>
      <p>Your application status has been updated.</p>
      <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C6007E;">
        <p style="margin: 4px 0;"><strong>Job:</strong> ${jobTitle}</p>
        <p style="margin: 4px 0;"><strong>Role:</strong> ${roleTitle}</p>
        <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #C6007E; font-weight: bold;">${status.replace(/_/g, ' ')}</span></p>
      </div>
      <div style="margin: 20px 0; padding: 15px; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px;">
        ${body}
      </div>
      <p style="color: #666; font-size: 12px;">Thanks,<br/>Yoocasta Team</p>
    </div>
  `;
};

export const bulkUpdateStatus = async (userId: string, applicationIds: string[], status: string, subject: string, body: string) => {
  const company = await prisma.companyProfile.findUnique({ where: { userId } });
  if (!company) throw { statusCode: 404, message: 'Company profile not found' };

  const applications = await prisma.application.findMany({
    where: { id: { in: applicationIds } },
    include: {
      role: { include: { job: { select: { title: true, companyId: true } } } },
      user: { select: { id: true, firstName: true, email: true } },
    },
  });

  if (applications.length !== applicationIds.length) {
    throw { statusCode: 404, message: 'Some applications not found' };
  }

  for (const app of applications) {
    if (app.role.job.companyId !== company.id) {
      throw { statusCode: 403, message: `Application ${app.id} does not belong to your company` };
    }
  }

  await prisma.application.updateMany({
    where: { id: { in: applicationIds } },
    data: { status: status as any },
  });

  const emailPromises = applications.map(app => {
    const html = statusEmailTemplate(
      app.user.firstName || 'Applicant',
      app.role.job.title || 'Untitled Job',
      app.role.title || 'Untitled Role',
      status,
      body,
    );
    return sendEmail(app.user.email, subject, html).catch(err => console.error(`Failed to email ${app.user.email}:`, err));
  });

  await Promise.allSettled(emailPromises);

  return { updatedCount: applications.length };
};
