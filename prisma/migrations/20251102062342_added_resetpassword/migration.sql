/*
  Warnings:

  - You are about to drop the `Favorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Favorites" DROP CONSTRAINT "Favorites_catsId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Favorites" DROP CONSTRAINT "Favorites_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."Favorites";

-- CreateTable
CREATE TABLE "ResetPassword" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetPassword_pkey" PRIMARY KEY ("id")
);
