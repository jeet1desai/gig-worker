/*
  Warnings:

  - You are about to drop the column `color` on the `CMS` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `CMS` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `CMS` table. All the data in the column will be lost.
  - You are about to drop the column `isVisible` on the `CMS` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `CMS` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `CMS` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `CMS` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `CMS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CMS` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `CMS` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('landing', 'informative', 'faqs');

-- AlterTable
ALTER TABLE "CMS" DROP COLUMN "color",
DROP COLUMN "content",
DROP COLUMN "created_at",
DROP COLUMN "isVisible",
DROP COLUMN "order",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "faqs" JSONB,
ADD COLUMN     "heroSection" JSONB,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "richContent" JSONB,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "steps" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "PageType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CMS_slug_key" ON "CMS"("slug");
