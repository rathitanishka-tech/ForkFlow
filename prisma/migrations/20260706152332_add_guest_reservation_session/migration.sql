-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SEATED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "public"."DiningSessionStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateTable
CREATE TABLE "public"."Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reservation" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "reservationDate" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "occasion" TEXT,
    "seatingPreference" TEXT,
    "noisePreference" TEXT,
    "status" "public"."ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DiningSession" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "reservationId" TEXT,
    "guestId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "status" "public"."DiningSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiningSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_phone_key" ON "public"."Guest"("phone");

-- CreateIndex
CREATE INDEX "Reservation_restaurantId_idx" ON "public"."Reservation"("restaurantId");

-- CreateIndex
CREATE INDEX "Reservation_tableId_idx" ON "public"."Reservation"("tableId");

-- CreateIndex
CREATE INDEX "Reservation_guestId_idx" ON "public"."Reservation"("guestId");

-- CreateIndex
CREATE INDEX "Reservation_restaurantId_reservationDate_idx" ON "public"."Reservation"("restaurantId", "reservationDate");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_tableId_reservationDate_key" ON "public"."Reservation"("tableId", "reservationDate");

-- CreateIndex
CREATE UNIQUE INDEX "DiningSession_reservationId_key" ON "public"."DiningSession"("reservationId");

-- CreateIndex
CREATE INDEX "DiningSession_restaurantId_idx" ON "public"."DiningSession"("restaurantId");

-- CreateIndex
CREATE INDEX "DiningSession_tableId_idx" ON "public"."DiningSession"("tableId");

-- CreateIndex
CREATE INDEX "DiningSession_reservationId_idx" ON "public"."DiningSession"("reservationId");

-- CreateIndex
CREATE INDEX "DiningSession_guestId_idx" ON "public"."DiningSession"("guestId");

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "public"."Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "public"."Table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "public"."Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiningSession" ADD CONSTRAINT "DiningSession_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "public"."Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiningSession" ADD CONSTRAINT "DiningSession_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "public"."Table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiningSession" ADD CONSTRAINT "DiningSession_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "public"."Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiningSession" ADD CONSTRAINT "DiningSession_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "public"."Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
