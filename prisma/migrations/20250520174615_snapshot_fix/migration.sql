/*
  Warnings:

  - You are about to drop the column `totalLiabilities` on the `MonthlySnapshot` table. All the data in the column will be lost.
  - Added the required column `netWorth` to the `MonthlySnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MonthlySnapshot" DROP COLUMN "totalLiabilities",
ADD COLUMN     "netWorth" DECIMAL(65,30) NOT NULL;
