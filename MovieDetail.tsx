import React, { useState, useEffect } from 'react';
import { Movie, Showtime, Theater } from '../types';
import { db } from '../services/db';
import { Calendar, Clock, MapPin, Sparkles, Star, Ticket } from 'lucide-react';
import { getMovieInsights } from '../services/geminiService';

interface MovieDetailProps {
  movie: Movie;
  onBack: () => void;
  onSelectShowtime: (showtimeId: string) => void;
}

export const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onBack, onSelectShowtime }) => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [theaters, setTheaters] = useState<Map<string, Theater>>(new Map());
  
  // AI State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const shows = db.getShowtimesForMovie(movie.id);
    setShowtimes(shows);
    
    const theaterMap = new Map<string, Theater>();
    shows.forEach(s => {
      const t = db.getTheaterById(s.theaterId);
      if (t) theaterMap.set(t.id, t);
    });
    setTheaters(theaterMap);
  }, [movie]);

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse('');
    
    try {
        const response = await getMovieInsights(movie.title, aiQuery);
        setAiResponse(response);
    } finally {
        setIsAiLoading(false);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="mb-4 text-slate-400 hover:text-white transition-colors flex items-center text-sm">
        &larr; Back to Movies
      </button>
      
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1">
          <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/20 aspect-[2/3]">
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="object-cover w-full h-full"
            />
            <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full flex items-center">
              <Star className="w-4 h-4 mr-1 fill-black" />
              {movie.rating}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
            <div className="flex flex-wrap gap-2 text-sm text-slate-400 mb-4">
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
              <span>•</span>
              <span>{movie.duration} min</span>
              <span>•</span>
              <span>{movie.director}</span>
            </div>
            <div className="flex gap-2 mb-6">
              {movie.genre.map(g => (
                <span key={g} className="px-3 py-1 bg-slate-800 text-indigo-300 rounded-full text-xs font-medium border border-slate-700">
                  {g}
                </span>
              ))}
            </div>
            <p className="text-slate-300 leading-relaxed text-lg mb-8">{movie.description}</p>
          </div>

          {/* AI Section */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold">Ask Gemini AI</h3>
            </div>
            
            {!aiResponse ? (
                <form onSubmit={handleAiAsk} className="relative">
                    <input
                        type="text"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder="e.g. Is this movie scary? or What other movies are like this?"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button 
                        type="submit" 
                        disabled={isAiLoading}
                        className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white disabled:opacity-50 transition-colors"
                    >
                        {isAiLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Sparkles className="w-5 h-5" />}
                    </button>
                </form>
            ) : (
                <div className="animate-fade-in">
                    <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-700 mb-3">
                        {aiResponse}
                    </p>
                    <button 
                        onClick={() => { setAiResponse(''); setAiQuery(''); }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                    >
                        Ask another question
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Showtimes Section */}
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Ticket className="mr-3 text-indigo-500" />
        Select Showtime
      </h2>
      
      <div className="space-y-6">
        {Array.from(theaters.values()).map((theater: Theater) => {
          const theaterShows = showtimes.filter(s => s.theaterId === theater.id);
          if (theaterShows.length === 0) return null;

          return (
            <div key={theater.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{theater.name}</h3>
                  <div className="flex items-center text-slate-400 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {theater.location}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {theaterShows.map(show => (
                   <button
                    key={show.id}
                    onClick={() => onSelectShowtime(show.id)}
                    className="group relative flex flex-col items-center bg-slate-900 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 rounded-lg p-3 transition-all duration-200 min-w-[100px]"
                   >
                     <div className="text-slate-400 text-xs mb-1 group-hover:text-indigo-200">{formatDate(show.startTime)}</div>
                     <div className="text-white font-bold text-lg mb-1">{formatTime(show.startTime)}</div>
                     <div className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 group-hover:bg-indigo-700 group-hover:text-white">
                        ${show.price}
                     </div>
                   </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};