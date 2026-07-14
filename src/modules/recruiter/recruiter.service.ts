import prisma from '../../config/db';
import { uploadToR2, deleteFromR2 } from '../../config/r2';

export const getRecruiterProfile = async (userId: string) => {
  // Change findUnique to include the user's city data
   const profile = await prisma.companyProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          isVerified: true,        // ADD THIS
          isEmailVerified: true,   // ADD THIS
           phone: true,         // ADD THIS
            whatsappNo: true,     // ADD THIS
          cityId: true,
          city: { select: { name: true, countryId: true, country: { select: { name: true, id: true } } } }
        }
      }
    },
  });

  if (!profile) throw { statusCode: 404, message: 'Company profile not found' };

  const R2_BASE = process.env.R2_PUBLIC_URL;
  return {
    ...profile,
    logo: profile.logo ? `${R2_BASE}/company/${profile.logo}` : null,
    tradeLicenseFile: profile.tradeLicenseFile ? `${R2_BASE}/license/${profile.tradeLicenseFile}` : null,
    // Pass user location data up to the frontend
    userCityId: profile.user.cityId,
    userCountryId: profile.user.city?.country?.id || null,
  };
};

export const updateRecruiterProfile = async (userId: string, data: any) => {
  
  if (data.phone !== undefined || data.whatsappNo !== undefined) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.whatsappNo !== undefined && { whatsappNo: data.whatsappNo }),
      }
    });
  }
  
  const profile = await prisma.companyProfile.update({
    where: { userId },
    data: {
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      description: data.description,
      website: data.website,
      companyType: data.companyType,
      tradeLicense: data.tradeLicense,
    },
  });

  // ADDED: Mark the user's profile as complete
  await prisma.user.update({
    where: { id: userId },
    data: { profileCompleted: true },
  });

  return { message: 'Profile updated successfully', profile };
};

export const uploadLogoService = async (userId: string, file: Express.Multer.File) => {
  const profile = await prisma.companyProfile.findUnique({ where: { userId } });
  if (!profile) throw { statusCode: 404, message: 'Profile not found' };

  if (profile.logo) {
    try { await deleteFromR2(`${process.env.R2_PUBLIC_URL}/company/${profile.logo}`); } catch (e) {}
  }

  const url = await uploadToR2(file.buffer, file.originalname, file.mimetype, 'company');
  const fileName = url.split('/').pop()!;

  await prisma.companyProfile.update({
    where: { userId },
    data: { logo: fileName },
  });

  return { logo: url, message: 'Logo uploaded successfully' };
};

export const uploadTradeLicenseService = async (userId: string, file: Express.Multer.File) => {
  const profile = await prisma.companyProfile.findUnique({ where: { userId } });
  if (!profile) throw { statusCode: 404, message: 'Profile not found' };

  // Delete old file if they are replacing it
  if (profile.tradeLicenseFile) {
    try { await deleteFromR2(profile.tradeLicenseFile); } catch (e) { /* ignore */ }
  }

  // Upload to R2 inside a 'company/license' folder
  const url = await uploadToR2(file.buffer, file.originalname, file.mimetype, 'license');
  const fileName = url.split('/').pop()!;

  await prisma.companyProfile.update({
    where: { userId },
    data: { tradeLicenseFile: fileName },
  });

  return { tradeLicenseFile: url, message: 'Trade license uploaded successfully' };
};

export const updateRecruiterLocation = async (userId: string, cityId: string | null) => {
  await prisma.user.update({
    where: { id: userId },
    data: { cityId: cityId || null },
  });
  return { message: 'Location updated successfully' };
};