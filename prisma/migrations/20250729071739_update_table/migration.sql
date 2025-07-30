ALTER TABLE "Gig"
ADD COLUMN "slug" TEXT NOT NULL;

CREATE UNIQUE INDEX "Gig_slug_key" ON "Gig"("slug");