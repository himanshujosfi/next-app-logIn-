/*
  Warnings:

  - You are about to drop the column `goodleId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_goodleId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "goodleId",
ADD COLUMN     "googleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
