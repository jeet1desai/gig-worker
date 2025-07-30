-- CreateEnum
CREATE TYPE "PROFILE_VIEW" AS ENUM ('USER', 'PROVIDER');

-- CreateEnum
CREATE TYPE "RatingStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "ReviewRating" ADD COLUMN     "status" "RatingStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile_view" "PROFILE_VIEW" NOT NULL DEFAULT 'USER';
