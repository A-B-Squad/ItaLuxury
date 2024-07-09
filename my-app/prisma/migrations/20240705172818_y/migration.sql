/*
  Warnings:

  - You are about to drop the `BackOrExchange` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BackOrExchange" DROP CONSTRAINT "BackOrExchange_productId_fkey";

-- DropTable
DROP TABLE "BackOrExchange";

-- CreateTable
CREATE TABLE "BreakedProduct" (
    "id" TEXT NOT NULL,
    "cause" TEXT NOT NULL DEFAULT 'BROKEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,

    CONSTRAINT "BreakedProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BreakedProduct" ADD CONSTRAINT "BreakedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
