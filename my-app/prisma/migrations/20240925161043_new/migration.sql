/*
  Warnings:

  - Added the required column `integrationFor` to the `ApiCredentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiCredentials" ADD COLUMN     "integrationFor" TEXT NOT NULL;
