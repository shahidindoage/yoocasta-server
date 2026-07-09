-- AlterTable
ALTER TABLE "portfolio_media" ADD COLUMN     "folder" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "videoLink" TEXT,
ALTER COLUMN "url" DROP NOT NULL;
