
import React, { useState } from 'react';
import { ShoppingBag, Search, User as UserIcon, MapPin, Mic, LogOut, ShieldCheck, ClipboardList } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  cartCount: number;
  currentUser: User | null;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSearch: (query: string) => void;
  onViewChange: (view: 'home' | 'orders') => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, currentUser, onOpenCart, onOpenAuth, onLogout, onSearch, onViewChange }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    onSearch(val);
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      handleSearchChange(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    try { recognition.start(); } catch (err) { setIsListening(false); }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onViewChange('home')}
          >
            <div className={`p-2 rounded-xl ${currentUser?.role === 'admin' ? 'bg-indigo-600' : 'bg-orange-500'}`}>
              <ShoppingBag className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Flavor<span className={currentUser?.role === 'admin' ? 'text-indigo-600' : 'text-orange-500'}>Dash</span></span>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text" 
                value={query}
                placeholder="Search for cravings, dishes, or restaurants..."
                className="w-full pl-11 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-gray-400 text-sm text-black"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <button
                type="button"
                onClick={startVoiceSearch}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
                  isListening 
                  ? 'bg-orange-500 text-white animate-pulse' 
                  : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-1 text-gray-500 mr-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold">NY, 10001</span>
            </div>
            
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 transition-all pr-4"
                >
                  <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-white shadow-sm" />
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-bold text-gray-900 leading-none">{currentUser.name}</p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider leading-none mt-1">
                      {currentUser.role === 'admin' ? 'Admin' : 'Customer'}
                    </p>
                  </div>
                  {currentUser.role === 'admin' && <ShieldCheck className="w-3 h-3 text-indigo-600" />}
                </button>

                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setShowProfileMenu(false)} />
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs font-bold text-gray-900">{currentUser.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{currentUser.email}</p>
                      </div>
                      <button 
                        onClick={() => { onViewChange('home'); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4" /> Home Feed
                      </button>
                      {currentUser.role !== 'admin' && (
                        <button 
                          onClick={() => { onViewChange('orders'); setShowProfileMenu(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <ClipboardList className="w-4 h-4" /> My Orders
                        </button>
                      )}
                      <button 
                        onClick={() => { onLogout(); setShowProfileMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="bg-gray-900 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-md"
              >
                Sign In
              </button>
            )}
            
            <button 
              onClick={onOpenCart}
              className="relative p-2 bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
