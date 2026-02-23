import React, { useEffect, useState } from 'react';
import { Search, MapPin, Phone, Info, Store, ShoppingBag, LogOutIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';
import { StoreData, storeService } from '@/services/storeService';
import { appConfig } from '@/config/appConfig';
import { authService } from '@/services/authService';
import { Get, getClient, getToken } from '@/utils/apiWithToken';
import { OutletType } from '@/types/Outlet';

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
    subdomain?: string;
    setInfoStore?: (val: StoreData | null) => void;
    setOutlets?: (val: OutletType[]) => void;
}

const LayoutStore = ({ children, setSearchQuery, searchQuery, subdomain, setInfoStore, setOutlets }: LayoutStoreProps) => {
    const route = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const token = getToken();
    const [storeData, setStoreData] = useState<StoreData | null>(null);
    const [loading, setLoading] = useState(true);
    const [userLocationName, setUserLocationName] = useState('Mencari lokasi...');

    useEffect(() => {
        checkLogin()
    }, [params, route, pathname])
    useEffect(() => {
        const initStore = async () => {
            setLoading(true);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setUserLocationName("Lokasi Terdeteksi"); // Bisa dikembangkan dengan Reverse Geocoding API
                        await fetchStore(latitude, longitude);
                    },
                    async () => {
                        setUserLocationName("Banjarmasin (Default)");
                        await fetchStore();
                    }
                );
            } else {
                setUserLocationName("Lokasi Tidak Didukung");
                await fetchStore();
            }
        };

        if (subdomain) {
            initStore()
        } else {
            fetchStore()
        }
    }, []);

    const fetchStore = async (lat?: number, lng?: number) => {
        try {
            const result = await storeService.getStoreInfo(lat, lng);
            if (result.status === 'success') {
                setStoreData(result.data ?? null);
                if (setInfoStore) {
                    setInfoStore(result.data ?? null);
                }
                if (setOutlets) {
                    const outlets: OutletType[] = result?.data?.outlets?.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        address: item.address,
                        distance: item.distance ?? null, // default dulu kalau tidak ada
                        status: item.is_open ? 'Buka' : 'Tutup',
                        closeTime: item.open_until,
                        phone: item.telp,
                        coords: {
                            lat: Number(item.latitude),
                            lng: Number(item.longitude),
                        }
                    })) ?? [];
                    setOutlets(outlets);
                }
                if (result.data) {
                    document.documentElement.style.setProperty('--primary-color', result.data?.branding?.primary_color || '#1A2D5E');
                    // Mengonversi hex ke RGB sederhana untuk transparansi (biasanya pakai library, di sini manual sederhana)
                    const r = parseInt(result.data?.branding?.primary_color.slice(1, 3), 16);
                    const g = parseInt(result.data?.branding?.primary_color.slice(3, 5), 16);
                    const b = parseInt(result.data?.branding?.primary_color.slice(5, 7), 16);
                    document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
                }
                setLoading(false)
            }
        } catch (error) {
            console.error("Gagal memuat:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = async () => {
        try {
            const res = await Get<{ message: string }>('v1/auth/logout')
            if (res?.message === 'Successfully logged out') {
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

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="animate-spin text-[var(--primary-color)] mb-4" size={48} />
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Menghitung Jarak Outlet...</p>
        </div>
    );

    if (!storeData) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center p-12">
            <h2 className="text-xl font-black text-slate-800">Toko Tidak Ditemukan</h2>
        </div>
    );
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
                            <button onClick={() => route.push('/products')} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-[var(--primary-color)] transition-colors shadow-sm border border-slate-100">
                                <ShoppingBag size={20} />
                            </button>
                            {token &&
                                <button onClick={handleLogout} className="p-2.5 bg-slate-50 rounded-xl text-red-400 cursor-pointer hover:text-[var(--primary-color)] transition-colors shadow-sm border border-slate-100">
                                    <LogOutIcon size={20} />
                                </button>
                            }
                        </div>
                    </div>

                    {setSearchQuery && (
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Cari outlet..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-[var(--primary-color)]/10 focus:bg-white focus:border-[var(--primary-color)] transition-all outline-none"
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
            <nav className={`fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-8 py-4 max-w-screen-md mx-auto flex justify-between items-center shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-30 rounded-t-[2.5rem]`}>
                {listMenu?.map((ls, i) => {
                    // Logika Active: Memastikan '/' cocok dengan Home
                    const isActive = ls.url === pathname || (ls.url === '/' && pathname === null);

                    return (
                        <div
                            key={i}
                            onClick={() => route.push(ls.url)}
                            className={`flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer ${isActive
                                ? 'text-[var(--primary-color)] scale-110'
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
                                <div className="w-1 h-1 bg-[var(--primary-color)] rounded-full mt-0.5 animate-pulse"></div>
                            )}
                        </div>
                    );
                })}
            </nav>
            {

                <div className="h-28"></div>
            }
        </div>
    );
};

export default LayoutStore;