-- DropIndex
DROP INDEX `Role_user_User` ON `users`;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_Role_user_User_fkey` FOREIGN KEY (`Role_user_User`) REFERENCES `role_user`(`ID_Role_user`) ON DELETE CASCADE ON UPDATE CASCADE;
