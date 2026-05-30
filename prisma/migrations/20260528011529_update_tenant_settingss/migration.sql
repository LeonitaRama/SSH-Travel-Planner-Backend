/*
  Warnings:

  - You are about to drop the column `address` on the `TenantSettings` table. All the data in the column will be lost.
  - You are about to drop the column `companyLogo` on the `TenantSettings` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `TenantSettings` table. All the data in the column will be lost.
  - You are about to drop the column `contactEmail` on the `TenantSettings` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `TenantSettings` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `TenantSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TenantSettings" DROP COLUMN "address",
DROP COLUMN "companyLogo",
DROP COLUMN "companyName",
DROP COLUMN "contactEmail",
DROP COLUMN "contactPhone",
DROP COLUMN "timezone",
ALTER COLUMN "updatedAt" DROP DEFAULT;
