/*
  Warnings:

  - You are about to drop the column `created_at` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `refresh_token` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `refresh_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_token" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
