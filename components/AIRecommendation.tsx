
import React, { useState } from 'react';
import { Sparkles, Loader2, Send, Wand2 } from 'lucide-react';
import { AIRecommendation, Restaurant, MenuItem } from '../types';
import { foodAIService } from '../services/gemini';

interface AIRecommendationProps {
  restaurants: Restaurant[];
  onAddToCart: (item: MenuItem) => void;
}

const AIRecommendationComponent: React.FC<AIRecommendationProps> = ({ restaurants, onAddToCart }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await foodAIService.getSmartRecommendations(restaurants, query);
      setRecommendations(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const findMenuItem = (resId: string, itemId: string) => {
    const res = restaurants.find(r => r.id === resId);
    return res?.menu.find(m => m.id === itemId);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-orange-500 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden mb-12">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-orange-400/20 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl mb-4 inline-flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-300" />
          <span className="font-bold tracking-wide uppercase text-xs">AI Personalized Dining</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 max-w-2xl leading-tight">
          Don't know what to eat? <br/><span className="text-orange-200">Let FlavorAI decide!</span>
        </h2>
        
        <p className="text-indigo-50/80 mb-8 max-w-lg text-lg">
          Describe your mood, cravings, or dietary preference and we'll scan all menus to find your perfect match.
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'I'm feeling like something spicy but healthy and light'"
            className="w-full bg-white border border-white/20 rounded-2xl py-5 pl-6 pr-32 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all text-black placeholder:text-gray-400 text-lg shadow-inner"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            Ask AI
          </button>
        </form>

        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {recommendations.map((rec, idx) => {
              const item = findMenuItem(rec.restaurantId, rec.menuItemId);
              if (!item) return null;
              
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-left hover:bg-white/20 transition-all group flex flex-col h-full shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white leading-tight">{item.name}</h4>
                      <p className="text-[10px] text-orange-200 font-bold uppercase tracking-wider">
                        {restaurants.find(r => r.id === rec.restaurantId)?.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-indigo-50/90 italic mb-6 flex-1 line-clamp-3 leading-relaxed">
                    "{rec.reason}"
                  </p>
                  <button 
                    onClick={() => onAddToCart(item)}
                    className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95 shadow-md"
                  >
                    Add to Cart • ${item.price}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendationComponent;
