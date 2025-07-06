/*
  Warnings:

  - The values [student,tutor] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,approved,suspended] on the enum `RoleStatus` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `target_languages` on the `StudentProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STUDENT', 'TUTOR');
ALTER TABLE "UserRole" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RoleStatus_new" AS ENUM ('NOT_STARTED', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
ALTER TABLE "UserRole" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "UserRole" ALTER COLUMN "status" TYPE "RoleStatus_new" USING ("status"::text::"RoleStatus_new");
ALTER TYPE "RoleStatus" RENAME TO "RoleStatus_old";
ALTER TYPE "RoleStatus_new" RENAME TO "RoleStatus";
DROP TYPE "RoleStatus_old";
ALTER TABLE "UserRole" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';
COMMIT;

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "target_languages",
ADD COLUMN     "target_languages" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "UserRole" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';
