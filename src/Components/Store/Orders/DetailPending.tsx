import React, { useState, useRef } from 'react';
import {
    ArrowLeft,
    Copy,
    Download,
    MessageCircle,
    Package,
    CreditCard,
    MapPin,
    CheckCircle2,
    Clock,
    XCircle,
    Upload,
    FileText,
    CheckCheck
} from 'lucide-react';
import { OrdersType } from '@/types/Client/Orders';

const DetailPending = ({ invoice, onBack }: { invoice: OrdersType, onBack: () => void; }) => {
    const fileInputRef = useRef<any>(null);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);


    const statusTheme: any = {
        pending: { label: 'Menunggu Diverifikasi', color: 'text-orange-500', bg: 'bg-orange-50', icon: <Clock size={20} /> },
        processing: { label: 'Pesanan Sedang diproses', color: 'text-blue-500', bg: 'bg-blue-50', icon: <Clock size={20} /> },
        failed: { label: 'Pesanan Gagal', color: 'text-red-500', bg: 'bg-red-50', icon: <XCircle size={20} /> },
        expired: { label: 'Pesanan Telah expired', color: 'text-gray-500', bg: 'bg-gray-50', icon: <XCircle size={20} /> },
        finished: { label: 'Pesanan Telah Selesai', color: 'text-green-500', bg: 'bg-green-50', icon: <CheckCheck size={20} /> }
    };

    const currentStatus = statusTheme[invoice.status];
    const formatIDR = (amount: any) => {
        // Ubah ke number dan bulatkan untuk membuang desimal
        const value = Math.floor(Number(amount));

        return `Rp ${value.toLocaleString('id-ID')}`;
    };


    const handleCopy = (text: string) => {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUploadConfirm = async () => {
        if (!selectedFile) return;
        setIsUploading(true);

        // Simulasi proses upload ke API
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            // console.log("File diunggah:", selectedFile?.name);
            // Di sini Anda biasanya akan memanggil Post API dengan FormData
            // Setelah berhasil, Anda mungkin ingin me-refresh status invoice
        } finally {
            setIsUploading(false);
            setSelectedFile(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-32 font-sans text-neutral-800">

            <main className="mx-auto p-6 space-y-4">

                {/* Status Card */}
                <div className={`${currentStatus.bg} ${currentStatus.color} rounded-[2rem] p-6 flex flex-col items-center text-center space-y-2 border border-current/10`}>
                    {currentStatus.icon}
                    <h2 className="font-black text-lg">{currentStatus.label}</h2>
                    <p className="text-xs opacity-80 uppercase tracking-widest font-bold">{invoice?.order_number} • {new Intl.DateTimeFormat('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // Ubah ke true jika ingin format AM/PM
                    }).format(new Date(invoice.created_at)).replace('.', ':')}</p>
                </div>

                {/* Ringkasan Produk */}
                <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-neutral-100 space-y-4">
                    <div className="flex items-center gap-3 text-neutral-400">
                        <Package size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-800">Rincian Produk</h3>
                    </div>
                    <div className="space-y-4">
                        {invoice.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                                <img src={item.product?.image} alt={item.product?.name} className="w-12 h-12 rounded-xl object-cover bg-neutral-100" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold truncate">{item?.product?.name}</h4>
                                    <p className="text-[10px] text-neutral-400">{item.quantity}x • {formatIDR(item.price_at_purchase)}</p>
                                </div>
                                <p className="text-sm font-black">{formatIDR(item.price_at_purchase * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Info Pembayaran */}
                <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-neutral-100 space-y-4">
                    <div className="flex items-center gap-3 text-neutral-400">
                        <CreditCard size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-800">Informasi Pembayaran</h3>
                    </div>

                    <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase">{invoice?.payment_method == 'va_mandiri' ? "Virtual Akun Mandiri" : "Transfer " + invoice?.payment_method}</p>
                            <p className="text-sm font-black text-neutral-800">{invoice?.payment_destination}</p>
                        </div>
                        <button
                            onClick={() => handleCopy(invoice?.payment_destination)}
                            className="p-2 text-neutral-400 hover:text-[var(--primary-color)] transition-colors"
                        >
                            <Copy size={16} />
                        </button>
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs text-neutral-500">
                            <span>Subtotal</span>
                            <span>{formatIDR(invoice?.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-neutral-500">
                            <span>Biaya Pengiriman</span>
                            <span>{formatIDR(invoice?.shipping_cost)}</span>
                        </div>
                        <div className="flex justify-between text-base font-black text-neutral-800 pt-2 border-t border-dashed border-neutral-200">
                            <span>Total Bayar</span>
                            <span className="text-[var(--primary-color)]">{formatIDR(invoice?.total_price)}</span>
                        </div>
                    </div>
                    <img src={invoice?.payment_proof_url} className='rounded-md' />
                </section>

                {/* Bantuan */}
                <div className="py-4 text-center">
                    <p className="text-[10px] text-neutral-400 font-medium italic">
                        Punya kendala dengan pesanan Anda?
                    </p>
                    <button className="mt-2 flex items-center gap-2 mx-auto text-xs font-bold text-neutral-600 hover:text-orange-500 transition-colors">
                        <MessageCircle size={16} />
                        Hubungi Customer Service
                    </button>
                </div>
            </main>
            {/* Floating Action (If Pending) */}
            {/* {invoice.status === 'pending' && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-neutral-100 max-w-md mx-auto z-20">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <div className="space-y-3">
                        {selectedFile ? (
                            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 flex items-center justify-between animate-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="bg-orange-500 p-2 rounded-lg text-white">
                                        <FileText size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-orange-600 uppercase">File Terpilih</p>
                                        <p className="text-xs font-bold text-neutral-800 truncate">{selectedFile?.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedFile(null)}
                                    className="p-1 hover:bg-orange-200/50 rounded-full text-orange-600"
                                >
                                    <XCircle size={18} />
                                </button>
                            </div>
                        ) : null}

                        <button
                            disabled={isUploading}
                            onClick={() => selectedFile ? handleUploadConfirm() : fileInputRef.current.click()}
                            className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${selectedFile
                                ? 'bg-neutral-900 text-white shadow-neutral-200'
                                : 'bg-orange-500 text-white shadow-orange-200 hover:bg-orange-600'
                                }`}
                        >
                            {isUploading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {selectedFile ? <CheckCircle2 size={18} /> : <Upload size={18} />}
                                    {selectedFile ? 'KONFIRMASI UNGGAH' : 'UNGGAH BUKTI PEMBAYARAN'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default DetailPending;