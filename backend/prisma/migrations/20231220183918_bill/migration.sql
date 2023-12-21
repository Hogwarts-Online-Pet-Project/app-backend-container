-- CreateTable
CREATE TABLE `bill` (
    `ID_Bill` INTEGER NOT NULL AUTO_INCREMENT,
    `Date_Registration_Bill` DATETIME(3) NOT NULL,
    `Payment_Type_Bill` VARCHAR(50) NOT NULL,
    `contractId` INTEGER NOT NULL,

    PRIMARY KEY (`ID_Bill`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bill` ADD CONSTRAINT `bill_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `contract`(`ID_Contract`) ON DELETE CASCADE ON UPDATE CASCADE;
