
import React from 'react';
import { Package, Clock, Calendar, CheckCircle2, ChevronRight, ShoppingBag, MapPin } from 'lucide-react';
import { Order } from '../types';

interface OrderHistoryProps {
  orders: Order[];
  onBackToHome: () => void;
  onTrackOrder: (orderId: string) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onBackToHome, onTrackOrder }) => {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <div className="bg-orange-50 p-10 rounded-full mb-6">
          <ShoppingBag className="w-20 h-20 text-orange-200" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center leading-relaxed">
          Looks like you haven't placed any orders yet. Explore our top restaurants and satisfy your cravings!
        </p>
        <button 
          onClick={onBackToHome}
          className="bg-orange-500 text-white font-bold px-8 py-3 rounded-2xl hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
        >
          Start Exploring
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order History</h1>
          <p className="text-gray-500 mt-1">Track and manage your past cravings</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <Package className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-gray-700">{orders.length} total orders</span>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 uppercase tracking-widest">
                    {order.id}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {order.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {order.time}
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 
                      order.status === 'Preparing' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-gray-900 text-sm">
                            {item.quantity}x {item.name}
                          </h4>
                          <span className="text-sm font-bold text-gray-400">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:w-64 bg-gray-50/50 p-6 rounded-3xl flex flex-col justify-between border border-gray-100/50">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>Payment Mode</span>
                    <span className="uppercase text-gray-900 font-bold">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>Delivery Fee</span>
                    <span className="text-gray-900 font-bold">$2.99</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Paid</span>
                    <span className="text-lg font-extrabold text-orange-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 mt-6">
                  <button 
                    onClick={() => onTrackOrder(order.id)}
                    className="w-full py-3 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                  >
                    <MapPin className="w-4 h-4" />
                    Track Live
                  </button>
                  <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                    Reorder Items
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
