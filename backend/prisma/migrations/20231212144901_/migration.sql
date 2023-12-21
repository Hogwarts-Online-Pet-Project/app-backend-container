/*
  Warnings:

  - You are about to drop the column `Organization_Contract` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `User_Contract` on the `contract` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `contract` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Organization_Contract` ON `contract`;

-- DropIndex
DROP INDEX `User_Contract` ON `contract`;

-- AlterTable
ALTER TABLE `contract` DROP COLUMN `Organization_Contract`,
    DROP COLUMN `User_Contract`,
    ADD COLUMN `organizationId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `contract` ADD CONSTRAINT `contract_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`ID_Organization`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract` ADD CONSTRAINT `contract_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`ID_User`) ON DELETE CASCADE ON UPDATE CASCADE;
