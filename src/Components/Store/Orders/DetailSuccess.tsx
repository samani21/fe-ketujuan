import React from 'react';
import {
    CheckCircle2,
    Download,
    Share2,
    ArrowLeft,
    ShoppingBag,
    Receipt,
    Calendar,
    CreditCard,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const DetailSuccess = ({ invoiceId = "INV-2023001", onBack }: { invoiceId: string, onBack: () => void; }) => {
    // Mock data untuk invoice yang sudah dibayar
    const detail = {
        id: invoiceId,
        status: 'success',
        paidAt: '12 Oktober 2023, 14:45',
        amount: 125000,
        method: 'BCA Transfer',
        items: [
            { id: 1, name: 'Nasi Goreng Spesial', qty: 2, price: 70000 },
            { id: 2, name: 'Es Teh Manis', qty: 2, price: 10000 },
            { id: 3, name: 'Biaya Pengiriman', qty: 1, price: 10000 }
        ]
    };

    const formatIDR = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

    return (
        <div className="min-h-screen bg-white font-sans text-neutral-800 pb-10">
            <main className="mx-auto px-6 pt-4">
                {/* Success Animation Area */}
                <div className="flex flex-col items-center text-center space-y-4 mb-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
                        <div className="relative w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-200">
                            <CheckCircle2 size={48} strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-green-600 font-black text-xs uppercase tracking-[0.2em]">Success</p>
                        <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
                            {formatIDR(detail.amount)}
                        </h2>
                        <p className="text-sm text-neutral-400">Pesanan telah dikonfirmasi</p>
                    </div>
                </div>

                {/* Receipt Card */}
                <div className="bg-[#F8F9FA] rounded-[2.5rem] p-8 relative overflow-hidden">
                    {/* Decorative Circles for Receipt Look */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full" />
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full" />

                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Nomor Invoice</p>
                                <p className="font-black text-neutral-800">#{detail.id}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Waktu Bayar</p>
                                <p className="text-xs font-bold text-neutral-800">{detail.paidAt}</p>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-neutral-200 pt-6 space-y-4">
                            {detail.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <p className="text-neutral-500 font-medium">
                                        <span className="text-neutral-800 font-bold">{item.qty}x</span> {item.name}
                                    </p>
                                    <p className="font-bold text-neutral-800">{formatIDR(item.price)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-dashed border-neutral-200 pt-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-neutral-400">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Metode</p>
                                    <p className="text-xs font-black text-neutral-800">{detail.method}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total</p>
                                <p className="text-lg font-black text-green-600">{formatIDR(detail.amount)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-10 space-y-3">
                    <button className="w-full py-4.5 bg-neutral-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-neutral-200 flex items-center justify-center gap-2 hover:bg-black transition-all">
                        <Download size={18} />
                        UNDUH STRUK PEMBAYARAN
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href={'/products'}
                            className="py-4 bg-white border border-neutral-200 text-neutral-800 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-50 transition-all"
                        >
                            <ShoppingBag size={18} />
                            BELANJA LAGI
                        </Link>
                        <button
                            onClick={onBack}
                            className="py-4 bg-white border border-neutral-200 text-neutral-800 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-50 transition-all"
                        >
                            <Receipt size={18} />
                            RIWAYAT
                        </button>
                    </div>
                </div>

                {/* Footer Info */}
                <p className="mt-10 text-center text-[10px] text-neutral-400 font-medium leading-relaxed px-10">
                    Pesanan Anda sedang diproses dan akan segera dikirim. Silakan cek status pesanan secara berkala di halaman riwayat.
                </p>
            </main>
        </div>
    );
};

export default DetailSuccess;