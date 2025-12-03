export interface Movie {
  id: string;
  title: string;
  genre: string[];
  duration: number; // in minutes
  rating: number; // 0-10
  posterUrl: string;
  description: string;
  director: string;
  releaseDate: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  startTime: string; // ISO string
  price: number;
  screen: string;
}

export interface Booking {
  id: string;
  showtimeId: string;
  seatNumbers: string[];
  totalPrice: number;
  timestamp: string;
  customerName: string;
}

// Helper type for seat status
export type SeatStatus = 'available' | 'occupied' | 'selected';

export interface Seat {
  id: string;
  row: string;
  col: number;
  status: SeatStatus;
}