-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "stamp" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT,
    "stationId" TEXT,
    "signature" TEXT,
    CONSTRAINT "User_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "licensePlate" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Transport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "ticketSellerId" TEXT NOT NULL,
    "routeId" TEXT,
    "currentStation" TEXT NOT NULL,
    "nextStation" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME,
    "status" TEXT NOT NULL,
    CONSTRAINT "Transport_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transport_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transport_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transport_ticketSellerId_fkey" FOREIGN KEY ("ticketSellerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transport_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "departureStationId" TEXT NOT NULL,
    "arrivalStationId" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME,
    "approvedById" TEXT NOT NULL,
    "stamp" TEXT NOT NULL,
    "transportId" TEXT,
    CONSTRAINT "Route_departureStationId_fkey" FOREIGN KEY ("departureStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Route_arrivalStationId_fkey" FOREIGN KEY ("arrivalStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Route_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Station_name_key" ON "Station"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "Vehicle"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "Transport_routeId_key" ON "Transport"("routeId");

-- CreateIndex
CREATE UNIQUE INDEX "Route_transportId_key" ON "Route"("transportId");
