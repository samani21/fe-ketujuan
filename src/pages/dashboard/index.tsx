import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    MoreVertical,
    ArrowUpRight,
    DollarSign,
    ShoppingBag,
    Users,
} from 'lucide-react';
import LayoutAdmin from '../../Components/Layout/LayoutAdmin';
import { RecentOrderType, StatType } from '@/types/Dashboard';
import { RecentOrderDummy, StatsDummy } from '@/data/DashboardDummy';
import { Get } from '@/utils/apiWithToken';
import { OrdersType } from '@/types/Client/Orders';
import Link from 'next/link';



const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'finished': 'bg-emerald-100 text-emerald-700',
        'pending': 'bg-blue-100 text-blue-700',
        'processing': 'bg-amber-100 text-amber-700',
        'failed': 'bg-red-100 text-red-700',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
            {status}
        </span>
    );
};

const formatRupiah = (value: number | string) => {
    const number = Number(value);

    return `Rp ${number.toLocaleString('id-ID', {
        minimumFractionDigits: number % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    })}`;
};
export default function Dashboard() {
    const [payment, setPayment] = useState<number>(0);
    const [countOrder, setCountOrder] = useState<number>(0);
    const [customers, setCustomers] = useState<number>(0);
    const [orders, setOrder] = useState<OrdersType[]>();
    useEffect(() => {
        getDashboard()
    }, [])
    const getDashboard = async () => {
        try {
            const res = await Get<{ status: string, data: any }>('v1/dashboard');
            if (res?.status === 'success') {
                setPayment(res?.data?.payment)
                setCustomers(res?.data?.customers)
                setCountOrder(res?.data?.order)
                setOrder(res?.data?.orders?.data)
            }
        } catch (e) {

        }
    }
    return (
        <LayoutAdmin>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 space-y-8">
                {/* --- Stat Cards --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`bg-emerald-50 text-emerald-600 p-3 rounded-2xl`}>
                                <DollarSign size={20} />
                            </div>
                            {/* <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                {stat.trend}
                                <ArrowUpRight size={12} className="ml-1" />
                            </div> */}
                        </div>
                        <p className="text-neutral-400 text-sm font-medium">Total Penjualan</p>
                        <p className="text-2xl font-black text-black mt-1">{formatRupiah(payment)}</p>
                    </motion.div>
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`bg-blue-50 text-blue-600 p-3 rounded-2xl`}>
                                <ShoppingBag size={20} />
                            </div>
                            {/* <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                <ArrowUpRight size={12} className="ml-1" />
                            </div> */}
                        </div>
                        <p className="text-neutral-400 text-sm font-medium">Pesanan Baru</p>
                        <p className="text-2xl font-black text-black mt-1">{countOrder}</p>
                    </motion.div>
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`bg-amber-50 text-amber-600 p-3 rounded-2xl`}>
                                <Users size={20} />
                            </div>
                            {/* <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                {stat.trend}
                                <ArrowUpRight size={12} className="ml-1" />
                            </div> */}
                        </div>
                        <p className="text-neutral-400 text-sm font-medium">Pelanggan Baru</p>
                        <p className="text-2xl font-black text-black mt-1">{customers}</p>
                    </motion.div>
                </div>

                {/* --- Recent Orders Table --- */}
                <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-neutral-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-600">Pesanan Terbaru</h3>
                            <p className="text-xs text-neutral-400">Daftar transaksi yang masuk hari ini</p>
                        </div>
                        <Link href={'/report/orders'} className="text-blue-700 text-sm font-bold hover:underline">
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-neutral-50 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                                    <th className="px-6 py-4">Inovice</th>
                                    <th className="px-6 py-4">Pelanggan</th>
                                    <th className="px-6 py-4 hidden sm:table-cell">Produk</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {orders?.map((order, i) => (
                                    <tr key={i} className="hover:bg-neutral-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-sm text-emerald-900">{order?.order_number}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-600">{order.customer}</div>
                                            <div className="text-[10px] text-neutral-400">{order.created_at}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500 hidden sm:table-cell max-w-xs truncate">
                                            {order.items?.map((p, i) => (
                                                <p>{p?.product?.name}{(i + 1) != order?.items?.length && ","}</p>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-sm text-[var(--primary-color)]">{formatRupiah(order.total_price)}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
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