-- AlterTable
ALTER TABLE "match" ALTER COLUMN "history" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "time" SET DEFAULT ARRAY[]::TEXT[];
