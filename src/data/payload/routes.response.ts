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
  departureApprovedBy: {
    id: string;
    name: string;
    role: ROLE;
  };
  arrivalApprovedBy: {
    id: string;
    name: string;
    role: ROLE;
  };
  departureStamp: string;
  arrivalStamp: string;
  transport: {
    id: string,
    departureStation: string,
    arrivalStation: string,
  };
}
