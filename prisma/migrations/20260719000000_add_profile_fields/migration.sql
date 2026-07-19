-- Add missing columns to User table (safe: only adds if not exists via AlterTable)
ALTER TABLE "User" ADD COLUMN "image" TEXT;
ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT;
ALTER TABLE "User" ADD COLUMN "subscriptionStatus" TEXT NOT NULL DEFAULT 'inactive';
ALTER TABLE "User" ADD COLUMN "subscriptionPlan" TEXT;
ALTER TABLE "User" ADD COLUMN "isApproved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "emailVerified" DATETIME;

-- Add missing columns to ModelProfile table
ALTER TABLE "ModelProfile" ADD COLUMN "ethnicity" TEXT;
ALTER TABLE "ModelProfile" ADD COLUMN "bodyType" TEXT;
ALTER TABLE "ModelProfile" ADD COLUMN "hairColor" TEXT;
ALTER TABLE "ModelProfile" ADD COLUMN "gender" TEXT;
ALTER TABLE "ModelProfile" ADD COLUMN "btcAddress" TEXT;
ALTER TABLE "ModelProfile" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
