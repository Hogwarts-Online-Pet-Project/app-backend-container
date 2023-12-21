/*
  Warnings:

  - Added the required column `Text_Lection` to the `lection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `tests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lection` ADD COLUMN `Text_Lection` LONGTEXT NOT NULL,
    MODIFY `Tittle_Lection` VARCHAR(255) NOT NULL,
    MODIFY `Theme_Lection` VARCHAR(255) NOT NULL,
    MODIFY `Format_Lection` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `tests` ADD COLUMN `teacherId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `tests` ADD CONSTRAINT `tests_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `users`(`ID_User`) ON DELETE CASCADE ON UPDATE CASCADE;
