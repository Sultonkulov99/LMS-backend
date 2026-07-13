/*
  Warnings:

  - You are about to drop the column `lessonGroupId` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `lessonGroupId` on the `ExamResult` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_lessonGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ExamResult" DROP CONSTRAINT "ExamResult_lessonGroupId_fkey";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "lessonGroupId";

-- AlterTable
ALTER TABLE "ExamResult" DROP COLUMN "lessonGroupId";
