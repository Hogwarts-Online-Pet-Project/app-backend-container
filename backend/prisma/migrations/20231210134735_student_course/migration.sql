-- CreateTable
CREATE TABLE `student_course` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_course_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_course` ADD CONSTRAINT `student_course_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `users`(`ID_User`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course` ADD CONSTRAINT `student_course_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`ID_Course`) ON DELETE CASCADE ON UPDATE CASCADE;
