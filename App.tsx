import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { db } from './services/db';
import { Movie, Showtime, Booking } from './types';
import { MovieDetail } from './components/MovieDetail';
import { SeatSelector } from './components/SeatSelector';
import { CheckCircle, Calendar, Monitor, ChevronRight } from 'lucide-react';

// Define the possible views in our SPA
type View = 'HOME' | 'MOVIE_DETAIL' | 'BOOKING' | 'CONFIRMATION';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [movies, setMovies] = useState<Movie[]>([]);
  
  // Selection State
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  
  // Computed State for Booking View
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);

  useEffect(() => {
    // Load initial data
    setMovies(db.getAllMovies());
  }, []);

  const handleNavigateHome = () => {
    setCurrentView('HOME');
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setConfirmedBooking(null);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentView('MOVIE_DETAIL');
  };

  const handleSelectShowtime = (showtimeId: string) => {
    const showtime = db.getShowtimeById(showtimeId);
    if (showtime) {
      setSelectedShowtime(showtime);
      // Fetch fresh occupied seats from "DB"
      setOccupiedSeats(db.getOccupiedSeats(showtimeId));
      setCurrentView('BOOKING');
    }
  };

  const handleToggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedShowtime || selectedSeats.length === 0) return;

    try {
      const booking = db.createBooking({
        showtimeId: selectedShowtime.id,
        seatNumbers: selectedSeats,
        totalPrice: selectedSeats.length * selectedShowtime.price,
        customerName: "Guest User" // Simplified for demo
      });
      setConfirmedBooking(booking);
      setCurrentView('CONFIRMATION');
    } catch (error) {
      alert("Booking failed: Seats might have just been taken!");
      // Refresh seats
      setOccupiedSeats(db.getOccupiedSeats(selectedShowtime.id));
      setSelectedSeats([]);
    }
  };

  // --- RENDER HELPERS ---

  const renderHome = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px]">
         <div className="absolute inset-0">
            <img 
                src="https://picsum.photos/1200/600?random=10" 
                alt="Cinema" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
         </div>
         <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full mb-4">NOW SHOWING</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">Experience Cinema Like Never Before</h1>
            <p className="text-slate-300 text-lg mb-6">Book the best seats for the latest blockbusters with our AI-powered platform.</p>
         </div>
      </div>

      <h2 className="text-2xl font-bold text-white pl-2 border-l-4 border-indigo-500">Trending Movies</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map(movie => (
          <div 
            key={movie.id} 
            onClick={() => handleSelectMovie(movie)}
            className="group cursor-pointer bg-slate-800 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="aspect-[2/3] overflow-hidden relative">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">Book Now</span>
              </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-white text-lg truncate mb-1">{movie.title}</h3>
                <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>{movie.genre[0]}</span>
                    <div className="flex items-center text-yellow-500">
                        <span className="font-bold mr-1">{movie.rating}</span>
                        <span className="text-xs">★</span>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBooking = () => {
    if (!selectedMovie || !selectedShowtime) return null;
    
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-8">
            <button onClick={() => setCurrentView('MOVIE_DETAIL')} className="text-slate-400 hover:text-white flex items-center">
                &larr; Change Showtime
            </button>
            <div className="text-right">
                <h2 className="text-2xl font-bold text-white">{selectedMovie.title}</h2>
                <div className="text-slate-400 text-sm flex items-center justify-end gap-3 mt-1">
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(selectedShowtime.startTime).toLocaleDateString()}</span>
                    <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> {new Date(selectedShowtime.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    <span className="flex items-center"><Monitor className="w-3 h-3 mr-1" /> {selectedShowtime.screen}</span>
                </div>
            </div>
        </div>

        <SeatSelector 
            occupiedSeats={occupiedSeats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            pricePerSeat={selectedShowtime.price}
        />

        <div className="mt-8 flex justify-center">
            <button
                disabled={selectedSeats.length === 0}
                onClick={handleConfirmBooking}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all w-full md:w-auto flex items-center justify-center"
            >
                Confirm Booking
                <ChevronRight className="ml-2 w-5 h-5" />
            </button>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => {
    if (!confirmedBooking || !selectedMovie || !selectedShowtime) return null;

    return (
        <div className="max-w-md mx-auto animate-fade-in pt-10">
            <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
                {/* Ticket Top */}
                <div className="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                    <p className="text-indigo-100 text-sm mt-1">Order ID: #{confirmedBooking.id.slice(-6)}</p>
                </div>

                {/* Ticket Body */}
                <div className="p-8 space-y-6">
                    <div className="text-center border-b border-dashed border-slate-300 pb-6">
                        <h3 className="text-2xl font-black uppercase tracking-tight text-slate-800 mb-2">{selectedMovie.title}</h3>
                        <p className="text-slate-500 text-sm font-medium">{db.getTheaterById(selectedShowtime.theaterId)?.name}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-1">Date</p>
                            <p className="font-semibold text-slate-800">{new Date(selectedShowtime.startTime).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-1">Time</p>
                            <p className="font-semibold text-slate-800">{new Date(selectedShowtime.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-1">Screen</p>
                            <p className="font-semibold text-slate-800">{selectedShowtime.screen}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-1">Seats</p>
                            <p className="font-semibold text-indigo-600">{confirmedBooking.seatNumbers.join(', ')}</p>
                        </div>
                    </div>

                    <div className="bg-slate-100 rounded-xl p-4 flex justify-between items-center">
                        <span className="font-bold text-slate-600">Total Paid</span>
                        <span className="font-black text-xl text-slate-900">${confirmedBooking.totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {/* Ticket Cutout Effect */}
                <div className="relative h-4 bg-slate-900">
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-slate-900 rounded-full"></div>
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-slate-900 rounded-full"></div>
                    <div className="absolute top-0 left-4 right-4 border-t-2 border-dashed border-slate-700/50 h-0"></div>
                </div>

                {/* QR Code Section */}
                <div className="bg-white p-6 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 bg-slate-900 p-2 rounded-lg">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${confirmedBooking.id}`} 
                            alt="QR Code" 
                            className="w-full h-full opacity-90"
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-4 text-center">Scan at the entrance</p>
                </div>
            </div>

            <button 
                onClick={handleNavigateHome}
                className="w-full mt-6 py-3 text-slate-400 hover:text-white font-medium transition-colors"
            >
                Return to Home
            </button>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      <Navbar onNavigateHome={handleNavigateHome} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'HOME' && renderHome()}
        
        {currentView === 'MOVIE_DETAIL' && selectedMovie && (
          <MovieDetail 
            movie={selectedMovie} 
            onBack={handleNavigateHome}
            onSelectShowtime={handleSelectShowtime}
          />
        )}

        {currentView === 'BOOKING' && renderBooking()}
        
        {currentView === 'CONFIRMATION' && renderConfirmation()}
      </main>
    </div>
  );
};

export default App;