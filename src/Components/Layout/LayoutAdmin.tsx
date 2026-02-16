import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Menu,
    Bell,
    Search,
    TrendingUp,
    LogOutIcon,
    ChevronUp,
    ChevronDown,
    Settings,
    Layers2
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { authService } from '@/services/authService';
import { StoreData } from '@/services/storeService';
import { Get } from '@/utils/apiWithToken';
import PageLoader from '../Component/PageLoader';

const SidebarItem = ({
    icon,
    label,
    url,
    active,
    child
}: {
    icon: React.ReactNode,
    label: string,
    url: string,
    active: boolean,
    child?: { label: string, url: string }[]
}) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(active); // Otomatis buka jika child aktif

    const hasChild = child && child.length > 0;

    const handleClick = () => {
        if (hasChild) {
            setIsOpen(!isOpen);
        } else {
            router.push(url);
        }
    };

    return (
        <div className="w-full">
            {/* Main Menu Item */}
            <button
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${active && !hasChild ? 'bg-[var(--primary-color)]/90 text-white shadow-lg' : 'text-neutral-500 hover:bg-neutral-100'}`}
                onClick={handleClick}
            >
                <div className="flex items-center space-x-3">
                    {icon}
                    <span className="font-semibold text-sm">{label}</span>
                </div>
                {hasChild && (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
            </button>

            {/* Child Menu Items */}
            {hasChild && isOpen && (
                <div className="mt-2 ml-9 space-y-1">
                    {child.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => router.push(item.url)}
                            className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${router.pathname === item.url ? 'text-[var(--primary-color)] font-bold' : 'text-neutral-500 hover:bg-neutral-50'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const MenuSidebar = [
    {
        label: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        url: '/dashboard',
    },
    {
        label: "Categorie",
        icon: <Layers2 size={20} />,
        url: '/categories',
    },
    {
        label: "Products",
        icon: <ShoppingBag size={20} />,
        url: '/products',
    },
    {
        label: "Manage",
        icon: <Settings size={20} />,
        url: '/manage',
        child: [
            {
                label: "Color",
                url: '/manage/color'
            }
        ]
    },
    {
        label: "Report",
        icon: <Users size={20} />,
        url: '/report',
    },
]

type Props = {
    children: React.ReactNode;
    setSearchQuery?: (v: string) => void;
    searchQuery?: string;
    setInfoStore?: (val: StoreData) => void;
}

const LayoutAdmin = ({ children, setSearchQuery, searchQuery, setInfoStore }: Props) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [dataStore, setDataStore] = useState<StoreData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        checkLogin()
        getInfoStore()

    }, [])
    const handleLogout = async () => {
        try {
            const response: any = await authService.logout();
            if (response) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("client");

                router.replace('/')
            }

        } catch (err: any) {
            console.log(err.message || "Gagal diproses");
        }
    }
    const checkLogin = () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const client = JSON.parse(localStorage.getItem('client') || 'null');

        if (client && user?.role === 'customer') {
            handleLogout()
        } else if (!token && !client) {
            window.location.href = '/';
        }
    }

    const currentMenu = MenuSidebar?.reduce((acc, ms) => {
        // 1. Cek jika cocok dengan menu utama
        if (ms.url === pathname) return ms;

        // 2. Cek jika cocok dengan salah satu child
        const activeChild = ms.child?.find(c => c.url === pathname);
        if (activeChild) return activeChild;

        return acc;
    }, null as any);

    const getInfoStore = async () => {
        setLoading(true)
        try {
            const res = await Get<{ status: string, data: StoreData }>('/v1/front/store-info')
            if (res?.status == "success") {
                if (setInfoStore) {
                    setInfoStore(res?.data);
                }
                setDataStore(res?.data);
                document.documentElement.style.setProperty('--primary-color', res?.data?.branding?.primary_color);
                // Mengonversi hex ke RGB sederhana untuk transparansi (biasanya pakai library, di sini manual sederhana)
                const r = parseInt(res?.data?.branding?.primary_color?.slice(1, 3), 16);
                const g = parseInt(res?.data?.branding?.primary_color?.slice(3, 5), 16);
                const b = parseInt(res?.data?.branding?.primary_color?.slice(5, 7), 16);
                document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
                setLoading(false)
            }
        } catch (e: any) {
            setLoading(false)

        }
    }
    if (loading) {
        return <div>
            <PageLoader />
        </div>
    }
    return (
        <div className="min-h-screen bg-slate-100 flex">
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>
            {/* --- Sidebar --- */}
            <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-neutral-100 p-6 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center space-x-2 mb-10 px-2">
                    <div className="w-8 h-8 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                        <TrendingUp size={18} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-[var(--primary-color)]">
                        BRAND<span className="font-light text-neutral-400">ADMIN</span>
                    </h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {MenuSidebar?.map((ms, i) => {
                        // Cek apakah URL utama aktif
                        const isMainActive = pathname === ms.url;

                        // Cek apakah ada anak yang aktif
                        const isChildActive = ms.child?.some(c => pathname === c.url);

                        return (
                            <SidebarItem
                                key={i}
                                icon={ms.icon}
                                label={ms.label}
                                url={ms.url}
                                active={isMainActive || !!isChildActive}
                                child={ms.child} // Kirim data child ke komponen
                            />
                        )
                    })}
                </nav>

                <div className="mt-auto pt-6 border-t border-neutral-100">
                    {/* <div className="flex items-center space-x-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-neutral-200" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate">Manager Toko</p>
                            <p className="text-xs text-neutral-400 truncate">admin@pureeats.com</p>
                        </div>
                    </div> */}
                    <button className='text-red-500 px-4 flex items-center gap-2 cursor-pointer' onClick={handleLogout}>
                        <LogOutIcon />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-1 min-w-0">
                {/* Header */}
                <header className="bg-white border-b border-neutral-100 sticky top-0 z-30">
                    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"
                            >
                                <Menu size={24} />
                            </button>
                            <h2 className="text-lg font-bold hidden text-gray-700 sm:block">
                                {currentMenu?.label || "Dashboard"}
                            </h2>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="relative hidden md:block">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama produk atau kategori..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        if (setSearchQuery) {
                                            setSearchQuery(e.target.value)
                                        }
                                    }}
                                    className="w-full pl-11 pr-4 py-3  text-gray-600 bg-white border border-neutral-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                                />
                            </div>
                            <button className="p-2 text-neutral-500 relative bg-neutral-100 rounded-xl">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-gray-400">
                    {children}
                </div>
            </main>
        </div>
    );

}

export default LayoutAdmin