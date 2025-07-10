/*
  Warnings:

  - The `maxBids` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `maxGigs` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Plan"
ADD COLUMN IF NOT EXISTS "maxBids" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "maxGigs" INTEGER NOT NULL DEFAULT 0;