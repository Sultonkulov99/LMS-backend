-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "youtube_link" TEXT,
ALTER COLUMN "video" DROP NOT NULL;
