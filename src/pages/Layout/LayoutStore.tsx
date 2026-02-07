import React, { useEffect, useState } from 'react';
import {
    Search,
    MapPin,
    Phone,
    Info,
    Store,
    ShoppingBag
} from 'lucide-react';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
const listMenu = [
    {
        icon: <Store size={22} strokeWidth={2.5} />,
        name: "Outlet",
        url: '/'
    },
    {
        icon: <MapPin size={22} />,
        name: "Peta",
        url: '/peta'
    },
    {
        icon: <Info size={22} />,
        name: "Info",
        url: '/info'
    },
    {
        icon: <Phone size={22} />,
        name: "Kontak",
        url: '/contact'
    },
]
const LayoutStore = ({ children, setSearchQuery, searchQuery }: { children: React.ReactNode, setSearchQuery?: (v: string) => void, searchQuery?: string }) => {
    const route = useRouter();
    const pathname = usePathname();
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header Section */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-screen-md mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center text-white font-bold text-[8px] text-center leading-tight p-1 shadow-inner">
                                PUREEATS
                            </div>
                            <div>
                                <h1 className="text-sm font-bold text-slate-800 leading-none">PUREEATS</h1>
                                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                    <MapPin size={10} className="text-[var(--primary-color)]" /> Lokasi Anda: Banjarmasin
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => route.push('/products')} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-blue-50 hover:text-[var(--primary-color)] transition-colors cursor-pointer">
                                <ShoppingBag size={20} />
                            </button>
                        </div>
                    </div>

                    {setSearchQuery && <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Cari outlet terdekat..."
                            className="w-full bg-slate-100 border border-transparent rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[var(--primary-color)] focus:bg-white focus:border-[var(--primary-color)] transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>}

                </div>
            </header>

            <main className="max-w-screen-md mx-auto px-4 py-6">
                {children}
            </main>

            {/* Footer Navigation - Updated Theme */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 px-8 py-3 max-w-screen-md mx-auto flex justify-between items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-20">
                {
                    listMenu?.map((ls, i) => (
                        ls?.url === pathname ? <div className="flex flex-col items-center gap-1 text-blue-900 relative cursor-pointer" key={i}>
                            {ls?.icon}
                            <span className="text-[10px] font-black uppercase tracking-tighter">{ls?.name}</span>
                            <div className="absolute -top-1 right-0 w-1.5 h-1.5 bg-[var(--primary-color)] rounded-full"></div>
                        </div> :
                            <div className="flex flex-col items-center gap-1 text-slate-400 hover:text-[var(--primary-color)] transition-colors cursor-pointer" key={i} onClick={() => route.push(ls?.url)}>
                                {ls?.icon}
                                <span className="text-[10px] font-medium uppercase tracking-tighter">{ls?.name}</span>
                            </div>
                    ))
                }
            </nav>
            {/* Spacer for bottom nav */}
            <div className="h-24 max-w-screen-md mx-auto"></div>
        </div>
    );
};

export default LayoutStore;