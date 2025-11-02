/*
  Warnings:

  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;

-- CreateTable
CREATE TABLE "Favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "catsId" TEXT NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_userId_catsId_key" ON "Favorites"("userId", "catsId");

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_catsId_fkey" FOREIGN KEY ("catsId") REFERENCES "Cats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
