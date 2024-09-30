/*
  Warnings:

  - The values [PAYED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('REFUNDED', 'BACK', 'CANCELLED', 'EXCHANGE', 'TRANSFER_TO_DELIVERY_COMPANY', 'PROCESSING', 'PAYMENT_REFUSED', 'PAYED_AND_DELIVERED', 'PAYED_NOT_DELIVERED');
ALTER TABLE "Package" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;
