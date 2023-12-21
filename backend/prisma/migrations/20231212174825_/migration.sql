/*
  Warnings:

  - You are about to drop the column `Download_Contract` on the `contract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `contract` DROP COLUMN `Download_Contract`,
    ADD COLUMN `Contract_File` VARCHAR(191) NULL;
