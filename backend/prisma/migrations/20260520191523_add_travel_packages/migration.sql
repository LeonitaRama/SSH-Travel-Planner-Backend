-- CreateTable
CREATE TABLE "TravelPackage" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "destinationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelPackage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TravelPackage_tenantId_idx" ON "TravelPackage"("tenantId");

-- CreateIndex
CREATE INDEX "TravelPackage_destinationId_idx" ON "TravelPackage"("destinationId");

-- AddForeignKey
ALTER TABLE "TravelPackage" ADD CONSTRAINT "TravelPackage_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelPackage" ADD CONSTRAINT "TravelPackage_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
