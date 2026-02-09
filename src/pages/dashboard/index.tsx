import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    MoreVertical,
    ArrowUpRight,
} from 'lucide-react';
import LayoutAdmin from '../../Components/Layout/LayoutAdmin';
import { RecentOrderType, StatType } from '@/types/Dashboard';
import { RecentOrderDummy, StatsDummy } from '@/data/DashboardDummy';


const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
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
    const [stats, setStats] = useState<StatType[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrderType[]>([]);
    useEffect(() => {
        setStats(StatsDummy)
        setRecentOrders(RecentOrderDummy)
    })
    return (
        <LayoutAdmin>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 space-y-8">

                {/* --- Stat Cards --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats?.map((stat) => (
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
                            <h3 className="text-lg font-bold text-gray-600">Pesanan Terbaru</h3>
                            <p className="text-xs text-neutral-400">Daftar transaksi yang masuk hari ini</p>
                        </div>
                        <button className="text-blue-700 text-sm font-bold hover:underline">
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
                                {recentOrders?.map((order) => (
                                    <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-sm text-emerald-900">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-600">{order.customer}</div>
                                            <div className="text-[10px] text-neutral-400">{order.date}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500 hidden sm:table-cell max-w-xs truncate">
                                            {order.items}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-sm text-[var(--primary-color)]">{order.amount}</td>
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
        </LayoutAdmin>
    );
}