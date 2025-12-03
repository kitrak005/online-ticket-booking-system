import React, { useMemo } from 'react';
import { Seat, SeatStatus } from '../types';

interface SeatSelectorProps {
  occupiedSeats: string[];
  selectedSeats: string[];
  onToggleSeat: (seatId: string) => void;
  pricePerSeat: number;
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLS = 8;

export const SeatSelector: React.FC<SeatSelectorProps> = ({ 
  occupiedSeats, 
  selectedSeats, 
  onToggleSeat,
  pricePerSeat 
}) => {
  
  // Generate the grid
  const seats: Seat[] = useMemo(() => {
    const grid: Seat[] = [];
    ROWS.forEach(row => {
      for (let i = 1; i <= COLS; i++) {
        const id = `${row}${i}`;
        let status: SeatStatus = 'available';
        if (occupiedSeats.includes(id)) status = 'occupied';
        else if (selectedSeats.includes(id)) status = 'selected';
        
        grid.push({ id, row, col: i, status });
      }
    });
    return grid;
  }, [occupiedSeats, selectedSeats]);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
      
      {/* Screen Visualization */}
      <div className="w-full mb-8">
        <div className="h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-full opacity-50 mb-1"></div>
        <div className="h-12 w-full bg-gradient-to-b from-indigo-500/10 to-transparent transform perspective-500 rotate-x-12 rounded-t-3xl flex items-center justify-center text-indigo-300 text-xs tracking-widest uppercase">
          Screen
        </div>
      </div>

      {/* Grid */}
      <div className="seat-grid mb-8">
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => seat.status !== 'occupied' && onToggleSeat(seat.id)}
            disabled={seat.status === 'occupied'}
            className={`
              h-8 w-8 sm:h-10 sm:w-10 rounded-t-lg rounded-b-md text-xs font-medium transition-all duration-200 flex items-center justify-center
              ${seat.status === 'available' ? 'bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white border-b-4 border-slate-800' : ''}
              ${seat.status === 'selected' ? 'bg-indigo-500 text-white border-b-4 border-indigo-700 shadow-[0_0_15px_rgba(99,102,241,0.5)] transform -translate-y-1' : ''}
              ${seat.status === 'occupied' ? 'bg-slate-900/50 text-slate-600 border-b-4 border-slate-900 cursor-not-allowed' : ''}
            `}
          >
            {seat.row}{seat.col}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-slate-700 rounded border border-slate-600"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-indigo-500 rounded border border-indigo-600"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-slate-900 rounded border border-slate-800"></div>
          <span>Sold</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 w-full border-t border-slate-700 pt-4 flex justify-between items-center">
        <div>
            <p className="text-slate-400 text-sm">Selected</p>
            <p className="text-white font-semibold">{selectedSeats.length} Seats</p>
        </div>
        <div className="text-right">
            <p className="text-slate-400 text-sm">Total Price</p>
            <p className="text-2xl font-bold text-indigo-400">${selectedSeats.length * pricePerSeat}</p>
        </div>
      </div>
    </div>
  );
};