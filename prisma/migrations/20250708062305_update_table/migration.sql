/*
  Warnings:

  - The `interests` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `extracurricular` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `certifications` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `skills` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `educations` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "interests",
ADD COLUMN     "interests" JSONB,
DROP COLUMN "extracurricular",
ADD COLUMN     "extracurricular" JSONB,
DROP COLUMN "certifications",
ADD COLUMN     "certifications" JSONB,
DROP COLUMN "skills",
ADD COLUMN     "skills" JSONB,
DROP COLUMN "educations",
ADD COLUMN     "educations" JSONB;
