/*
  Warnings:

  - Added the required column `paymentMethod` to the `Checkout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'CASH_ON_DELIVERY');

-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL;
