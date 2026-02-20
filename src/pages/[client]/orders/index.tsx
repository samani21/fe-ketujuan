import React, { useEffect, useMemo, useState } from 'react';
import {
    Receipt,
    ChevronRight,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    Filter,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import DetailSuccess from '@/Components/Store/Orders/DetailSuccess';
import { storeService } from '@/services/storeService';
import DetailPending from '@/Components/Store/Orders/DetailPending';
import { Get } from '@/utils/apiWithToken';
import { OrdersType } from '@/types/Client/Orders';
import { error } from 'console';

const OrdersPage = () => {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDetail, setIsDetail] = useState<OrdersType | null>(null);
    const [listOrders, setListOrders] = useState<OrdersType[]>();
    const statusConfig: any = {
        pending: {
            label: 'Menunggu',
            color: 'bg-orange-50 text-orange-600 border-orange-100',
            icon: <Clock size={14} />
        },
        paid: {
            label: 'Dibayar',
            color: 'bg-green-50 text-green-600 border-green-100',
            icon: <CheckCircle2 size={14} />
        },
        failed: {
            label: 'Gagal',
            color: 'bg-red-50 text-red-600 border-red-100',
            icon: <XCircle size={14} />
        }
    };
    const filteredInvoices = useMemo(() => {
        // 1. Guard clause untuk menangani data kosong/null
        if (!listOrders) return [];

        // 2. Gunakan strict equality (===) dan bersihkan logika filter
        if (filter === 'all') {
            return listOrders;
        }

        return listOrders.filter((order) => order?.order_number === filter);
    }, [listOrders, filter]);

    useEffect(() => {
        fetchStore();
        fetchOrders()
    }, [])
    const formatIDR = (amount: any) => {
        // Ubah ke number dan bulatkan untuk membuang desimal
        const value = Math.floor(Number(amount));

        return `Rp ${value.toLocaleString('id-ID')}`;
    };

    // Hasil: Rp 144.000

    // Hasil: Rp 132.000,00

    const fetchStore = async (lat?: number, lng?: number) => {
        try {
            const result = await storeService.getStoreInfo(lat, lng);
            if (result.status === 'success') {
                if (result.data) {
                    document.documentElement.style.setProperty('--primary-color', result.data?.branding?.primary_color || '#1A2D5E');
                    // Mengonversi hex ke RGB sederhana untuk transparansi (biasanya pakai library, di sini manual sederhana)
                    const r = parseInt(result.data?.branding?.primary_color.slice(1, 3), 16);
                    const g = parseInt(result.data?.branding?.primary_color.slice(3, 5), 16);
                    const b = parseInt(result.data?.branding?.primary_color.slice(5, 7), 16);
                    document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
                }
            }
        } catch (error) {
            console.error("Gagal memuat:", error);
        } finally {
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await Get<{ status: string, data: any }>('/v1/front/orders');
            if (res?.status === 'success') {
                setListOrders(res?.data?.data)
            }
        } catch (e) {
            console.error("Terjadi kesalahan", e)
        }
    }


    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans text-neutral-800">
            {/* Header Utama */}
            <header className="bg-white border-b border-neutral-100 sticky top-0 z-10 px-6 py-4">
                {
                    isDetail ?
                        <div className="max-w-screen-md mx-auto flex items-center gap-4">
                            <button onClick={() => setIsDetail(null)} className="p-2 hover:bg-neutral-50 rounded-full transition">
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-xl font-black tracking-tight">Detail Pesanan</h1>
                        </div> : <div className="max-w-screen-md mx-auto flex items-center gap-4">
                            <Link href={'/products'} className="p-2 hover:bg-neutral-50 rounded-full transition">
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="text-xl font-black tracking-tight">Riwayat Pesanan</h1>
                        </div>
                }
            </header>

            <main className="max-w-screen-md mx-auto p-6 space-y-6">

                {/* Search & Filter */}
                {
                    !isDetail &&
                    <div className="space-y-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Cari nomor invoice..."
                                className="w-full bg-white border border-neutral-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {['all', 'pending', 'paid', 'failed'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${filter === s
                                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                                        : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
                                        }`}
                                >
                                    {s === 'all' ? 'Semua' : statusConfig[s]?.label}
                                </button>
                            ))}
                        </div>
                    </div>

                }
                {/* Invoice List */}
                {
                    isDetail && isDetail?.status === 'paid' ?
                        <DetailSuccess invoiceId={isDetail?.order_number} onBack={() => setIsDetail(null)} /> :
                        isDetail ? <DetailPending invoiceId={isDetail?.order_number} onBack={() => setIsDetail(null)} /> :
                            <div className="space-y-4">
                                {filteredInvoices && filteredInvoices?.length > 0 ? (
                                    filteredInvoices?.map((inv, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-[2rem] border border-neutral-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"
                                        >
                                            {/* Status Badge */}
                                            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-wider border-l border-b flex items-center gap-1.5 ${statusConfig[inv.status].color}`}>
                                                {statusConfig[inv.status].icon}
                                                {statusConfig[inv.status].label}
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400 group-hover:bg-[var(--primary-color)]/10 group-hover:text-[var(--primary-color)] transition-colors">
                                                    <Receipt size={24} />
                                                </div>

                                                <div className="flex-1 space-y-1">
                                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
                                                        {new Intl.DateTimeFormat('id-ID', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false // Ubah ke true jika ingin format AM/PM
                                                        }).format(new Date(inv.created_at)).replace('.', ':')}
                                                    </p>
                                                    <h3 className="font-black text-neutral-800 text-base">
                                                        {inv.order_number}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                        <span>{inv.items?.length} Produk</span>
                                                        <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                                                        <span>{inv.payment_method}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-5 pt-4 border-t border-dashed border-neutral-100 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">Total Pembayaran</p>
                                                    <p className="text-lg font-black text-[var(--primary-color)]">{formatIDR(inv.total_price)}</p>
                                                </div>
                                                <button className="flex items-center gap-1 text-xs font-bold text-neutral-800 bg-neutral-50 px-4 py-2 rounded-xl group-hover:bg-neutral-900 group-hover:text-white transition-all" onClick={() => {
                                                    setIsDetail(inv)
                                                }}>
                                                    Detail
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 flex flex-col items-center text-center space-y-4">
                                        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-300">
                                            <Search size={40} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-800">Invoice tidak ditemukan</p>
                                            <p className="text-xs text-neutral-400">Coba gunakan kata kunci atau filter lain.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                }
            </main>

            {/* Floating Info (Optional) */}

            {
                !isDetail &&
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs bg-neutral-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center font-bold">!</div>
                        <p className="text-[10px] leading-tight font-medium">Ada 1 pesanan yang perlu segera dibayar.</p>
                    </div>
                    <button className="text-[10px] uppercase text-white hover:underline">Bayar</button>
                </div>
            }
        </div>
    );
};

export default OrdersPage;