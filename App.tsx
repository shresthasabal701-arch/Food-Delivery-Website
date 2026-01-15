
import React, { useState, useMemo } from 'react';
import { LayoutGrid, Flame, Clock, Search, Filter, ShoppingCart, ShoppingBag, Star, AlertCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import RestaurantCard from './components/RestaurantCard';
import MenuModal from './components/MenuModal';
import CartSidebar from './components/CartSidebar';
import AIRecommendationComponent from './components/AIRecommendation';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import OrderHistory from './components/OrderHistory';
import OrderTracking from './components/OrderTracking';
import { RESTAURANTS as INITIAL_RESTAURANTS } from './constants';
import { Restaurant, CartItem, MenuItem, User, Order } from './types';

const CATEGORIES = ['All', 'Burgers', 'Japanese', 'Italian', 'Mexican', 'Seafood', 'Pizza'];

const App: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'none' | 'rating' | 'speed'>('none');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [activeView, setActiveView] = useState<'home' | 'orders' | 'tracking'>('home');
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const selectedRestaurant = useMemo(() => 
    restaurants.find(r => r.id === selectedRestaurantId) || null
  , [restaurants, selectedRestaurantId]);

  const filteredRestaurants = useMemo(() => {
    let result = restaurants.filter(res => {
      const matchesCategory = selectedCategory === 'All' || res.cuisine.includes(selectedCategory);
      const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           res.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'speed') {
      result = [...result].sort((a, b) => {
        const timeA = parseInt(a.deliveryTime.split('-')[0]);
        const timeB = parseInt(b.deliveryTime.split('-')[0]);
        return timeA - timeB;
      });
    }

    return result;
  }, [restaurants, selectedCategory, searchQuery, sortBy]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleOrderPlaced = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setActiveTrackingOrderId(order.id);
    setActiveView('tracking');
    setIsCartOpen(false);
  };

  const handleTrackOrder = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setActiveView('tracking');
  };

  const activeTrackingOrder = useMemo(() => 
    orders.find(o => o.id === activeTrackingOrderId) || null
  , [orders, activeTrackingOrderId]);

  const handleUpdateRestaurant = (updatedRes: Restaurant) => {
    setRestaurants(prev => prev.map(r => r.id === updatedRes.id ? updatedRes : r));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]);
    setActiveView('home');
  };

  // Find the restaurant for the items currently in cart (assume single restaurant per order for simplicity)
  const cartRestaurant = useMemo(() => {
    if (cartItems.length === 0) return undefined;
    const firstItem = cartItems[0];
    return restaurants.find(r => r.menu.some(m => m.id === firstItem.id));
  }, [cartItems, restaurants]);

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen pb-20 bg-[#F8FAFC]">
      <Navbar 
        cartCount={totalCartItems} 
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onSearch={setSearchQuery} 
        onViewChange={(v) => setActiveView(v as 'home' | 'orders')}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentUser?.role === 'admin' ? (
          <AdminDashboard 
            restaurants={restaurants} 
            onAddRestaurant={() => alert("Add Restaurant functionality triggered!")} 
          />
        ) : activeView === 'tracking' ? (
          <OrderTracking 
            order={activeTrackingOrder} 
            onBack={() => setActiveView('orders')} 
          />
        ) : activeView === 'orders' ? (
          <OrderHistory 
            orders={orders} 
            onBackToHome={() => setActiveView('home')} 
            onTrackOrder={handleTrackOrder}
          />
        ) : (
          <>
            <AIRecommendationComponent restaurants={restaurants} onAddToCart={addToCart} />
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Explore by Cuisine</h2>
                <button className="text-orange-600 font-semibold hover:underline flex items-center gap-1 text-sm">
                  View All <Filter className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex-shrink-0 px-6 py-3 rounded-2xl font-semibold transition-all shadow-sm border ${
                      selectedCategory === category 
                      ? 'bg-orange-500 text-white border-orange-500 shadow-orange-500/20 translate-y-[-2px]' 
                      : 'bg-white text-gray-600 border-gray-100 hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-8">
               <button onClick={() => setSortBy(sortBy === 'none' ? 'rating' : 'none')} className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-sm font-medium transition-all ${sortBy === 'rating' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'}`}>
                  <Star className={`w-4 h-4 ${sortBy === 'rating' ? 'text-white' : 'text-yellow-500'}`} /> Top Rated
               </button>
               <button onClick={() => setSortBy(sortBy === 'speed' ? 'none' : 'speed')} className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-sm font-medium transition-all ${sortBy === 'speed' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'}`}>
                  <Clock className={`w-4 h-4 ${sortBy === 'speed' ? 'text-white' : 'text-indigo-500'}`} /> Fastest
               </button>
               <button className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Flame className="w-4 h-4 text-orange-500" /> Popular
               </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} onClick={(res) => setSelectedRestaurantId(res.id)} />
              ))}
              {filteredRestaurants.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><Search className="w-10 h-10 text-gray-300" /></div>
                  <h3 className="text-xl font-bold text-gray-900">No restaurants found</h3>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <MenuModal restaurant={selectedRestaurant} onClose={() => setSelectedRestaurantId(null)} onAddToCart={addToCart} onUpdateRestaurant={handleUpdateRestaurant} />
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onUpdateQuantity={updateQuantity} 
        onRemove={removeFromCart} 
        onClearCart={clearCart} 
        onOrderPlaced={handleOrderPlaced}
        restaurantLocation={cartRestaurant?.location}
      />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={setCurrentUser} />
    </div>
  );
};

export default App;
