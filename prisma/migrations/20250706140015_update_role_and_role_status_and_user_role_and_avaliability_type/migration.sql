/*
  Warnings:

  - The values [STUDENT_PREFERRED,TUTOR_AVAILABLE] on the enum `AvailabilityType` will be removed. If these variants are still used in the database, this will fail.
  - The values [NOT_STARTED,PENDING] on the enum `RoleStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AvailabilityType_new" AS ENUM ('STUDENT_AVAILABILITY', 'TUTOR_AVAILABILITY');
ALTER TABLE "Availability" ALTER COLUMN "type" TYPE "AvailabilityType_new" USING ("type"::text::"AvailabilityType_new");
ALTER TYPE "AvailabilityType" RENAME TO "AvailabilityType_old";
ALTER TYPE "AvailabilityType_new" RENAME TO "AvailabilityType";
DROP TYPE "AvailabilityType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterEnum
BEGIN;
CREATE TYPE "RoleStatus_new" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'REJECTED', 'SUSPENDED');
ALTER TABLE "UserRole" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "UserRole" ALTER COLUMN "status" TYPE "RoleStatus_new" USING ("status"::text::"RoleStatus_new");
ALTER TYPE "RoleStatus" RENAME TO "RoleStatus_old";
ALTER TYPE "RoleStatus_new" RENAME TO "RoleStatus";
DROP TYPE "RoleStatus_old";
ALTER TABLE "UserRole" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
COMMIT;

-- AlterTable
ALTER TABLE "UserRole" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
