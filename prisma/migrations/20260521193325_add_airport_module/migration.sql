-- CreateTable
CREATE TABLE "Airport" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Airport_tenantId_idx" ON "Airport"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_tenantId_code_key" ON "Airport"("tenantId", "code");

-- AddForeignKey
ALTER TABLE "Airport" ADD CONSTRAINT "Airport_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
