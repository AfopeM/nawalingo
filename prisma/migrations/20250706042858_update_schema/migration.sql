/*
  Warnings:

  - You are about to drop the column `full_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `StudentPreferences` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,role]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AvailabilityType" AS ENUM ('STUDENT_PREFERRED', 'TUTOR_AVAILABLE');

-- DropForeignKey
ALTER TABLE "StudentPreferences" DROP CONSTRAINT "StudentPreferences_user_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "full_name",
ADD COLUMN     "profile_image_url" TEXT,
ADD COLUMN     "username" TEXT;

-- DropTable
DROP TABLE "StudentPreferences";

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "target_languages" TEXT[],
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorProfile" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "bio" TEXT,
    "languages_taught" JSONB NOT NULL,
    "teaching_experience" TEXT,
    "country" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "AvailabilityType" NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_minute" INTEGER NOT NULL,
    "end_minute" INTEGER NOT NULL,
    "timezone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorRating" (
    "id" UUID NOT NULL,
    "tutor_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT,
    "session_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TutorRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_user_id_key" ON "StudentProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "TutorProfile_user_id_key" ON "TutorProfile"("user_id");

-- CreateIndex
CREATE INDEX "Availability_user_id_day_of_week_idx" ON "Availability"("user_id", "day_of_week");

-- CreateIndex
CREATE INDEX "Availability_day_of_week_start_minute_end_minute_idx" ON "Availability"("day_of_week", "start_minute", "end_minute");

-- CreateIndex
CREATE INDEX "Availability_type_day_of_week_start_minute_end_minute_idx" ON "Availability"("type", "day_of_week", "start_minute", "end_minute");

-- CreateIndex
CREATE INDEX "TutorRating_tutor_id_idx" ON "TutorRating"("tutor_id");

-- CreateIndex
CREATE INDEX "TutorRating_student_id_idx" ON "TutorRating"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_user_id_role_key" ON "UserRole"("user_id", "role");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorProfile" ADD CONSTRAINT "TutorProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorRating" ADD CONSTRAINT "TutorRating_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorRating" ADD CONSTRAINT "TutorRating_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
