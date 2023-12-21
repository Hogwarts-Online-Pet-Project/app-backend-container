/*
  Warnings:

  - You are about to drop the column `createdAt` on the `student_course` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `student_course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `student_course` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;
