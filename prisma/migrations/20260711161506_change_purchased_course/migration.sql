/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- AlterTable
ALTER TABLE "PurchasedCourse" ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "paidVia" DROP NOT NULL;

-- DropTable
DROP TABLE "Payment";
