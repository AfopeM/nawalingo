/*
  Warnings:

  - You are about to drop the column `bio` on the `TutorProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TutorProfile" DROP COLUMN "bio",
ADD COLUMN     "intro" TEXT;
