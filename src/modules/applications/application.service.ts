import prisma from '../../config/db';

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
