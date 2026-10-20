export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Contact {
  id: number;
  initials: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  coordinates: Coordinates;
  isDeleted: boolean;
}
