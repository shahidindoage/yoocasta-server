-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerifyToken" TEXT,
ADD COLUMN     "emailVerifyTokenCreatedAt" TIMESTAMP(3);
