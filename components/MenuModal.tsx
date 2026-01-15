
import React, { useState } from 'react';
import { X, Plus, Star, Info, MessageSquare, UtensilsCrossed } from 'lucide-react';
import { Restaurant, MenuItem, Review } from '../types';
import ReviewSystem from './ReviewSystem';

interface MenuModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateRestaurant?: (restaurant: Restaurant) => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ restaurant, onClose, onAddToCart, onUpdateRestaurant }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');

  if (!restaurant) return null;

  const handleAddReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    if (!onUpdateRestaurant) return;
    
    const reviewWithMeta: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedReviews = [reviewWithMeta, ...restaurant.reviews];
    const newAverage = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
    
    onUpdateRestaurant({
      ...restaurant,
      reviews: updatedReviews,
      rating: parseFloat(newAverage.toFixed(1))
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative h-48 sm:h-64 flex-shrink-0">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur hover:bg-white/40 rounded-full text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{restaurant.name}</h2>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {restaurant.rating}</span>
              <span>{restaurant.deliveryTime}</span>
              <span>{restaurant.cuisine.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-100 bg-white sticky top-0 z-10">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'menu' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/30' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            Menu
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'reviews' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/30' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <MessageSquare className="w-4 h-4" />
            Reviews ({restaurant.reviews.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white">
          {activeTab === 'menu' ? (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurant.menu.map((item) => (
                  <div key={item.id} className="group bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl p-4 flex gap-4 transition-all hover:shadow-lg">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{item.name}</h4>
                          <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium bg-white px-2 py-0.5 rounded-full border border-gray-100">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          {item.rating}
                        </div>
                        <button 
                          onClick={() => onAddToCart(item)}
                          className="bg-white hover:bg-orange-500 text-orange-600 hover:text-white p-1.5 rounded-lg border border-orange-200 hover:border-orange-500 transition-all shadow-sm active:scale-90"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ReviewSystem 
              reviews={restaurant.reviews} 
              onAddReview={handleAddReview}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
