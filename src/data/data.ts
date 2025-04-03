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
  currentStation: string;
  nextStation: string;
  status: STATUS;
};
