-- CreateTable
CREATE TABLE `log_student_reply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` LONGTEXT NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_user_change_password` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `old` VARCHAR(50) NOT NULL,
    `new` VARCHAR(50) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `log_student_reply` ADD CONSTRAINT `log_student_reply_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`ID_User`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_user_change_password` ADD CONSTRAINT `log_user_change_password_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`ID_User`) ON DELETE CASCADE ON UPDATE CASCADE;
