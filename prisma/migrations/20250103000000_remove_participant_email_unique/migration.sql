-- DropIndex
DROP INDEX IF EXISTS "Participant_email_key";

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Participant_email_lotteryId_key" ON "Participant"("email", "lotteryId");

