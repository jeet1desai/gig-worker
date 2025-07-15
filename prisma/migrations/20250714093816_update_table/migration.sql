/*
  Warnings:

  - The `keywords` column on the `Gig` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `attachments` column on the `Gig` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Gig" DROP COLUMN "keywords",
ADD COLUMN     "keywords" JSONB,
DROP COLUMN "attachments",
ADD COLUMN     "attachments" JSONB;
