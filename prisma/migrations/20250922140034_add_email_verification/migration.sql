-- CreateTable
CREATE TABLE "public"."email_verified" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verified_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verified_userId_key" ON "public"."email_verified"("userId");

-- CreateIndex
CREATE INDEX "email_verified_code_idx" ON "public"."email_verified"("code");

-- AddForeignKey
ALTER TABLE "public"."email_verified" ADD CONSTRAINT "email_verified_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
