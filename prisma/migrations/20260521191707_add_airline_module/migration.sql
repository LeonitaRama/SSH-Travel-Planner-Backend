-- CreateTable
CREATE TABLE "Airline" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Airline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Airline_tenantId_idx" ON "Airline"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Airline_tenantId_code_key" ON "Airline"("tenantId", "code");

-- AddForeignKey
ALTER TABLE "Airline" ADD CONSTRAINT "Airline_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
