
export interface Destination {
  id: string;
  name: string;
  code: string;
  image?: string;
  city: string;
  country: string;
  description?: string;
}

export interface Flight {
  id: string;
  departureDestination: Destination;
  arrivalDestination: Destination;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  airline: string;
  flightNumber: string;
}

export interface Seat {
  id: string;
  row: number;
  column: string; // A, B, C, etc.
  isAvailable: boolean;
  type: "economy" | "business" | "first";
}

export interface BookingStatus {
  status: "pending" | "approved" | "rejected" | "cancelled";
  updatedAt: Date;
  updatedBy?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  userId: string;
  flight: Flight;
  passengerName: string;
  passengerEmail: string;
  seatId?: string;
  seat?: Seat;
  bookingDate: Date;
  status: BookingStatus;
  boardingPassIssued: boolean;
}
