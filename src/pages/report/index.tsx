import React, { useEffect, useState } from 'react';
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
import LayoutAdmin from '../../Components/Layout/LayoutAdmin';
import { SalesDataType, TransactionDetailType } from '@/types/Report';
import { SalesDataDummy, TransactionDetailsDummy } from '@/data/ReportDummy';

// --- Data Dummy Laporan ---

export default function SalesReport() {
    const [salesData, setSalesData] = useState<SalesDataType[]>([]);
    const [transactionDetail, setTransactionDetail] = useState<TransactionDetailType[]>([]);

    useEffect(() => {
        setSalesData(SalesDataDummy);
        setTransactionDetail(TransactionDetailsDummy);
    }, [])
    return (
        <LayoutAdmin>
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
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1A2D5E" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#1A2D5E" stopOpacity={0} />
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
                                    formatter={(value) => [`Rp ${value?.toLocaleString('id-ID')}`, 'Penjualan']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#1A2D5E"
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
                                {transactionDetail.map((trx) => (
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
                                            <span className="text-sm font-black text-blue-900">
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
                        <button className="text-sm font-bold text-neutral-400 hover:text-blue-900 transition-colors">
                            Tampilkan Lebih Banyak
                        </button>
                    </div>
                </section>

            </div>
        </LayoutAdmin>
    );
}