/*
  Warnings:

  - You are about to drop the column `categoryId` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the `MenuCategory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[restaurantId,name]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."MenuCategory" DROP CONSTRAINT "MenuCategory_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MenuItem" DROP CONSTRAINT "MenuItem_categoryId_fkey";

-- DropIndex
DROP INDEX "public"."MenuItem_categoryId_idx";

-- DropIndex
DROP INDEX "public"."MenuItem_categoryId_name_key";

-- AlterTable
ALTER TABLE "public"."MenuItem" DROP COLUMN "categoryId",
ADD COLUMN     "category" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."MenuCategory";

-- CreateIndex
CREATE INDEX "MenuItem_category_idx" ON "public"."MenuItem"("category");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_restaurantId_name_key" ON "public"."MenuItem"("restaurantId", "name");
