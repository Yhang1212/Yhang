ALTER TABLE "User"
  ALTER COLUMN "role" SET DEFAULT 'USER',
  ALTER COLUMN "passwordHash" SET DEFAULT '';

ALTER TABLE "User"
  ADD COLUMN "provider" TEXT NOT NULL DEFAULT 'EMAIL',
  ADD COLUMN "providerId" TEXT,
  ADD COLUMN "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "emailVerificationToken" TEXT,
  ADD COLUMN "emailVerificationExpires" TIMESTAMP(3),
  ADD COLUMN "passwordResetToken" TEXT,
  ADD COLUMN "passwordResetExpires" TIMESTAMP(3),
  ADD COLUMN "phone" TEXT;
