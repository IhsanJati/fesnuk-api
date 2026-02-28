/*
  Warnings:

  - You are about to drop the column `content` on the `Bookmark` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Likes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bookmark" DROP COLUMN "content";

-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "content";
