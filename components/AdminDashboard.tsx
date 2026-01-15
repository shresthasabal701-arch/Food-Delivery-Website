
import React, { useState } from 'react';
import { LayoutDashboard, Store, Users, DollarSign, TrendingUp, Plus, Settings, ChevronRight, PieChart } from 'lucide-react';
import { Restaurant } from '../types';

interface AdminDashboardProps {
  restaurants: Restaurant[];
  onAddRestaurant: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ restaurants, onAddRestaurant }) => {
  const stats = [
    { label: 'Total Revenue', value: '$24,592', change: '+12.5%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: '1,284', change: '+18.2%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Users', value: '8,432', change: '+5.4%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg Rating', value: '4.7', change: '+0.2', icon: PieChart, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your platform and restaurants overview</p>
        </div>
        <button 
          onClick={onAddRestaurant}
          className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Restaurant
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Restaurant List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-600" />
              Manage Restaurants
            </h2>
            <button className="text-sm font-bold text-indigo-600 hover:underline">View All</button>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Restaurant</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cuisine</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {restaurants.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={res.image} className="w-10 h-10 rounded-xl object-cover" />
                        <span className="font-bold text-gray-900 text-sm">{res.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">{res.cuisine[0]}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs font-bold">
                        <PieChart className="w-3 h-3 text-amber-500" />
                        {res.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">Active</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Settings className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Recent activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            Platform Activity
          </h2>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold">
                  {i}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">New restaurant approved</p>
                  <p className="text-xs text-gray-500 mt-0.5">"Tokyo Grill" has joined the platform</p>
                  <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
