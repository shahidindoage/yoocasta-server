import prisma from '../../config/db';

export const getAllPlans = async () => {
  const plans = await prisma.plan.findMany({
    orderBy: { priority: 'desc' },
  });
  return plans.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    maxPhotos: p.maxPhotos,
    maxVideos: p.maxVideos,
    maxAudios: p.maxAudios,
    maxJobsPerMonth: p.maxJobsPerMonth,
    priority: p.priority,
  }));
};
