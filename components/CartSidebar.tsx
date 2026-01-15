
import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart, Trash2, ArrowRight, Wallet, Banknote, CheckCircle, Sparkles, ChevronLeft, Loader2, MapPin, Navigation } from 'lucide-react';
import { CartItem, Order, Coordinates } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
  restaurantLocation?: Coordinates;
}

type CheckoutStep = 'cart' | 'location' | 'payment' | 'success';
type PaymentMethod = 'cod' | 'paytm';

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onClearCart, onOrderPlaced, restaurantLocation }) => {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState('');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  // Reset step when cart closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('cart');
        setPaymentMethod(null);
        setIsProcessing(false);
        setUserLocation(null);
        setAddress('');
      }, 300);
    }
  }, [isOpen]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  const handleUseCurrentLocation = () => {
    setFetchingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setAddress("My Current Location");
          setFetchingLocation(false);
        },
        (error) => {
          console.error(error);
          setFetchingLocation(false);
          // Fallback to mock near NYC
          setUserLocation({ lat: 40.7128 + (Math.random() - 0.5) * 0.01, lng: -74.0060 + (Math.random() - 0.5) * 0.01 });
          setAddress("Downtown NYC");
        }
      );
    } else {
      setFetchingLocation(false);
    }
  };

  const handleConfirmOrder = () => {
    if (!paymentMethod || !userLocation) return;
    setIsProcessing(true);
    
    const now = new Date();
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total: total,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: paymentMethod,
      status: 'Preparing',
      deliveryLocation: userLocation,
      restaurantLocation: restaurantLocation || { lat: 40.7128, lng: -74.0060 }
    };

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      onOrderPlaced(newOrder);
      onClearCart();
    }, 1500);
  };

  const handleFinalClose = () => {
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[70] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={step === 'success' ? handleFinalClose : onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
          <div className="flex items-center gap-3">
            {step !== 'cart' && step !== 'success' && (
              <button 
                onClick={() => setStep(step === 'location' ? 'cart' : 'location')}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 mr-1"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className={`p-2 rounded-xl ${step === 'success' ? 'bg-emerald-100' : 'bg-orange-100'}`}>
              <ShoppingCart className={`${step === 'success' ? 'text-emerald-600' : 'text-orange-600'} w-5 h-5`} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {step === 'cart' ? 'Your Cart' : step === 'location' ? 'Delivery Address' : step === 'payment' ? 'Payment Method' : 'Order Placed!'}
            </h2>
          </div>
          {step !== 'success' && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {step === 'cart' && (
            <div className="p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="bg-gray-50 p-8 rounded-full mb-6">
                    <ShoppingCart className="w-16 h-16 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cart is empty</h3>
                  <p className="text-gray-500 max-w-[240px]">Hungry? Add some delicious items from our top restaurants!</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group animate-in slide-in-from-right-4 duration-300">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-50 group-hover:scale-105 transition-transform" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                          <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-orange-600">${item.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 w-fit rounded-lg px-2 py-1 border border-gray-100">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md transition-colors">
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md transition-colors">
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {step === 'location' && (
            <div className="p-8 space-y-8 animate-in fade-in duration-300">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Set Delivery Location</label>
                <div className="relative group">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 w-5 h-5" />
                   <input 
                    type="text" 
                    placeholder="Enter your street address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-black font-medium"
                   />
                </div>
              </div>

              <button 
                onClick={handleUseCurrentLocation}
                disabled={fetchingLocation}
                className="w-full flex items-center justify-center gap-3 py-4 bg-orange-50 text-orange-600 border border-orange-100 rounded-2xl font-bold hover:bg-orange-100 transition-all active:scale-95"
              >
                {fetchingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                Use Current Location
              </button>

              {userLocation && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 animate-in zoom-in-95">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-emerald-800 tracking-tight">Location Verified</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Ready for precise delivery tracking</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'payment' && (
            <div className="p-8 space-y-6 animate-in fade-in duration-300">
              <p className="text-gray-500 text-sm mb-4">Choose how you'd like to pay:</p>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setPaymentMethod('paytm')}
                  className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${paymentMethod === 'paytm' ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                >
                  <div className={`p-3 rounded-2xl ${paymentMethod === 'paytm' ? 'bg-orange-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div className="text-left"><p className="font-bold text-gray-900">Paytm / UPI</p><p className="text-xs text-gray-500">Fast, secure digital payment</p></div>
                </button>
                <button 
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                >
                  <div className={`p-3 rounded-2xl ${paymentMethod === 'cod' ? 'bg-orange-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div className="text-left"><p className="font-bold text-gray-900">Cash on Delivery</p><p className="text-xs text-gray-500">Pay when your food arrives</p></div>
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25" />
                <div className="relative bg-emerald-500 p-8 rounded-full shadow-xl shadow-emerald-500/20">
                  <CheckCircle className="w-20 h-20 text-white" />
                </div>
                <div className="absolute -top-4 -right-4"><Sparkles className="w-10 h-10 text-yellow-400 animate-pulse" /></div>
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Order Placed!</h3>
              <p className="text-gray-500 leading-relaxed mb-10 max-w-[280px]">Your order has been confirmed and is being prepared with love. Redirecting to live tracking...</p>
              <button onClick={handleFinalClose} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl">View Tracking</button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && step === 'cart' && (
          <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <button onClick={() => setStep('location')} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20">
              Continue to Address <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 'location' && (
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <button 
              disabled={!address || !userLocation}
              onClick={() => setStep('payment')}
              className={`w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${!address || !userLocation ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'}`}
            >
              Continue to Payment <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <button 
              disabled={!paymentMethod || isProcessing}
              onClick={handleConfirmOrder}
              className={`w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${!paymentMethod ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'}`}
            >
              {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>Confirm & Pay ${total.toFixed(2)} <ArrowRight className="w-5 h-5" /></>}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
