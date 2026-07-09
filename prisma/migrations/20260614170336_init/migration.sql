-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TALENT', 'RECRUITER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'RENEWED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "whatsappNo" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "website" TEXT,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "nationalityId" TEXT,
    "cityId" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "otp" TEXT,
    "otpCreatedAt" TIMESTAMP(3),
    "resetPassKey" TEXT,
    "resetPassKeyCreatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "google_oauth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "google_oauth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT,
    "gender" TEXT,
    "dob" TIMESTAMP(3),
    "age" INTEGER,
    "hairColor" TEXT,
    "hairType" TEXT,
    "hairLength" TEXT,
    "eyeColor" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "chest" TEXT,
    "waist" TEXT,
    "shoeSize" TEXT,
    "bodyStructure" TEXT,
    "tattoo" TEXT,
    "tattooComment" TEXT,
    "ethnicityId" TEXT,
    "address" TEXT,
    "cityId" TEXT,
    "experience" INTEGER,
    "bioDescription" TEXT,
    "skillDescription" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "googleProfile" TEXT,
    "whatsappNo" TEXT,
    "contactNumber" TEXT,
    "contactEmail" TEXT,
    "castingVideo" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "talent_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_attributes" (
    "id" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "profile_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_media" (
    "id" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_history" (
    "id" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "career_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_courses" (
    "id" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "institution" TEXT,
    "year" INTEGER,

    CONSTRAINT "talent_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_likes" (
    "id" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "likedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT,
    "isInternalCompany" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_favourites" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "talentUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_favourites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT,
    "description" TEXT,
    "service" TEXT,
    "categoryId" TEXT,
    "subCategoryId" TEXT,
    "projectTypeId" TEXT,
    "cityId" TEXT,
    "shootingCityId" TEXT,
    "totalCastRequired" INTEGER,
    "ageMin" INTEGER,
    "ageMax" INTEGER,
    "gender" TEXT,
    "shootingDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "usage" TEXT,
    "image" TEXT,
    "paymentInfo" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "noOfCast" INTEGER,
    "ethnicity" TEXT,
    "ethnicityAll" BOOLEAN NOT NULL DEFAULT false,
    "nationality" TEXT,
    "nationalityAll" BOOLEAN NOT NULL DEFAULT false,
    "languageSpoken" TEXT,
    "dialectsSpoken" TEXT,
    "gender" TEXT,
    "ageMin" INTEGER,
    "ageMax" INTEGER,
    "experience" TEXT,
    "experienceAll" BOOLEAN NOT NULL DEFAULT false,
    "paymentInfo" TEXT,
    "paymentType" TEXT,
    "usage" TEXT,
    "location" TEXT,
    "country" TEXT,
    "requiredProfileVideo" BOOLEAN NOT NULL DEFAULT false,
    "requiredCastingVideo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cast_bags" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cast_bags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cast_bag_talents" (
    "id" TEXT NOT NULL,
    "castBagId" TEXT NOT NULL,
    "talentUserId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cast_bag_talents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cast_bag_links" (
    "id" TEXT NOT NULL,
    "castBagId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cast_bag_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cast_bag_feedback" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "talentUserId" TEXT NOT NULL,
    "reviewerName" TEXT,
    "reviewerEmail" TEXT,
    "comment" TEXT,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cast_bag_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_usages" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "projectName" TEXT,
    "contractStart" TIMESTAMP(3) NOT NULL,
    "contractExpiry" TIMESTAMP(3) NOT NULL,
    "usageDuration" TEXT,
    "status" "ContractStatus" NOT NULL DEFAULT 'ACTIVE',
    "renewalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_usage_talents" (
    "id" TEXT NOT NULL,
    "contractUsageId" TEXT NOT NULL,
    "talentUserId" TEXT NOT NULL,

    CONSTRAINT "contract_usage_talents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renewal_history" (
    "id" TEXT NOT NULL,
    "contractUsageId" TEXT NOT NULL,
    "oldExpiryDate" TIMESTAMP(3) NOT NULL,
    "newExpiryDate" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "renewal_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_categories" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_categories" (
    "id" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "talent_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "project_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryId" TEXT,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nationalities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "nationalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ethnicities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ethnicities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_languages" (
    "id" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "talent_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dialects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "dialects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_dialects" (
    "id" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "dialectId" TEXT NOT NULL,

    CONSTRAINT "talent_dialects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "google_oauth_userId_key" ON "google_oauth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "talent_profiles_userId_key" ON "talent_profiles"("userId");

-- CreateIndex
CREATE INDEX "profile_attributes_talentProfileId_categoryId_idx" ON "profile_attributes"("talentProfileId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_likes_talentProfileId_likedByUserId_key" ON "profile_likes"("talentProfileId", "likedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "company_profiles_userId_key" ON "company_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "company_favourites_companyId_talentUserId_key" ON "company_favourites"("companyId", "talentUserId");

-- CreateIndex
CREATE UNIQUE INDEX "applications_userId_roleId_key" ON "applications"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "cast_bag_talents_castBagId_talentUserId_key" ON "cast_bag_talents"("castBagId", "talentUserId");

-- CreateIndex
CREATE UNIQUE INDEX "cast_bag_links_token_key" ON "cast_bag_links"("token");

-- CreateIndex
CREATE UNIQUE INDEX "contract_usage_talents_contractUsageId_talentUserId_key" ON "contract_usage_talents"("contractUsageId", "talentUserId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "talent_categories_talentProfileId_categoryId_key" ON "talent_categories"("talentProfileId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "project_types_name_key" ON "project_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "nationalities_name_key" ON "nationalities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ethnicities_name_key" ON "ethnicities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "languages_name_key" ON "languages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "talent_languages_talentProfileId_languageId_key" ON "talent_languages"("talentProfileId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "dialects_name_key" ON "dialects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "talent_dialects_talentProfileId_dialectId_key" ON "talent_dialects"("talentProfileId", "dialectId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_nationalityId_fkey" FOREIGN KEY ("nationalityId") REFERENCES "nationalities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "google_oauth" ADD CONSTRAINT "google_oauth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_profiles" ADD CONSTRAINT "talent_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_profiles" ADD CONSTRAINT "talent_profiles_ethnicityId_fkey" FOREIGN KEY ("ethnicityId") REFERENCES "ethnicities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_profiles" ADD CONSTRAINT "talent_profiles_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_attributes" ADD CONSTRAINT "profile_attributes_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_attributes" ADD CONSTRAINT "profile_attributes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_media" ADD CONSTRAINT "portfolio_media_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_history" ADD CONSTRAINT "career_history_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_courses" ADD CONSTRAINT "talent_courses_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_likes" ADD CONSTRAINT "profile_likes_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_profiles" ADD CONSTRAINT "company_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_favourites" ADD CONSTRAINT "company_favourites_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_favourites" ADD CONSTRAINT "company_favourites_talentUserId_fkey" FOREIGN KEY ("talentUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_projectTypeId_fkey" FOREIGN KEY ("projectTypeId") REFERENCES "project_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_shootingCityId_fkey" FOREIGN KEY ("shootingCityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cast_bags" ADD CONSTRAINT "cast_bags_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cast_bag_talents" ADD CONSTRAINT "cast_bag_talents_castBagId_fkey" FOREIGN KEY ("castBagId") REFERENCES "cast_bags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cast_bag_talents" ADD CONSTRAINT "cast_bag_talents_talentUserId_fkey" FOREIGN KEY ("talentUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cast_bag_links" ADD CONSTRAINT "cast_bag_links_castBagId_fkey" FOREIGN KEY ("castBagId") REFERENCES "cast_bags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cast_bag_feedback" ADD CONSTRAINT "cast_bag_feedback_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "cast_bag_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cast_bag_feedback" ADD CONSTRAINT "cast_bag_feedback_talentUserId_fkey" FOREIGN KEY ("talentUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_usages" ADD CONSTRAINT "contract_usages_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_usages" ADD CONSTRAINT "contract_usages_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_usage_talents" ADD CONSTRAINT "contract_usage_talents_contractUsageId_fkey" FOREIGN KEY ("contractUsageId") REFERENCES "contract_usages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_usage_talents" ADD CONSTRAINT "contract_usage_talents_talentUserId_fkey" FOREIGN KEY ("talentUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renewal_history" ADD CONSTRAINT "renewal_history_contractUsageId_fkey" FOREIGN KEY ("contractUsageId") REFERENCES "contract_usages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_categories" ADD CONSTRAINT "talent_categories_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_categories" ADD CONSTRAINT "talent_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_languages" ADD CONSTRAINT "talent_languages_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_languages" ADD CONSTRAINT "talent_languages_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_dialects" ADD CONSTRAINT "talent_dialects_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_dialects" ADD CONSTRAINT "talent_dialects_dialectId_fkey" FOREIGN KEY ("dialectId") REFERENCES "dialects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
