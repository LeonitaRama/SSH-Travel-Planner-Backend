-- CreateTable
CREATE TABLE "Flight" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "airline" TEXT NOT NULL,
    "departureCity" TEXT NOT NULL,
    "arrivalCity" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "departureTime" TIMESTAMP(3),
    "arrivalTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
