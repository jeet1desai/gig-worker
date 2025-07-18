/*
  Warnings:

  - You are about to drop the column `description` on the `CMS` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `CMS` table. All the data in the column will be lost.
  - Added the required column `content` to the `CMS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `CMS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `CMS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `CMS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CMS" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
