/*
  Warnings:

  - The values [testament] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `assetId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `heirId` on the `Address` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[zipCode,number]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DocumentType_new" AS ENUM ('cpf', 'rg', 'passport', 'cnh', 'propertyDeed', 'vehicleRegistrationDocument', 'marriageComprovation');
ALTER TABLE "Heir" ALTER COLUMN "documentType" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "documentType" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "documentType" TYPE "DocumentType_new" USING ("documentType"::text::"DocumentType_new");
ALTER TABLE "Heir" ALTER COLUMN "documentType" TYPE "DocumentType_new" USING ("documentType"::text::"DocumentType_new");
ALTER TABLE "Document" ALTER COLUMN "type" TYPE "DocumentType_new" USING ("type"::text::"DocumentType_new");
ALTER TYPE "DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "DocumentType_old";
ALTER TABLE "Heir" ALTER COLUMN "documentType" SET DEFAULT 'cpf';
ALTER TABLE "User" ALTER COLUMN "documentType" SET DEFAULT 'cpf';
COMMIT;

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_heirId_fkey";

-- DropIndex
DROP INDEX "Address_assetId_key";

-- DropIndex
DROP INDEX "Address_heirId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "assetId",
DROP COLUMN "heirId";

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "addressId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Heir" ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "holdingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Address_zipCode_number_key" ON "Address"("zipCode", "number");

-- AddForeignKey
ALTER TABLE "Heir" ADD CONSTRAINT "Heir_holdingId_fkey" FOREIGN KEY ("holdingId") REFERENCES "Holding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Heir" ADD CONSTRAINT "Heir_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
