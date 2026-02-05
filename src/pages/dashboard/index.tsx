import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    DollarSign,
    Menu,
    X,
    Bell,
    Search,
    MoreVertical,
    ArrowUpRight,
    TrendingUp
} from 'lucide-react';

const STATS = [
    { id: 1, label: 'Total Penjualan', value: 'Rp 12.450.000', icon: <DollarSign size={20} />, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 2, label: 'Pesanan Baru', value: '142', icon: <ShoppingBag size={20} />, trend: '+8.2%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 3, label: 'Pelanggan Baru', value: '48', icon: <Users size={20} />, trend: '+5.4%', color: 'text-amber-600', bg: 'bg-amber-50' },
];

const RECENT_ORDERS = [
    { id: '#ORD-7721', customer: 'Budi Santoso', items: 'Aren Latte, Butter Croissant', amount: 'Rp 75.000', status: 'Selesai', date: '5 Menit yang lalu' },
    { id: '#ORD-7722', customer: 'Siti Aminah', items: 'Matcha Green Tea', amount: 'Rp 32.000', status: 'Diproses', date: '12 Menit yang lalu' },
    { id: '#ORD-7723', customer: 'Andi Wijaya', items: 'Caramel Macchiato', amount: 'Rp 35.000', status: 'Menunggu', date: '25 Menit yang lalu' },
    { id: '#ORD-7724', customer: 'Dewi Lestari', items: 'Pain au Chocolat', amount: 'Rp 26.000', status: 'Selesai', date: '1 Jam yang lalu' },
];

const SidebarItem = ({ icon, label, active = false }) => (
    <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20' : 'text-neutral-500 hover:bg-neutral-100'}`}>
        {icon}
        <span className="font-semibold text-sm">{label}</span>
    </button>
);

const StatusBadge = ({ status }) => {
    const styles = {
        'Selesai': 'bg-emerald-100 text-emerald-700',
        'Diproses': 'bg-blue-100 text-blue-700',
        'Menunggu': 'bg-amber-100 text-amber-700',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
            {status}
        </span>
    );
};

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                    <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center">
                        <TrendingUp size={18} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-emerald-900">
                        PURE<span className="font-light text-neutral-400">ADMIN</span>
                    </h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                    <SidebarItem icon={<ShoppingBag size={20} />} label="Pesanan" />
                    <SidebarItem icon={<Users size={20} />} label="Pelanggan" />
                    <SidebarItem icon={<Bell size={20} />} label="Notifikasi" />
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
                            <h2 className="text-lg font-bold hidden sm:block">Ringkasan Utama</h2>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="relative hidden md:block">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Cari data..."
                                    className="pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 w-64"
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

                    {/* --- Stat Cards --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {STATS.map((stat) => (
                            <motion.div
                                key={stat.id}
                                whileHover={{ y: -4 }}
                                className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                                        {stat.icon}
                                    </div>
                                    <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                        {stat.trend}
                                        <ArrowUpRight size={12} className="ml-1" />
                                    </div>
                                </div>
                                <p className="text-neutral-400 text-sm font-medium">{stat.label}</p>
                                <p className="text-2xl font-black text-black mt-1">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* --- Recent Orders Table --- */}
                    <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-neutral-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold">Pesanan Terbaru</h3>
                                <p className="text-xs text-neutral-400">Daftar transaksi yang masuk hari ini</p>
                            </div>
                            <button className="text-emerald-700 text-sm font-bold hover:underline">
                                Lihat Semua
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-neutral-50 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                                        <th className="px-6 py-4">ID Pesanan</th>
                                        <th className="px-6 py-4">Pelanggan</th>
                                        <th className="px-6 py-4 hidden sm:table-cell">Produk</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {RECENT_ORDERS.map((order) => (
                                        <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-sm text-emerald-900">{order.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold">{order.customer}</div>
                                                <div className="text-[10px] text-neutral-400">{order.date}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-500 hidden sm:table-cell max-w-xs truncate">
                                                {order.items}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-sm">{order.amount}</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-neutral-300 hover:text-neutral-600 transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}