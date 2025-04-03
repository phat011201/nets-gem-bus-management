export interface CreateRouteDto {
  departureStationId: string;
  arrivalStationId: string;
  departureTime: string;
  arrivalTime?: string;
  approvedById: string;
}
