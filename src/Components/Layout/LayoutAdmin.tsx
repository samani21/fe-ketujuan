import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Menu,
    Bell,
    Search,
    TrendingUp
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Router, useRouter } from 'next/router';

const SidebarItem = ({ icon, label, active = false, url }: { icon: React.ReactNode, label: string, active?: boolean, url: string }) => {
    const router = useRouter();
    return (
        <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-900 text-white shadow-lg shadow-[var(--secondary-color)]' : 'text-neutral-500 hover:bg-neutral-100'}`} onClick={() => router.push(url)}>
            {icon}
            <span className="font-semibold text-sm">{label}</span>
        </button>
    )
};

const MenuSidebar = [
    {
        label: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        url: '/dashboard',
    },
    {
        label: "Manage",
        icon: <ShoppingBag size={20} />,
        url: '/manage',
    },
    {
        label: "Report",
        icon: <Users size={20} />,
        url: '/report',
    },
]

const LayoutAdmin = ({ children, setSearchQuery, searchQuery }: { children: React.ReactNode, setSearchQuery?: (v: string) => void; searchQuery?: string }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    return (
        <div className="min-h-screen bg-slate-100 flex">

            {/* --- Sidebar Overlay (Mobile) --- */}
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
                    <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                        <TrendingUp size={18} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-blue-900">
                        BRAND<span className="font-light text-neutral-400">ADMIN</span>
                    </h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {
                        MenuSidebar?.map((ms, i) => (
                            <SidebarItem icon={ms?.icon} label={ms?.label} key={i} active={pathname == ms?.url} url={ms?.url} />
                        ))
                    }
                </nav>

                <div className="mt-auto pt-6 border-t border-neutral-100">
                    <div className="flex items-center space-x-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-neutral-200" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate">Manager Toko</p>
                            <p className="text-xs text-neutral-400 truncate">admin@pureeats.com</p>
                        </div>
                    </div>
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
                            <h2 className="text-lg font-bold hidden text-gray-700 sm:block">{MenuSidebar?.find((ms) => pathname == ms?.url)?.label}</h2>
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

                <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 space-y-8">

                    {children}
                </div>
            </main>
        </div>
    );

}

export default LayoutAdmin