/*
  Warnings:

  - Made the column `arrivalTime` on table `Route` required. This step will fail if there are existing NULL values in that column.
  - Made the column `arrivalTime` on table `Transport` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "departureStationId" TEXT NOT NULL,
    "arrivalStationId" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME NOT NULL,
    "departureApprovedById" TEXT,
    "arrivalApprovedById" TEXT,
    "departureStamp" TEXT,
    "arrivalStamp" TEXT,
    "transportId" TEXT NOT NULL,
    CONSTRAINT "Route_departureStationId_fkey" FOREIGN KEY ("departureStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Route_arrivalStationId_fkey" FOREIGN KEY ("arrivalStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Route_departureApprovedById_fkey" FOREIGN KEY ("departureApprovedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Route_arrivalApprovedById_fkey" FOREIGN KEY ("arrivalApprovedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Route_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Route" ("arrivalApprovedById", "arrivalStamp", "arrivalStationId", "arrivalTime", "departureApprovedById", "departureStamp", "departureStationId", "departureTime", "id", "transportId") SELECT "arrivalApprovedById", "arrivalStamp", "arrivalStationId", "arrivalTime", "departureApprovedById", "departureStamp", "departureStationId", "departureTime", "id", "transportId" FROM "Route";
DROP TABLE "Route";
ALTER TABLE "new_Route" RENAME TO "Route";
CREATE TABLE "new_Transport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "operatorId" TEXT,
    "ticketSellerId" TEXT NOT NULL,
    "currentStation" TEXT NOT NULL,
    "nextStation" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Transport_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transport_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transport_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transport_ticketSellerId_fkey" FOREIGN KEY ("ticketSellerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transport" ("arrivalTime", "currentStation", "departureTime", "driverId", "id", "nextStation", "operatorId", "status", "ticketSellerId", "vehicleId") SELECT "arrivalTime", "currentStation", "departureTime", "driverId", "id", "nextStation", "operatorId", "status", "ticketSellerId", "vehicleId" FROM "Transport";
DROP TABLE "Transport";
ALTER TABLE "new_Transport" RENAME TO "Transport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
