/*
  Warnings:

  - The `type` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `module` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NOTIFICATION_TYPE" AS ENUM ('success', 'warning', 'error', 'info');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "module" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "NOTIFICATION_TYPE" NOT NULL DEFAULT 'info';
