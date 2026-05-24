-- CreateTable
CREATE TABLE "_HotelToTravelPackage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HotelToTravelPackage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FlightToTravelPackage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FlightToTravelPackage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_HotelToTravelPackage_B_index" ON "_HotelToTravelPackage"("B");

-- CreateIndex
CREATE INDEX "_FlightToTravelPackage_B_index" ON "_FlightToTravelPackage"("B");

-- AddForeignKey
ALTER TABLE "_HotelToTravelPackage" ADD CONSTRAINT "_HotelToTravelPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelToTravelPackage" ADD CONSTRAINT "_HotelToTravelPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "TravelPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlightToTravelPackage" ADD CONSTRAINT "_FlightToTravelPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "Flight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlightToTravelPackage" ADD CONSTRAINT "_FlightToTravelPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "TravelPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
