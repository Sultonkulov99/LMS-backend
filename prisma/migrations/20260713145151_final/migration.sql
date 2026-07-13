-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_lessonGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ExamResult" DROP CONSTRAINT "ExamResult_lessonGroupId_fkey";

-- AlterTable
ALTER TABLE "Exam" ALTER COLUMN "lessonGroupId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ExamResult" ALTER COLUMN "lessonGroupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_lessonGroupId_fkey" FOREIGN KEY ("lessonGroupId") REFERENCES "LessonGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_lessonGroupId_fkey" FOREIGN KEY ("lessonGroupId") REFERENCES "LessonGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
