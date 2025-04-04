export interface UpdateRoutRequestDTO {
  id: string;
  departureStationId: string;
  arrivalStationId: string;
  departureTime: string;
  arrivalTime: string;
  departureApprovedById: string;
  arrivalApprovedById: string;
  departureStamp: string;
  arrivalStamp: string;
  transportId: string;
}
