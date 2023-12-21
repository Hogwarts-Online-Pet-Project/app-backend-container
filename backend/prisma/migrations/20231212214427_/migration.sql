/*
  Warnings:

  - You are about to drop the column `Lection_Course` on the `lection` table. All the data in the column will be lost.
  - You are about to drop the column `Test_Course` on the `tests` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `lection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `lection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `tests` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Lection_Course` ON `lection`;

-- DropIndex
DROP INDEX `Test_Course` ON `tests`;

-- AlterTable
ALTER TABLE `lection` DROP COLUMN `Lection_Course`,
    ADD COLUMN `courseId` INTEGER NOT NULL,
    ADD COLUMN `teacherId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tests` DROP COLUMN `Test_Course`,
    ADD COLUMN `courseId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `lection` ADD CONSTRAINT `lection_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `users`(`ID_User`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lection` ADD CONSTRAINT `lection_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`ID_Course`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tests` ADD CONSTRAINT `tests_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`ID_Course`) ON DELETE CASCADE ON UPDATE CASCADE;
