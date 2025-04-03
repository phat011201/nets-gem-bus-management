-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "operatorId" TEXT,
    "ticketSellerId" TEXT NOT NULL,
    "routeId" TEXT,
    "currentStation" TEXT NOT NULL,
    "nextStation" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME,
    "status" TEXT NOT NULL,
    CONSTRAINT "Transport_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transport_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transport_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transport_ticketSellerId_fkey" FOREIGN KEY ("ticketSellerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transport_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transport" ("arrivalTime", "currentStation", "departureTime", "driverId", "id", "nextStation", "operatorId", "routeId", "status", "ticketSellerId", "vehicleId") SELECT "arrivalTime", "currentStation", "departureTime", "driverId", "id", "nextStation", "operatorId", "routeId", "status", "ticketSellerId", "vehicleId" FROM "Transport";
DROP TABLE "Transport";
ALTER TABLE "new_Transport" RENAME TO "Transport";
CREATE UNIQUE INDEX "Transport_routeId_key" ON "Transport"("routeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
