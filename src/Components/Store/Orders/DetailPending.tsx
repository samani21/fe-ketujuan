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
    FileText
} from 'lucide-react';

const DetailPending = ({ invoiceId = "INV-2023001", onBack }: { invoiceId: string, onBack: () => void; }) => {
    const fileInputRef = useRef<any>(null);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Mock data detail invoice
    const detail = {
        id: invoiceId,
        status: 'pending', // pending, success, failed
        date: '12 Oktober 2023, 14:20',
        customer: {
            name: 'Budi Santoso',
            phone: '0812-3456-7890',
            address: 'Jl. Sudirman No. 123, Jakarta Selatan'
        },
        items: [
            { id: 1, name: 'Nasi Goreng Spesial', price: 35000, qty: 2, image: 'https://images.unsplash.com/photo-1512058560566-42724afbc2db?w=100&h=100&fit=crop' },
            { id: 2, name: 'Es Teh Manis', price: 5000, qty: 2, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100&h=100&fit=crop' },
            { id: 3, name: 'Kerupuk Udang', price: 10000, qty: 1, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=100&h=100&fit=crop' }
        ],
        payment: {
            method: 'Transfer BCA',
            accountName: 'PureEats Jakarta',
            accountNumber: '883012345678',
            subtotal: 90000,
            shipping: 10000,
            total: 100000
        }
    };

    const statusTheme: any = {
        pending: { label: 'Menunggu Pembayaran', color: 'text-orange-500', bg: 'bg-orange-50', icon: <Clock size={20} /> },
        success: { label: 'Pembayaran Berhasil', color: 'text-green-500', bg: 'bg-green-50', icon: <CheckCircle2 size={20} /> },
        failed: { label: 'Pesanan Gagal', color: 'text-red-500', bg: 'bg-red-50', icon: <XCircle size={20} /> }
    };

    const currentStatus = statusTheme[detail.status];
    const formatIDR = (amount: any) => `Rp ${amount.toLocaleString('id-ID')}`;

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
                    <p className="text-xs opacity-80 uppercase tracking-widest font-bold">{detail.id} • {detail.date}</p>
                </div>

                {/* Info Pengiriman */}
                <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-neutral-100 space-y-4">
                    <div className="flex items-center gap-3 text-neutral-400">
                        <MapPin size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-800">Alamat Pengiriman</h3>
                    </div>
                    <div className="pl-7">
                        <p className="font-bold text-sm">{detail.customer.name}</p>
                        <p className="text-xs text-neutral-500">{detail.customer.phone}</p>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{detail.customer.address}</p>
                    </div>
                </section>

                {/* Ringkasan Produk */}
                <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-neutral-100 space-y-4">
                    <div className="flex items-center gap-3 text-neutral-400">
                        <Package size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-800">Rincian Produk</h3>
                    </div>
                    <div className="space-y-4">
                        {detail.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-neutral-100" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold truncate">{item.name}</h4>
                                    <p className="text-[10px] text-neutral-400">{item.qty}x • {formatIDR(item.price)}</p>
                                </div>
                                <p className="text-sm font-black">{formatIDR(item.price * item.qty)}</p>
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
                            <p className="text-[10px] text-neutral-400 font-bold uppercase">{detail.payment.method}</p>
                            <p className="text-sm font-black text-neutral-800">{detail.payment.accountNumber}</p>
                        </div>
                        <button
                            onClick={() => handleCopy(detail.payment.accountNumber)}
                            className="p-2 text-neutral-400 hover:text-orange-500 transition-colors"
                        >
                            <Copy size={16} />
                        </button>
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs text-neutral-500">
                            <span>Subtotal</span>
                            <span>{formatIDR(detail.payment.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-neutral-500">
                            <span>Biaya Pengiriman</span>
                            <span>{formatIDR(detail.payment.shipping)}</span>
                        </div>
                        <div className="flex justify-between text-base font-black text-neutral-800 pt-2 border-t border-dashed border-neutral-200">
                            <span>Total Bayar</span>
                            <span className="text-orange-500">{formatIDR(detail.payment.total)}</span>
                        </div>
                    </div>
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
            {detail.status === 'pending' && (
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
            )}
        </div>
    );
};

export default DetailPending;