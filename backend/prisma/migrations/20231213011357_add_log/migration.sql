-- AlterTable
ALTER TABLE `log_user_change_password` MODIFY `old` VARCHAR(128) NOT NULL,
    MODIFY `new` VARCHAR(128) NOT NULL;
