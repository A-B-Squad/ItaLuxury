/*
  Warnings:

  - You are about to drop the column `dateOfEnd` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfStart` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `newPrice` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Discount` table. All the data in the column will be lost.
  - Added the required column `percentage` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inventory` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `dateOfEnd` to the `ProductDiscount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfStart` to the `ProductDiscount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `newPrice` to the `ProductDiscount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ProductDiscount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "dateOfEnd",
DROP COLUMN "dateOfStart",
DROP COLUMN "discount",
DROP COLUMN "newPrice",
DROP COLUMN "price",
ADD COLUMN     "percentage" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "inventory" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductDiscount" ADD COLUMN     "dateOfEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateOfStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "newPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
