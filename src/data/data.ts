export type ROLE = 'ADMIN' | 'DRIVER' | 'OPERATOR' | 'TICKET_SELLER';
type STATUS = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export type BUS_STATION = {
  id: string;
  name: string;
  address: string;
  stamp: string;
};

export type USER = {
  id: string;
  name: string;
  username: string;
  password: string;
  avatar: string;
  rank: string;
  driverslicensenumber: string;
  role: ROLE;
  station: BUS_STATION;
  signature: string;
};

export type VEHICLE = {
  id: string;
  licensePlate: string;
  status: 'ACTIVE' | 'INACTIVE';
};

export type TRANSPORT = {
  id: string;
  vehicle: VEHICLE;
  driver: USER;
  operator: USER;
  ticketSeller: USER;
  departureTime: string;
  arrivalTime: string;
  currentStation: string;
  nextStation: string;
  status: STATUS;
};

export interface IRoute {
  id: string;
  departureStation: {
    id: string;
    name: string;
  };
  arrivalStation: {
    id: string;
    name: string;
  };
  departureTime: string;
  arrivalTime: string;
  departureStamp?: string;
  arrivalStamp?: string;
  departureApprovedBy: {
    id: string;
    name: string;
  };
  arrivalApprovedBy: {
    id: string;
    name: string;
  };
}

export interface ITransport {
  id: string;
  vehicle: {
    id: string;
    licensePlate: string;
  };
  driver: {
    id: string;
    name: string;
    rank: string;
    driverslicensenumber: string;
  };
  ticketSeller: {
    id: string;
    name: string;
  };
  operator: {
    id: string;
    name: string;
  };
  currentStation: string;
  nextStation: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  routes?: IRoute[];
  serialNumber?: string;
}
