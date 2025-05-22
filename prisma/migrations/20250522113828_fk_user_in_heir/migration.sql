/*
  Warnings:

  - Added the required column `userId` to the `Heir` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Heir" ADD COLUMN     "uploadedDocumentType" "DocumentType",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Heir" ADD CONSTRAINT "Heir_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
