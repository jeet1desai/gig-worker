/*
  Warnings:

  - The `maxBids` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `maxGigs` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "maxBids",
ADD COLUMN     "maxBids" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "maxGigs",
ADD COLUMN     "maxGigs" INTEGER NOT NULL DEFAULT 0;
