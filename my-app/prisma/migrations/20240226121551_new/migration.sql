/*
  Warnings:

  - You are about to drop the column `productIds` on the `Checkout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Checkout" DROP COLUMN "productIds";

-- CreateTable
CREATE TABLE "ProductInCheckout" (
    "id" TEXT NOT NULL,
    "checkoutId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productQuantity" INTEGER NOT NULL,

    CONSTRAINT "ProductInCheckout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductInCheckout" ADD CONSTRAINT "ProductInCheckout_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "Checkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInCheckout" ADD CONSTRAINT "ProductInCheckout_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
