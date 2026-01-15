
import React from 'react';
import { Star, Clock, Bike } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (restaurant: Restaurant) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  return (
    <div 
      onClick={() => onClick(restaurant)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-gray-800">{restaurant.rating}</span>
        </div>
        {restaurant.featured && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-500 transition-colors">{restaurant.name}</h3>
        <p className="text-sm text-gray-500 mb-3 truncate">
          {restaurant.cuisine.join(' • ')}
        </p>
        
        <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Bike className="w-4 h-4" />
            <span className="text-xs font-medium">${restaurant.deliveryFee.toFixed(2)} Fee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
