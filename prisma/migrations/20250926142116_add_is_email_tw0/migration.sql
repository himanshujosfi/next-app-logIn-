/*
  Warnings:

  - You are about to drop the `email_verified` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."email_verified" DROP CONSTRAINT "email_verified_userId_fkey";

-- DropTable
DROP TABLE "public"."email_verified";
