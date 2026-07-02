/*
  Warnings:

  - The values [USER,SUPPERADMIN] on the enum `Roles` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[contact]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contact` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Roles_new" AS ENUM ('TEACHER', 'STUDENT', 'ADMIN', 'SUPERADMIN');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Roles_new" USING ("role"::text::"Roles_new");
ALTER TYPE "Roles" RENAME TO "Roles_old";
ALTER TYPE "Roles_new" RENAME TO "Roles";
DROP TYPE "public"."Roles_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "contact" TEXT NOT NULL,
ALTER COLUMN "role" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "users_contact_key" ON "users"("contact");
