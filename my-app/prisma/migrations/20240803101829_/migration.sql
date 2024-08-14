/*
  Warnings:

  - A unique constraint covering the columns `[Hex]` on the table `Colors` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Colors_Hex_key" ON "Colors"("Hex");
