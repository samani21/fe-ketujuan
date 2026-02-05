import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Bell,
    Menu,
    X,
    Calendar,
    Download,
    FileText,
    ChevronDown,
    TrendingUp,
    Filter
} from 'lucide-react';

// --- Data Dummy Laporan ---
const SALES_DATA = [
    { day: 'Sen', sales: 1200000 },
    { day: 'Sel', sales: 1900000 },
    { day: 'Rab', sales: 1500000 },
    { day: 'Kam', sales: 2200000 },
    { day: 'Jum', sales: 3100000 },
    { day: 'Sab', sales: 4500000 },
    { day: 'Min', sales: 3800000 },
];

const TRANSACTION_DETAILS = [
    { id: 1, date: '01 Feb 2024', customer: 'Rudi Tabuti', product: 'Aren Latte (2)', total: 56000, method: 'BCA Transfer' },
    { id: 2, date: '01 Feb 2024', customer: 'Siska Putri', product: 'Matcha Series (1)', total: 32000, method: 'E-Wallet' },
    { id: 3, date: '02 Feb 2024', customer: 'Bambang', product: 'Croissant Box (3)', total: 66000, method: 'QRIS' },
    { id: 4, date: '02 Feb 2024', customer: 'Ayu Lestari', product: 'Caramel Macchiato', total: 35000, method: 'BCA Transfer' },
    { id: 5, date: '03 Feb 2024', customer: 'Kevin Sanjaya', product: 'Americano (5)', total: 100000, method: 'E-Wallet' },
];

const SidebarItem = ({ icon, label, active = false }) => (
    <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20' : 'text-neutral-500 hover:bg-neutral-100'}`}>
        {icon}
        <span className="font-semibold text-sm">{label}</span>
    </button>
);

export default function SalesReport() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">

            {/* --- Sidebar (Sama dengan Dashboard) --- */}
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

            <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-neutral-100 p-6 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center space-x-2 mb-10 px-2">
                    <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center">
                        <TrendingUp size={18} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-emerald-900">PURE<span className="font-light text-neutral-400">ADMIN</span></h1>
                </div>
                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <SidebarItem icon={<FileText size={20} />} label="Laporan" active />
                    <SidebarItem icon={<ShoppingBag size={20} />} label="Pesanan" />
                    <SidebarItem icon={<Users size={20} />} label="Pelanggan" />
                </nav>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-1 min-w-0">
                <header className="bg-white border-b border-neutral-100 sticky top-0 z-30 px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-neutral-800">Laporan Penjualan</h2>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Date Range Picker Placeholder */}
                        <div className="flex items-center space-x-2 bg-neutral-50 border border-neutral-200 px-4 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 cursor-pointer">
                            <Calendar size={16} />
                            <span>01 Feb 2024 - 07 Feb 2024</span>
                            <ChevronDown size={14} />
                        </div>
                        {/* Export Button */}
                        <button className="flex items-center space-x-2 bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-colors">
                            <Download size={16} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                    </div>
                </header>

                <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 space-y-6">

                    {/* --- Chart Section --- */}
                    <section className="bg-white p-6 sm:p-8 rounded-[2rem] border border-neutral-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-neutral-800">Tren Pendapatan</h3>
                                <p className="text-sm text-neutral-400 font-medium">Grafik penjualan 7 hari terakhir</p>
                            </div>
                            <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl font-bold text-sm">
                                <TrendingUp size={16} />
                                <span>+14.2%</span>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={SALES_DATA}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#064e3b" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#064e3b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                        tickFormatter={(value) => `Rp${value / 1000000}jt`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '700' }}
                                        formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Penjualan']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#064e3b"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    {/* --- Detailed Table Section --- */}
                    <section className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-neutral-50 flex items-center justify-between bg-white">
                            <h3 className="text-lg font-bold text-neutral-800">Detail Transaksi</h3>
                            <button className="p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-500">
                                <Filter size={18} />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-neutral-50/50 text-[11px] uppercase tracking-widest text-neutral-400 font-black">
                                        <th className="px-6 py-5">Tanggal</th>
                                        <th className="px-6 py-5">Nama Pelanggan</th>
                                        <th className="px-6 py-5">Produk Terjual</th>
                                        <th className="px-6 py-5">Total Harga</th>
                                        <th className="px-6 py-5">Metode Pembayaran</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {TRANSACTION_DETAILS.map((trx) => (
                                        <tr key={trx.id} className="hover:bg-neutral-50/50 transition-colors group">
                                            <td className="px-6 py-4 text-sm font-medium text-neutral-500 whitespace-nowrap">
                                                {trx.date}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-neutral-800">{trx.customer}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-neutral-600 italic font-medium">{trx.product}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-emerald-900">
                                                    Rp {trx.total.toLocaleString('id-ID')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 rounded-full bg-neutral-300" />
                                                    <span className="text-xs font-bold text-neutral-500">{trx.method}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 bg-neutral-50/30 flex justify-center">
                            <button className="text-sm font-bold text-neutral-400 hover:text-emerald-900 transition-colors">
                                Tampilkan Lebih Banyak
                            </button>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}