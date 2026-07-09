/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId,level]` on the table `Floor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Floor_restaurantId_level_key" ON "public"."Floor"("restaurantId", "level");
