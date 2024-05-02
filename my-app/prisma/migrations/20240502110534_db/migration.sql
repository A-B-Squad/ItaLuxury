-- CreateTable
CREATE TABLE "content_visibility" (
    "id" TEXT NOT NULL,
    "section" INTEGER NOT NULL,
    "visibility_status" BOOLEAN NOT NULL,

    CONSTRAINT "content_visibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BestSales" (
    "id" TEXT NOT NULL,

    CONSTRAINT "BestSales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BestSalesToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BestSalesToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BestSalesToProduct_AB_unique" ON "_BestSalesToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_BestSalesToProduct_B_index" ON "_BestSalesToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BestSalesToCategory_AB_unique" ON "_BestSalesToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_BestSalesToCategory_B_index" ON "_BestSalesToCategory"("B");

-- AddForeignKey
ALTER TABLE "_BestSalesToProduct" ADD CONSTRAINT "_BestSalesToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "BestSales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BestSalesToProduct" ADD CONSTRAINT "_BestSalesToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BestSalesToCategory" ADD CONSTRAINT "_BestSalesToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "BestSales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BestSalesToCategory" ADD CONSTRAINT "_BestSalesToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
