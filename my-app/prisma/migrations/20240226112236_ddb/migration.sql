-- CreateEnum
CREATE TYPE "Cause" AS ENUM ('BROKEN', 'COLOR', 'CANCLED');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'PROCESSING';

-- CreateTable
CREATE TABLE "BackOrExchange" (
    "id" TEXT NOT NULL,
    "cause" "Cause" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "productId" TEXT NOT NULL,

    CONSTRAINT "BackOrExchange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BackOrExchange" ADD CONSTRAINT "BackOrExchange_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
