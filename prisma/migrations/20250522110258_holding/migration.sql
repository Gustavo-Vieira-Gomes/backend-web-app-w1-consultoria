/*
  Warnings:

  - You are about to drop the column `is_forced_heir` on the `Heir` table. All the data in the column will be lost.
  - You are about to drop the column `birth_date` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnpj]` on the table `Holding` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `incorporationDate` on the `Holding` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `shareCapital` on the `Holding` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'notInformed');

-- AlterTable
ALTER TABLE "Heir" DROP COLUMN "is_forced_heir",
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "isForcedHeir" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Holding" DROP COLUMN "incorporationDate",
ADD COLUMN     "incorporationDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "shareCapital",
ADD COLUMN     "shareCapital" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "birth_date",
DROP COLUMN "password_hash",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "salt" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Holding_cnpj_key" ON "Holding"("cnpj");
