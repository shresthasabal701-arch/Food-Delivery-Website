
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Package, Bike, Home, Clock, MapPin, Phone, MessageSquare, Star, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { Order } from '../types';
import L from 'leaflet';

interface OrderTrackingProps {
  order: Order | null;
  onBack: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order, onBack }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<L.Map | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);
  
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState<'Preparing' | 'Out for Delivery' | 'Delivered'>('Preparing');
  const [timeLeft, setTimeLeft] = useState(25);

  // Initialize Map
  useEffect(() => {
    if (!order || !mapRef.current) return;

    if (!leafletInstance.current) {
      const restLoc = order.restaurantLocation;
      const userLoc = order.deliveryLocation;
      
      const map = L.map(mapRef.current, {
        center: [ (restLoc.lat + userLoc.lat) / 2, (restLoc.lng + userLoc.lng) / 2 ],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Custom Icons
      const restIcon = L.divIcon({
        html: `<div class="bg-indigo-600 p-2 rounded-xl text-white shadow-xl border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="10" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg></div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const userIcon = L.divIcon({
        html: `<div class="bg-emerald-600 p-2 rounded-xl text-white shadow-xl border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const riderIcon = L.divIcon({
        html: `<div class="bg-orange-500 p-2 rounded-xl text-white shadow-xl border-2 border-white animate-bounce-short"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18H5.8a2 2 0 1 1 .3-4H10"/><path d="M12 18h6.2a2 2 0 1 0-.3-4H12"/><path d="M13 10V6a2 2 0 0 1 4 0v4"/><path d="M15 10a1 1 0 0 1 1 1v4H14v-4a1 1 0 0 1 1-1z"/><path d="M9 10a1 1 0 0 1 1 1v4H8v-4a1 1 0 0 1 1-1z"/></svg></div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([restLoc.lat, restLoc.lng], { icon: restIcon }).addTo(map);
      L.marker([userLoc.lat, userLoc.lng], { icon: userIcon }).addTo(map);

      // Draw route line
      L.polyline([
        [restLoc.lat, restLoc.lng],
        [userLoc.lat, userLoc.lng]
      ], { color: '#6366f1', weight: 4, opacity: 0.6, dashArray: '8, 12' }).addTo(map);

      const rider = L.marker([restLoc.lat, restLoc.lng], { icon: riderIcon }).addTo(map);
      riderMarkerRef.current = rider;
      leafletInstance.current = map;

      // Fit bounds
      const bounds = L.latLngBounds([restLoc.lat, restLoc.lng], [userLoc.lat, userLoc.lng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [order]);

  // Handle Simulation Logic
  useEffect(() => {
    if (!order) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 0.2);
        
        // Update marker position on map
        if (riderMarkerRef.current && leafletInstance.current) {
          const restLoc = order.restaurantLocation;
          const userLoc = order.deliveryLocation;
          const currentLat = restLoc.lat + (userLoc.lat - restLoc.lat) * (next / 100);
          const currentLng = restLoc.lng + (userLoc.lng - restLoc.lng) * (next / 100);
          riderMarkerRef.current.setLatLng([currentLat, currentLng]);
          
          if (next > 95) setCurrentStatus('Delivered');
          else if (next > 10) setCurrentStatus('Out for Delivery');
        }

        return next;
      });

      setTimeLeft((prev) => Math.max(0, prev - 0.05));
    }, 500);

    return () => clearInterval(timer);
  }, [order]);

  if (!order) return null;

  const steps = [
    { label: 'Confirmed', icon: CheckCircle2, status: 'completed' },
    { label: 'Preparing', icon: Package, status: currentStatus === 'Preparing' ? 'active' : 'completed' },
    { label: 'On the way', icon: Bike, status: currentStatus === 'Out for Delivery' ? 'active' : currentStatus === 'Delivered' ? 'completed' : 'pending' },
    { label: 'Delivered', icon: Home, status: currentStatus === 'Delivered' ? 'active' : 'pending' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <style>{`
        .animate-bounce-short { animation: bounce 1.5s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(-10%); } 50% { transform: translateY(0); } }
      `}</style>
      
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors group"
      >
        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-gray-50">
          <ChevronLeft className="w-5 h-5" />
        </div>
        Back to Orders
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            
            <div className="p-8 sm:p-10 flex-shrink-0">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Order Tracking</h1>
                  <p className="text-gray-400 font-medium text-sm flex items-center gap-2 uppercase tracking-wide">
                    Order <span className="text-indigo-600 font-black">{order.id}</span>
                  </p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl flex items-center gap-2 border border-emerald-100 shadow-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Real-time tracking</span>
                </div>
              </div>

              {/* Status Header */}
              <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Arrival</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <span className="text-2xl font-black text-gray-900">{Math.ceil(timeLeft)} mins</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    {currentStatus}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative mb-4 px-4">
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 -translate-y-1/2 rounded-full" />
                <div 
                  className="absolute top-1/2 left-0 h-1.5 bg-orange-500 -translate-y-1/2 transition-all duration-1000 rounded-full shadow-sm" 
                  style={{ width: `${progress}%` }} 
                />
                
                <div className="relative flex justify-between">
                  {steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 z-10 ${
                        step.status === 'completed' ? 'bg-orange-500 border-orange-100 text-white' :
                        step.status === 'active' ? 'bg-white border-orange-500 text-orange-500 shadow-xl' :
                        'bg-white border-gray-100 text-gray-300'
                      }`}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        step.status === 'completed' || step.status === 'active' ? 'text-gray-900' : 'text-gray-300'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Real Interactive Map */}
            <div className="h-[400px] w-full relative group">
              <div ref={mapRef} className="w-full h-full" />
              <div className="absolute top-4 right-4 z-[5] flex flex-col gap-2">
                <button 
                  onClick={() => leafletInstance.current?.setZoom(leafletInstance.current.getZoom() + 1)}
                  className="bg-white p-2 rounded-xl shadow-lg border border-gray-200 text-gray-600 hover:text-orange-500 transition-all font-bold"
                >+</button>
                <button 
                  onClick={() => leafletInstance.current?.setZoom(leafletInstance.current.getZoom() - 1)}
                  className="bg-white p-2 rounded-xl shadow-lg border border-gray-200 text-gray-600 hover:text-orange-500 transition-all font-bold"
                >-</button>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[5] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-100 shadow-xl flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Bike className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-bold text-gray-800">Your rider is on the move!</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=RiderJohn" className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-inner" />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-4 h-4 rounded-full" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-lg">John Rider</h4>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-gray-500">4.9 • Super Rider</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-4 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-all text-sm font-bold text-indigo-700 border border-indigo-100 active:scale-95">
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button className="flex items-center justify-center gap-2 py-4 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-all text-sm font-bold text-orange-700 border border-orange-100 active:scale-95">
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><ShieldCheck className="w-24 h-24" /></div>
            <h4 className="text-xl font-black mb-2 tracking-tight">Safety Protocol</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">Your order is protected by FlavorDash secure delivery. Give this code to the rider if requested.</p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-1">Passcode</p>
              <p className="text-3xl font-black tracking-[0.2em]">{order.id.split('-')[1].slice(0, 6)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
