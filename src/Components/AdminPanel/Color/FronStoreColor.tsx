import LayoutStore from '@/Components/Layout/LayoutStore'
import { StoreData } from '@/services/storeService'
import { Get } from '@/utils/apiWithToken'
import { ChevronRight, Clock, Info, MapPin, Navigation, Phone, Search, ShoppingBag, Store } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props = {
    infoStore: StoreData | null;
}
const listMenu = [
    { icon: <Store size={22} strokeWidth={2.5} />, name: "Outlet", url: '/' },
    { icon: <MapPin size={22} />, name: "Maps", url: '/maps' },
    { icon: <Info size={22} />, name: "Info", url: '/info' },
    { icon: <Phone size={22} />, name: "Kontak", url: '/contact' },
]
const FronStoreColor = ({ infoStore }: Props) => {
    return (
        //  <LayoutStore >

        //  </LayoutStore>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-screen-md mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {/* Logo Dinamis */}
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner">
                                <img
                                    src={infoStore?.logo || '/katujuan.png'}
                                    alt="Logo"
                                    className="w-full h-full object-contain p-1"
                                />
                            </div>
                            <div>
                                {/* Nama Brand Dinamis */}
                                <h1 className="text-sm font-black text-slate-900 leading-none uppercase tracking-tight">
                                    {infoStore?.name || 'Loading...'}
                                </h1>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                                    <MapPin size={10} className="text-rose-500" />
                                    Lokasi Anda: Banjarmasin
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-[var(--primary-color)] transition-colors shadow-sm border border-slate-100">
                                <ShoppingBag size={20} />
                            </button>

                        </div>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Cari outlet..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-[var(--primary-color)]/10 focus:bg-white focus:border-[var(--primary-color)] transition-all outline-none"
                            value={''}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-screen-md mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6 px-2">
                    <div className="flex flex-col">
                        <h3 className="font-black text-slate-800 tracking-tight text-lg">Daftar Outlet Terdekat</h3>
                        <div className="h-1 w-6 bg-[var(--primary-color)] rounded-full mt-1"></div>
                    </div>
                    <span className="text-[10px] bg-[var(--primary-color)]/5 text-[var(--primary-color)] px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
                        {infoStore?.outlets?.length} Lokasi
                    </span>
                </div>
                <div>
                    {
                        infoStore?.outlets?.map((outlet) => (
                            <div key={outlet.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-[var(--primary-color)] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                                            <Store size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-[var(--primary-color)] text-sm uppercase leading-tight">{outlet.name}</h4>
                                            <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed max-w-[200px]">{outlet.address}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </div>

                                <div className="flex items-center gap-6 mb-6 ml-16">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={12} className="text-slate-400" />
                                        <p className="text-[10px] font-bold text-slate-500 tracking-tight">
                                            {/* MENAMPILKAN JARAK DARI BACKEND */}
                                            -- Km
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} className={outlet.is_open ? "text-emerald-500" : "text-rose-500"} />
                                        <p className="text-[10px] font-bold text-slate-500">
                                            <span className={outlet.is_open ? "text-emerald-600" : "text-rose-600"}>
                                                {outlet.is_open ? "Buka" : "Tutup"}
                                            </span>
                                            {outlet.is_open && ` • s/d ${outlet.open_until}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                        <Navigation size={14} /> Navigasi
                                    </button>
                                    <button
                                        className="flex-[1.5] py-4 bg-[var(--primary-color)] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-100"
                                    >
                                        Pesan Sekarang
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </main >

            {/* Bottom Navigation */}
            <nav className={`sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-8 py-4 max-w-screen-md mx-auto flex justify-between items-center shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-30 rounded-t-[2.5rem]`}>
                {listMenu?.map((ls, i) => {

                    return (
                        <div
                            key={i}
                            className={`flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer ${ls?.name === 'Outlet'
                                ? 'text-[var(--primary-color)] scale-110'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {/* Icon Section */}
                            <div className={`transition-transform ${ls?.name === 'Outlet' ? '-translate-y-1' : ''}`}>
                                {ls.icon}
                            </div>

                            {/* Text Section: Sekarang selalu terlihat tapi beda ketebalan/warna */}
                            <span className={`text-[9px] uppercase tracking-[0.15em] transition-all ${ls?.name === 'Outlet'
                                ? 'font-black opacity-100'
                                : 'font-bold opacity-60'
                                }`}>
                                {ls.name}
                            </span>

                            {/* Active Indicator Dot */}
                            {ls?.name === 'Outlet' && (
                                <div className="w-1 h-1 bg-[var(--primary-color)] rounded-full mt-0.5 animate-pulse"></div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    )
}

export default FronStoreColor