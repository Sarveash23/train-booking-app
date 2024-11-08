export interface Train {
  id: number;
  trainNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
}

export interface Seat {
  id: number;
  trainId: number;
  coachNumber: string;
  seatNumber: string;
  status: 'available' | 'locked' | 'booked';
  lockedBy?: string;
  lockedAt?: Date;
}

export interface Booking {
  id: number;
  trainId: number;
  seatId: number;
  userId: string;
  bookingDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
} 