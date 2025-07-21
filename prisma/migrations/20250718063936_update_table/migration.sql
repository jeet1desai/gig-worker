-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reset_token_used" BOOLEAN NOT NULL DEFAULT false;
