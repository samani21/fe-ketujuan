import React, { useEffect } from 'react';
import { Search, MapPin, Phone, Info, Store, ShoppingBag, LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';
import { StoreData } from '@/services/storeService';
import { appConfig } from '@/config/appConfig';
import { authService } from '@/services/authService';

const listMenu = [
    { icon: <Store size={22} strokeWidth={2.5} />, name: "Outlet", url: '/' },
    { icon: <MapPin size={22} />, name: "Maps", url: '/maps' },
    { icon: <Info size={22} />, name: "Info", url: '/info' },
    { icon: <Phone size={22} />, name: "Kontak", url: '/contact' },
]

interface LayoutStoreProps {
    children: React.ReactNode;
    setSearchQuery?: (v: string) => void;
    searchQuery?: string;
    storeData?: StoreData | null; // Dinamis dari API
    userLocationName?: string;   // Dinamis dari Geolocation
}

const LayoutStore = ({ children, setSearchQuery, searchQuery, storeData, userLocationName }: LayoutStoreProps) => {
    const route = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    useEffect(() => {
        checkLogin()
    }, [params, route, pathname])

    const handleLogout = async () => {
        try {
            const response: any = await authService.logout();
            if (response) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("client");

                window.location.href = 'https://app.katujuan.net/';
            }

        } catch (err: any) {
            console.log(err.message || "Gagal diproses");
        }
    }
    const checkLogin = () => {
        const token = params.get("token");
        const user = params.get("user");
        const client = params.get("client");
        // if (!token || !user) {
        //     window.location.href = '/'
        // }
        let hasAuthParam = false;

        if (token) {
            localStorage.setItem("token", token);
            hasAuthParam = true;
        }

        if (user) {
            localStorage.setItem("user", user);
            hasAuthParam = true;
        }

        if (client) {
            localStorage.setItem("client", client);
            hasAuthParam = true;
        }

        // 🔥 hapus param dari URL
        if (hasAuthParam) {
            route.replace(pathname);
        }

    }
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-screen-md mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {/* Logo Dinamis */}
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner">
                                <img
                                    src={storeData?.logo || '/katujuan.png'}
                                    alt="Logo"
                                    className="w-full h-full object-contain p-1"
                                />
                            </div>
                            <div>
                                {/* Nama Brand Dinamis */}
                                <h1 className="text-sm font-black text-slate-900 leading-none uppercase tracking-tight">
                                    {storeData?.name || 'Loading...'}
                                </h1>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                                    <MapPin size={10} className="text-rose-500" />
                                    Lokasi Anda: <span className="text-slate-600">{userLocationName || 'Banjarmasin'}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => route.push('/products')} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-900 transition-colors shadow-sm border border-slate-100">
                                <ShoppingBag size={20} />
                            </button>
                            <button onClick={handleLogout} className="p-2.5 bg-slate-50 rounded-xl text-red-400 cursor-pointer hover:text-blue-900 transition-colors shadow-sm border border-slate-100">
                                <LogOutIcon size={20} />
                            </button>
                        </div>
                    </div>

                    {setSearchQuery && (
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Cari outlet..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-900/10 focus:bg-white focus:border-blue-900 transition-all outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-screen-md mx-auto px-4 py-6">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-8 py-4 max-w-screen-md mx-auto flex justify-between items-center shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-30 rounded-t-[2.5rem]">
                {listMenu?.map((ls, i) => {
                    // Logika Active: Memastikan '/' cocok dengan Home
                    const isActive = ls.url === pathname || (ls.url === '/' && pathname === null);

                    return (
                        <div
                            key={i}
                            onClick={() => route.push(ls.url)}
                            className={`flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer ${isActive
                                ? 'text-blue-900 scale-110'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {/* Icon Section */}
                            <div className={`transition-transform ${isActive ? '-translate-y-1' : ''}`}>
                                {ls.icon}
                            </div>

                            {/* Text Section: Sekarang selalu terlihat tapi beda ketebalan/warna */}
                            <span className={`text-[9px] uppercase tracking-[0.15em] transition-all ${isActive
                                ? 'font-black opacity-100'
                                : 'font-bold opacity-60'
                                }`}>
                                {ls.name}
                            </span>

                            {/* Active Indicator Dot */}
                            {isActive && (
                                <div className="w-1 h-1 bg-blue-900 rounded-full mt-0.5 animate-pulse"></div>
                            )}
                        </div>
                    );
                })}
            </nav>
            <div className="h-28"></div>
        </div>
    );
};

export default LayoutStore;