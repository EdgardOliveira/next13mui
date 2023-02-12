/*
  Warnings:

  - You are about to drop the column `access` on the `permissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `permissions` DROP COLUMN `access`,
    ADD COLUMN `addAccess` ENUM('ALLOWED', 'DENIED') NOT NULL DEFAULT 'DENIED',
    ADD COLUMN `deleteAccess` ENUM('ALLOWED', 'DENIED') NOT NULL DEFAULT 'DENIED',
    ADD COLUMN `exportAccess` ENUM('ALLOWED', 'DENIED') NOT NULL DEFAULT 'DENIED',
    ADD COLUMN `listAccess` ENUM('ALLOWED', 'DENIED') NOT NULL DEFAULT 'DENIED',
    ADD COLUMN `printAccess` ENUM('ALLOWED', 'DENIED') NOT NULL DEFAULT 'DENIED',
    ADD COLUMN `updateAccess` ENUM('ALLOWED', 'DENIED') NOT NULL DEFAULT 'DENIED';
