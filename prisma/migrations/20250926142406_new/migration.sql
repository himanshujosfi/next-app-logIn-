-- CreateTable
CREATE TABLE "public"."email_verified" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT NOT NULL,

    CONSTRAINT "email_verified_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."email_verified" ADD CONSTRAINT "email_verified_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
