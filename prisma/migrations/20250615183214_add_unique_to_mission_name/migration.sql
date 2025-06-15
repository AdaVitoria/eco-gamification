/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Mission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Mission_name_key" ON "Mission"("name");
