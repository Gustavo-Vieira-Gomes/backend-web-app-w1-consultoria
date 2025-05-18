/*
  Warnings:

  - You are about to drop the column `cpf` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('cpf', 'rg', 'passport', 'cnh', 'propertyDeed', 'vehicleRegistrationDocument', 'testament');

-- CreateEnum
CREATE TYPE "HeirRelation" AS ENUM ('child', 'sibling', 'parent', 'spouse', 'friend', 'other');

-- CreateEnum
CREATE TYPE "LiabilityType" AS ENUM ('creditCardDebt', 'personalLoan', 'wageLoan', 'carLoan', 'mortgage', 'overdraft', 'businessLoan', 'taxDebt', 'informalLoan', 'other');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('property', 'vehicle', 'stock', 'fixedIncome', 'company', 'jewelry', 'cash', 'crypto', 'other');

-- CreateEnum
CREATE TYPE "MaritalStatusEnum" AS ENUM ('single', 'married', 'divorced', 'widowed', 'separated');

-- CreateEnum
CREATE TYPE "LiquidityLevel" AS ENUM ('high', 'medium', 'low');

-- DropIndex
DROP INDEX "User_cpf_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cpf",
ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "document" TEXT,
ADD COLUMN     "documentType" "DocumentType" NOT NULL DEFAULT 'cpf',
ADD COLUMN     "maritalStatus" "MaritalStatusEnum",
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "photoUrl" TEXT;

-- CreateTable
CREATE TABLE "Heir" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relation" "HeirRelation" NOT NULL,
    "phone" TEXT,
    "percentage" DECIMAL(65,30) NOT NULL,
    "document" TEXT NOT NULL,
    "photoUrl" TEXT,
    "documentType" "DocumentType" NOT NULL DEFAULT 'cpf',
    "is_forced_heir" BOOLEAN NOT NULL DEFAULT true,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Heir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "userId" TEXT,
    "heirId" TEXT,
    "assetId" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Liability" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initialValue" DECIMAL(65,30) NOT NULL,
    "currentValue" DECIMAL(65,30) NOT NULL,
    "type" "LiabilityType" NOT NULL,
    "lender" TEXT,
    "description" TEXT,
    "interestRate" DECIMAL(65,30),
    "dueDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Liability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "initialValue" DECIMAL(65,30) NOT NULL,
    "currentValue" DECIMAL(65,30) NOT NULL,
    "type" "AssetType" NOT NULL,
    "liquidityLevel" "LiquidityLevel" NOT NULL,
    "userId" TEXT NOT NULL,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'BR',
    "userId" TEXT,
    "heirId" TEXT,
    "assetId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_heirId_key" ON "Address"("heirId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_assetId_key" ON "Address"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "User_document_key" ON "User"("document");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_heirId_fkey" FOREIGN KEY ("heirId") REFERENCES "Heir"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liability" ADD CONSTRAINT "Liability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_heirId_fkey" FOREIGN KEY ("heirId") REFERENCES "Heir"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
