/*
  Warnings:

  - You are about to drop the column `new` on the `log_user_change_password` table. All the data in the column will be lost.
  - You are about to drop the column `old` on the `log_user_change_password` table. All the data in the column will be lost.
  - Added the required column `pass_new` to the `log_user_change_password` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pass_old` to the `log_user_change_password` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `log_student_reply` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `log_user_change_password` DROP COLUMN `new`,
    DROP COLUMN `old`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `pass_new` VARCHAR(128) NOT NULL,
    ADD COLUMN `pass_old` VARCHAR(128) NOT NULL;
