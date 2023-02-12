-- CreateTable
CREATE TABLE `permissions` (
    `userId` INTEGER NOT NULL,
    `resourceId` INTEGER NOT NULL,
    `access` ENUM('ALLOWED', 'DENIED') NOT NULL DEFAULT 'DENIED',
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`, `resourceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_resourceId_fkey` FOREIGN KEY (`resourceId`) REFERENCES `resources`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
