CREATE TYPE "PROFILE_VIEW" AS ENUM ('USER', 'PROVIDER');

CREATE TYPE "RatingStatus" AS ENUM ('pending', 'approved', 'rejected');

ALTER TABLE "Gig"
ADD COLUMN "slug" TEXT NOT NULL;

ALTER TABLE "User"
ADD COLUMN "profile_view" "PROFILE_VIEW" NOT NULL DEFAULT 'USER';

ALTER TABLE "ReviewRating"
ADD COLUMN "status" "RatingStatus" NOT NULL DEFAULT 'pending';

CREATE UNIQUE INDEX "Gig_slug_key" ON "Gig"("slug");