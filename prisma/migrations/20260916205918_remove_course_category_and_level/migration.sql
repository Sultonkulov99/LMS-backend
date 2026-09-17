-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_categoryId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "categoryId",
DROP COLUMN "level";

-- DropTable
DROP TABLE "CourseCategory";

-- DropEnum
DROP TYPE "CourseLevel";

