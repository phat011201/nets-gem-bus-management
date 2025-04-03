export interface UpdateRoutRequestDTO {
  id: string;
  departureStationId: string;
  arrivalStationId: string;
  departureTime: string;
  arrivalTime: string;
  approvedById: string;
  departureStamp: string;
  arrivalStamp: string;
}
