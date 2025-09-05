/*
  Warnings:

  - You are about to drop the column `name` on the `Role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[value]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[description]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Role_name_key";

-- AlterTable
ALTER TABLE "public"."Role" DROP COLUMN "name",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role_value_key" ON "public"."Role"("value");

-- CreateIndex
CREATE UNIQUE INDEX "Role_description_key" ON "public"."Role"("description");
