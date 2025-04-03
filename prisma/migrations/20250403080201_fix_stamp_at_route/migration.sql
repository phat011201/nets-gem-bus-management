/*
  Warnings:

  - You are about to drop the column `stamp` on the `Route` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "departureStationId" TEXT NOT NULL,
    "arrivalStationId" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME,
    "approvedById" TEXT NOT NULL,
    "departureStamp" TEXT,
    "arrivalStamp" TEXT,
    "transportId" TEXT,
    CONSTRAINT "Route_departureStationId_fkey" FOREIGN KEY ("departureStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Route_arrivalStationId_fkey" FOREIGN KEY ("arrivalStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Route_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Route" ("approvedById", "arrivalStationId", "arrivalTime", "departureStationId", "departureTime", "id", "transportId") SELECT "approvedById", "arrivalStationId", "arrivalTime", "departureStationId", "departureTime", "id", "transportId" FROM "Route";
DROP TABLE "Route";
ALTER TABLE "new_Route" RENAME TO "Route";
CREATE UNIQUE INDEX "Route_transportId_key" ON "Route"("transportId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
