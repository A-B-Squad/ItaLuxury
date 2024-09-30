-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "freeDelivery" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sameProductsId" TEXT;

-- CreateTable
CREATE TABLE "SameProducts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SameProducts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SameProducts_name_key" ON "SameProducts"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sameProductsId_fkey" FOREIGN KEY ("sameProductsId") REFERENCES "SameProducts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
