-- CreateTable
CREATE TABLE "apiCredentials" (
    "id" TEXT NOT NULL,
    "api_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apiCredentials_pkey" PRIMARY KEY ("id")
);
