-- CreateTable
CREATE TABLE "StudentPreferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "target_languages" TEXT[] NOT NULL,
    "preferred_availability" JSONB NOT NULL,
    "timezone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StudentPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentPreferences_user_id_key" ON "StudentPreferences"("user_id");

-- AddForeignKey
ALTER TABLE "StudentPreferences" ADD CONSTRAINT "StudentPreferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
