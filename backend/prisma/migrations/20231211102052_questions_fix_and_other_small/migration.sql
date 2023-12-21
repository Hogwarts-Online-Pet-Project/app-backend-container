/*
  Warnings:

  - You are about to drop the `question_test` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `contract` ADD COLUMN `Download_Contract` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `question_test`;

-- DropTable
DROP TABLE `test`;

-- CreateTable
CREATE TABLE `questions` (
    `ID_Question` INTEGER NOT NULL AUTO_INCREMENT,
    `Text_Question` VARCHAR(200) NOT NULL,
    `Answer_Question` VARCHAR(200) NOT NULL,
    `teacherId` INTEGER NOT NULL,

    PRIMARY KEY (`ID_Question`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tests` (
    `ID_Test` INTEGER NOT NULL AUTO_INCREMENT,
    `Tittle_test` VARCHAR(50) NOT NULL,
    `Deadline_test` DATETIME(0) NOT NULL,
    `Test_Course` INTEGER NOT NULL,

    INDEX `Test_Course`(`Test_Course`),
    PRIMARY KEY (`ID_Test`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `testId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `users`(`ID_User`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_question` ADD CONSTRAINT `test_question_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `tests`(`ID_Test`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_question` ADD CONSTRAINT `test_question_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `questions`(`ID_Question`) ON DELETE CASCADE ON UPDATE CASCADE;
