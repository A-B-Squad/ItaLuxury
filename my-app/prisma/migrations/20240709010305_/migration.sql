/*
  Warnings:

  - The values [COLOR] on the enum `Cause` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Cause_new" AS ENUM ('BROKEN', 'CANCEL', 'REFUND');
ALTER TYPE "Cause" RENAME TO "Cause_old";
ALTER TYPE "Cause_new" RENAME TO "Cause";
DROP TYPE "Cause_old";
COMMIT;
