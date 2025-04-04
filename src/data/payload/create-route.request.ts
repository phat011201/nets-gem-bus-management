export interface CreateRouteDto {
  departureStationId: string;
  arrivalStationId: string;
  departureTime: string;
  arrivalTime?: string;
  departureApprovedById?: string;
  arrivalApprovedById?: string;
  transportId: string;
}
