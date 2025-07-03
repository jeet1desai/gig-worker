-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('user', 'provider', 'admin');

-- CreateEnum
CREATE TYPE "TIER" AS ENUM ('basic', 'advanced', 'expert');

-- CreateEnum
CREATE TYPE "BID_STATUS" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('held', 'completed', 'refunded');

-- CreateEnum
CREATE TYPE "PAYMENT_REQUEST_STATUS" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "CHALLENGED_OUTCOME" AS ENUM ('pending', 'provider_won', 'user_won');

-- CreateEnum
CREATE TYPE "SUBSCRIPTION_TYPE" AS ENUM ('free', 'basic', 'pro');

-- CreateEnum
CREATE TYPE "SUBSCRIPTION_STATUS" AS ENUM ('active', 'cancelled');

-- CreateEnum
CREATE TYPE "EARN_STATUS" AS ENUM ('in_progress', 'completed');

-- CreateEnum
CREATE TYPE "GIG_STATUS" AS ENUM ('open', 'requested', 'in_progress', 'completed', 'rejected');

-- CreateEnum
CREATE TYPE "NOTIFICATION_TYPE" AS ENUM ('success', 'warning', 'error', 'info');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "profile_url" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'user',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "sign_up_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "interests" TEXT[],
    "extracurricular" TEXT[],
    "certifications" TEXT[],
    "skills" TEXT[],
    "educations" TEXT[],
    "badges" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBan" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "reason" TEXT,
    "ban_expires_at" TIMESTAMP(3),
    "strike_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoleLimit" (
    "id" BIGSERIAL NOT NULL,
    "role" "SUBSCRIPTION_TYPE" NOT NULL DEFAULT 'free',
    "gig_limit" INTEGER NOT NULL DEFAULT 0,
    "bid_limit" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRoleLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_url" TEXT,
    "role" "ROLE" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CMS" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "plan_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "price" DECIMAL(8,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "interval_count" INTEGER NOT NULL,
    "billing_cycle_count" INTEGER NOT NULL DEFAULT 0,
    "usage_type" TEXT,
    "setup_fee" DECIMAL(8,2),
    "tax_percentage" DECIMAL(5,2),
    "merchant_id" TEXT NOT NULL,
    "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "type" "SUBSCRIPTION_TYPE" NOT NULL DEFAULT 'free',
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "status" "SUBSCRIPTION_STATUS" NOT NULL,
    "subscription_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderEarning" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "provider_id" BIGINT NOT NULL,
    "gig_id" BIGINT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "status" "EARN_STATUS" NOT NULL DEFAULT 'in_progress',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderEarning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gig" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "tier" "TIER" NOT NULL DEFAULT 'basic',
    "price_range" JSONB NOT NULL,
    "keywords" TEXT[],
    "completed_at" TIMESTAMP(3),
    "thumbnail" TEXT,
    "attachments" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GigPipeline" (
    "id" BIGSERIAL NOT NULL,
    "gig_id" BIGINT NOT NULL,
    "status" "GIG_STATUS" NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GigPipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" BIGSERIAL NOT NULL,
    "gig_id" BIGINT NOT NULL,
    "provider_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "proposal" TEXT NOT NULL,
    "bid_price" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "status" "BID_STATUS" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewRating" (
    "id" BIGSERIAL NOT NULL,
    "gig_id" BIGINT NOT NULL,
    "provider_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "rating_feedback" TEXT,
    "up_vote" INTEGER NOT NULL DEFAULT 0,
    "down_vote" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" BIGSERIAL NOT NULL,
    "gig_id" BIGINT NOT NULL,
    "provider_id" BIGINT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "platform_fee" DECIMAL(65,30) NOT NULL,
    "payment_method" TEXT,
    "status" "PAYMENT_STATUS" NOT NULL DEFAULT 'held',
    "request_status" "PAYMENT_REQUEST_STATUS" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" BIGSERIAL NOT NULL,
    "review_rating_id" BIGINT NOT NULL,
    "provider_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "gig_id" BIGINT NOT NULL,
    "issue_text" TEXT NOT NULL,
    "suggested_improvement" TEXT,
    "receiver_response" TEXT,
    "is_challenged" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenged" (
    "id" BIGSERIAL NOT NULL,
    "outcome" "CHALLENGED_OUTCOME" NOT NULL DEFAULT 'pending',
    "resolution" TEXT,
    "gig_id" BIGINT NOT NULL,
    "complaint_id" BIGINT NOT NULL,
    "provider_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenged_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" BIGSERIAL NOT NULL,
    "chat_id" BIGINT,
    "gig_id" BIGINT NOT NULL,
    "sender_id" BIGINT NOT NULL,
    "receiver_id" BIGINT NOT NULL,
    "message_text" TEXT,
    "attachment" TEXT,
    "read_status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    "related_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonials" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "provider_id" BIGINT NOT NULL,
    "gig_id" BIGINT NOT NULL,
    "testimonial_text" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_user_id_key" ON "UserProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserBan_user_id_key" ON "UserBan"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_plan_id_key" ON "Plan"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "GigPipeline_gig_id_key" ON "GigPipeline"("gig_id");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewRating_gig_id_key" ON "ReviewRating"("gig_id");

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_review_rating_id_key" ON "Complaint"("review_rating_id");

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_gig_id_key" ON "Complaint"("gig_id");

-- CreateIndex
CREATE UNIQUE INDEX "Challenged_gig_id_key" ON "Challenged"("gig_id");

-- CreateIndex
CREATE UNIQUE INDEX "Challenged_complaint_id_key" ON "Challenged"("complaint_id");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBan" ADD CONSTRAINT "UserBan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderEarning" ADD CONSTRAINT "ProviderEarning_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderEarning" ADD CONSTRAINT "ProviderEarning_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderEarning" ADD CONSTRAINT "ProviderEarning_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GigPipeline" ADD CONSTRAINT "GigPipeline_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewRating" ADD CONSTRAINT "ReviewRating_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewRating" ADD CONSTRAINT "ReviewRating_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewRating" ADD CONSTRAINT "ReviewRating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_review_rating_id_fkey" FOREIGN KEY ("review_rating_id") REFERENCES "ReviewRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenged" ADD CONSTRAINT "Challenged_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "Complaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenged" ADD CONSTRAINT "Challenged_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenged" ADD CONSTRAINT "Challenged_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonials" ADD CONSTRAINT "Testimonials_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonials" ADD CONSTRAINT "Testimonials_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonials" ADD CONSTRAINT "Testimonials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
