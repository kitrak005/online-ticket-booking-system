import { Movie, Showtime, Theater, Booking } from '../types';

/**
 * Mock Database Service
 * Simulates a relational database structure in memory.
 */
class MockDB {
  private movies: Movie[] = [];
  private theaters: Theater[] = [];
  private showtimes: Showtime[] = [];
  private bookings: Booking[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    this.movies = [
      {
        id: 'm1',
        title: 'Inception',
        genre: ['Sci-Fi', 'Action'],
        duration: 148,
        rating: 8.8,
        posterUrl: 'https://picsum.photos/300/450?random=1',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        director: 'Christopher Nolan',
        releaseDate: '2010-07-16'
      },
      {
        id: 'm2',
        title: 'The Dark Knight',
        genre: ['Action', 'Crime'],
        duration: 152,
        rating: 9.0,
        posterUrl: 'https://picsum.photos/300/450?random=2',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        director: 'Christopher Nolan',
        releaseDate: '2008-07-18'
      },
      {
        id: 'm3',
        title: 'Interstellar',
        genre: ['Sci-Fi', 'Adventure'],
        duration: 169,
        rating: 8.6,
        posterUrl: 'https://picsum.photos/300/450?random=3',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        director: 'Christopher Nolan',
        releaseDate: '2014-11-07'
      },
      {
        id: 'm4',
        title: 'Parasite',
        genre: ['Thriller', 'Drama'],
        duration: 132,
        rating: 8.5,
        posterUrl: 'https://picsum.photos/300/450?random=4',
        description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
        director: 'Bong Joon Ho',
        releaseDate: '2019-05-30'
      }
    ];

    this.theaters = [
      { id: 't1', name: 'Grand Cinema Hall', location: 'Downtown' },
      { id: 't2', name: 'Starlight Multiplex', location: 'West End' }
    ];

    // Generate showtimes dynamically for the next few days
    const today = new Date();
    this.movies.forEach((movie, i) => {
      this.theaters.forEach((theater, j) => {
        // Create 2 showtimes per movie per theater
        for (let k = 0; k < 2; k++) {
           const showTime = new Date(today);
           showTime.setHours(14 + (k * 4) + i, 0, 0, 0); // Stagger times
           
           this.showtimes.push({
             id: `s_${movie.id}_${theater.id}_${k}`,
             movieId: movie.id,
             theaterId: theater.id,
             startTime: showTime.toISOString(),
             price: 12 + (j * 2) + (k * 1), // Variable pricing logic
             screen: `Screen ${k + 1}`
           });
        }
      });
    });

    // Seed a few existing bookings to simulate occupied seats
    this.bookings.push({
      id: 'b_seed_1',
      showtimeId: this.showtimes[0].id,
      seatNumbers: ['C3', 'C4'],
      totalPrice: 24,
      timestamp: new Date().toISOString(),
      customerName: 'John Doe'
    });
  }

  // --- Queries ---

  getAllMovies(): Movie[] {
    return this.movies;
  }

  getMovieById(id: string): Movie | undefined {
    return this.movies.find(m => m.id === id);
  }

  getShowtimesForMovie(movieId: string): Showtime[] {
    return this.showtimes
      .filter(s => s.movieId === movieId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  getTheaterById(id: string): Theater | undefined {
    return this.theaters.find(t => t.id === id);
  }

  getShowtimeById(id: string): Showtime | undefined {
    return this.showtimes.find(s => s.id === id);
  }

  getOccupiedSeats(showtimeId: string): string[] {
    const relevantBookings = this.bookings.filter(b => b.showtimeId === showtimeId);
    return relevantBookings.flatMap(b => b.seatNumbers);
  }

  // --- Transactions ---

  createBooking(booking: Omit<Booking, 'id' | 'timestamp'>): Booking {
    // Check for concurrency issues (double booking)
    const occupied = this.getOccupiedSeats(booking.showtimeId);
    const conflict = booking.seatNumbers.some(seat => occupied.includes(seat));
    
    if (conflict) {
      throw new Error("One or more selected seats are already booked.");
    }

    const newBooking: Booking = {
      ...booking,
      id: `b_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };

    this.bookings.push(newBooking);
    return newBooking;
  }
}

// Singleton instance
export const db = new MockDB();