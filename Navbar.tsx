import React from 'react';
import { Film, Search, User } from 'lucide-react';

interface NavbarProps {
    onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome }) => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={onNavigateHome}>
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Film className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              CineMatrix AI
            </span>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search movies..." 
                        className="bg-slate-800 text-sm text-slate-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-700 w-64"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                </div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-slate-800 transition-colors">
                <User className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};