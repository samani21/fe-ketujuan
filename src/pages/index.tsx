import React, { useEffect, useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  ChevronRight,
  Navigation,
  Phone,
  Info,
  Store,
  ShoppingBag
} from 'lucide-react';
import { OutletType } from '@/types/Outlet';
import { outletDummey } from '@/data/OutletDummy';
import LayoutStore from './Layout/LayoutStore';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [outlets, setOutlets] = useState<OutletType[]>([]);
  const filteredOutlets = outlets.filter(outlet =>
    outlet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setOutlets(outletDummey);
  }, [])

  return (
    <LayoutStore setSearchQuery={setSearchQuery} searchQuery={searchQuery}>
      {/* Banner Section - Updated to Emerald Green */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-[var(--primary-color)] aspect-[21/9] relative flex items-center justify-center p-6 text-center shadow-lg">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="relative">
          <h2 className="text-white font-bold text-xl tracking-tight">Pure Quality, Pure Taste</h2>
          <p className="text-blue-200 text-xs mt-1 font-light italic">Pilih outlet terdekat untuk kebahagiaanmu</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-col">
          <h3 className="font-bold text-slate-800">Daftar Outlet</h3>
          <div className="h-1 w-8 bg-[var(--primary-color)] rounded-full mt-1"></div>
        </div>
        <span className="text-[10px] bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          {filteredOutlets.length} Lokasi
        </span>
      </div>

      {/* List of Outlets */}
      <div className="space-y-4">
        {filteredOutlets.length > 0 ? (
          filteredOutlets.map((outlet) => (
            <div
              key={outlet.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] duration-200 group relative overflow-hidden"
            >
              {/* Decorative background element on hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 opacity-50"></div>

              <div className="flex gap-4 relative z-10">
                {/* Store Icon */}
                <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-[#064e3b] group-hover:bg-[var(--primary-color)] group-hover:text-white transition-all duration-300">
                  <Store size={32} strokeWidth={1.5} />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 text-sm leading-snug pr-2 group-hover:text-blue-900">
                      {outlet.name}
                    </h4>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-[var(--primary-color)] transition-transform group-hover:translate-x-1" />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {outlet.address}
                  </p>

                  <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <MapPin size={14} className="text-[var(--primary-color)]" />
                      <span className="font-medium">{outlet.distance}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Clock size={14} className="text-[var(--primary-color)]" />
                      <span className={`font-bold ${outlet.status === 'Buka' ? 'text-[var(--primary-color)]' : 'text-rose-500'}`}>
                        {outlet.status}
                      </span>
                      <span className="text-slate-400 font-medium">• s/d {outlet.closeTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-50 relative z-10">
                <button className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 text-slate-700 text-[11px] font-bold hover:bg-blue-50 hover:text-[var(--primary-color)] transition-colors border border-transparent hover:border-blue-100">
                  <Navigation size={14} /> Navigasi
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[var(--primary-color)] text-white text-[11px] font-bold hover:bg-[var(--secondary-color)] transition-all shadow-sm hover:shadow-blue-200">
                  Pesan Sekarang
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={24} />
            </div>
            <p className="text-slate-500 text-sm italic font-light">Outlet tidak ditemukan...</p>
          </div>
        )}
      </div>
    </LayoutStore>
  );
};

export default App;