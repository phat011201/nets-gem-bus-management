import { ROLE } from '../data';

export interface RouteResponseDto {
  id: string;
  departureStation: {
    id: string;
    name: string;
    stamp: string;
  };
  arrivalStation: {
    id: string;
    name: string;
    stamp: string;
  };
  departureTime: string;
  arrivalTime: string;
  approvedBy: {
    id: string;
    name: string;
    role: ROLE;
  };
  departureStamp: string;
  arrivalStamp: string;
}
