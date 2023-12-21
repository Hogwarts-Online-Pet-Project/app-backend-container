-- CreateTable
CREATE TABLE `chat` (
    `ID_Chat` INTEGER NOT NULL AUTO_INCREMENT,
    `Chat_Message` INTEGER NOT NULL,

    INDEX `Chat_Message`(`Chat_Message`),
    PRIMARY KEY (`ID_Chat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contract` (
    `ID_Contract` INTEGER NOT NULL AUTO_INCREMENT,
    `Number_Contract` VARCHAR(50) NOT NULL,
    `Date_start_Contract` DATE NOT NULL,
    `Date_end_Contract` DATE NOT NULL,
    `Amount_Contract` VARCHAR(50) NOT NULL,
    `User_Contract` INTEGER NOT NULL,
    `Organization_Contract` INTEGER NOT NULL,

    INDEX `Organization_Contract`(`Organization_Contract`),
    INDEX `User_Contract`(`User_Contract`),
    PRIMARY KEY (`ID_Contract`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course` (
    `ID_Course` INTEGER NOT NULL AUTO_INCREMENT,
    `Tittle_Course` VARCHAR(50) NOT NULL,
    `Teacher_Course` INTEGER NOT NULL,

    INDEX `Teacher_Course`(`Teacher_Course`),
    PRIMARY KEY (`ID_Course`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lection` (
    `ID_Lection` INTEGER NOT NULL AUTO_INCREMENT,
    `Tittle_Lection` VARCHAR(50) NOT NULL,
    `Theme_Lection` VARCHAR(50) NOT NULL,
    `Format_Lection` VARCHAR(50) NOT NULL,
    `Lection_Course` INTEGER NOT NULL,

    INDEX `Lection_Course`(`Lection_Course`),
    PRIMARY KEY (`ID_Lection`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `ID_Message` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_User_Sender` INTEGER NOT NULL,
    `ID_User_Recipient` INTEGER NOT NULL,

    INDEX `ID_User_Recipient`(`ID_User_Recipient`),
    INDEX `ID_User_Sender`(`ID_User_Sender`),
    PRIMARY KEY (`ID_Message`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organizations` (
    `ID_Organization` INTEGER NOT NULL AUTO_INCREMENT,
    `Tittle_Organization` VARCHAR(50) NOT NULL,
    `Director_Organization` VARCHAR(100) NOT NULL,
    `Payment_account` VARCHAR(50) NOT NULL,
    `INN_Organization` INTEGER NOT NULL,

    UNIQUE INDEX `INN_Organization`(`INN_Organization`),
    PRIMARY KEY (`ID_Organization`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `passed_test` (
    `ID_Passed_Test` INTEGER NOT NULL AUTO_INCREMENT,
    `Score_Passed_Test` VARCHAR(50) NULL,
    `User_Passed_Test` INTEGER NOT NULL,
    `Test_Passed_Test` INTEGER NOT NULL,

    INDEX `Test_Passed_Test`(`Test_Passed_Test`),
    INDEX `User_Passed_Test`(`User_Passed_Test`),
    PRIMARY KEY (`ID_Passed_Test`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question_test` (
    `ID_Question_test` INTEGER NOT NULL AUTO_INCREMENT,
    `Text_Question_test` VARCHAR(200) NOT NULL,
    `Reply_Question_test` VARCHAR(200) NULL,

    PRIMARY KEY (`ID_Question_test`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report` (
    `ID_Report` INTEGER NOT NULL AUTO_INCREMENT,
    `Score_Report` INTEGER NULL,

    PRIMARY KEY (`ID_Report`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_user` (
    `ID_Role_user` INTEGER NOT NULL AUTO_INCREMENT,
    `Tittle_Role_user` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`ID_Role_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test` (
    `ID_Test` INTEGER NOT NULL AUTO_INCREMENT,
    `Tittle_test` VARCHAR(50) NOT NULL,
    `Deadline_test` DATETIME(0) NOT NULL,
    `Test_Course` INTEGER NOT NULL,
    `Test_Question_test` INTEGER NOT NULL,

    INDEX `Test_Course`(`Test_Course`),
    INDEX `Test_Question_test`(`Test_Question_test`),
    PRIMARY KEY (`ID_Test`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `ID_User` INTEGER NOT NULL AUTO_INCREMENT,
    `Last_name_User` VARCHAR(50) NOT NULL,
    `First_name_User` VARCHAR(50) NOT NULL,
    `Middle_name_User` VARCHAR(50) NULL,
    `Email_User` VARCHAR(100) NOT NULL,
    `Role_user_User` INTEGER NOT NULL,
    `Password_User` VARCHAR(50) NOT NULL,
    `Date_of_birth` DATE NOT NULL,
    `Sex_User` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `Email_User`(`Email_User`),
    INDEX `Role_user_User`(`Role_user_User`),
    PRIMARY KEY (`ID_User`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `hashedToken` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RefreshToken_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`ID_User`) ON DELETE CASCADE ON UPDATE CASCADE;
