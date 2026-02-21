import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Minus, Plus, Upload, X, Copy, Receipt, AlertTriangle } from 'lucide-react';
import { ProductType } from '@/types/Product';
import { Get, Post } from '@/utils/apiWithToken';

// --- Constants ---

interface BanksType {
    code: string;
    name: string;
    accountNumber: string;
    accountName: string;
}

const BANKS = [
    { code: "bca", name: "BCA", accountName: "PureEats Jakarta", accountNumber: "8830 1234 5678" },
    { code: "bni", name: "BNI", accountName: "PureEats Jakarta", accountNumber: "0099 8765 4321" },
    { code: "bri", name: "BRI", accountName: "PureEats Jakarta", accountNumber: "1234 5678 9012" },
];

const SHIPPING_COST = 10000;
const formatIDR = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

type Props = {
    isCheckoutOpen: boolean;
    setIsCheckoutOpen: (v: boolean) => void;
    cart: ProductType[];
    setCart: (v: ProductType[]) => void;
    updateQty: (id: number, qty: number) => void;
}

const ModalCheckoutStore = ({ isCheckoutOpen, setIsCheckoutOpen, cart, updateQty, setCart }: Props) => {
    // --- States ---
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"transfer" | "va">("transfer");
    const [selectedBankCode, setSelectedBankCode] = useState<BanksType | null>(null);
    const [paymentData, setPaymentData] = useState({ code: '', invoice: '' });
    const [cartSnapshot, setCartSnapshot] = useState<ProductType[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isQty, setIsQty] = useState<boolean>(false);
    const cartTotal = cartSnapshot.reduce((sum, item) => sum + (item.price * (item.qty ?? 0)), 0);
    // Mengunci tampilan keranjang saat proses checkout dimulai
    useEffect(() => {
        if (isCheckoutOpen && cart.length > 0 && !isSuccess) {
            setCartSnapshot(cart);
        }
        if (isQty) {
            setCartSnapshot(cart);
            setIsQty(false)
        }
    }, [isCheckoutOpen, cart, isSuccess]);

    const selectedBank = useMemo(() =>
        BANKS.find(b => b.code === selectedBankCode?.code), [selectedBankCode]
    );

    // --- Reset Logic ---
    const handleClose = () => {
        if (isLoading) return; // Jangan tutup jika sedang loading API

        setIsCheckoutOpen(false);
        // Berikan delay sedikit agar animasi slide-down selesai sebelum state di-reset
        setTimeout(() => {
            setIsSuccess(false);
            setIsLoading(false);
            setUploadProgress(0);
            setSelectedFile(null);
            setPaymentMethod("transfer");
            setSelectedBankCode(null);
            setPaymentData({ code: '', invoice: '' });
            setCartSnapshot([]);
        }, 300);
    };

    // --- Actions ---
    const handleFileUpload = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) { clearInterval(interval); return 100; }
                return prev + 25;
            });
        }, 100);
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUploadProgress(100); // Set 100 karena file sudah terpilih
        }
    };

    const handleCheckout = async (methodType: string) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('subtotal', String(cartTotal));
            formData.append('shipping_cost', String(SHIPPING_COST));
            formData.append('total_price', String(cartTotal + SHIPPING_COST));
            formData.append('payment_method', methodType);
            if (methodType != 'va_mandiri') {
                formData.append('payment_destination', String(selectedBank?.accountNumber));

            }
            if (selectedFile) {
                formData.append('payment_proof', selectedFile);
            }
            cart.forEach((item, index) => {
                formData.append(`cart[${index}][product_id]`, String(item.id));
                formData.append(`cart[${index}][price]`, String(item.price));
                formData.append(`cart[${index}][quantity]`, String(item.qty));
            });

            const res = await Post<any, FormData>('/v1/front/checkout', formData);

            if (res?.success) {
                setPaymentData({
                    invoice: res?.data?.order_number || 'INV-' + Date.now(),
                    code: res?.data?.payment_code || res?.data?.payment_destination || '88301234567890'
                });

                if (methodType != 'va_mandiri') {
                    setIsSuccess(true);
                }
                setCart([]); // Kosongkan keranjang di store utama
            }
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkPaymentStatus = async () => {
        setIsLoading(true);
        try {
            const res = await Get<{ success: boolean }>(`/v1/front/orders/status/${paymentData?.invoice}`)
            if (res?.success) {
                setTimeout(() => {
                    setIsLoading(false);
                    setIsSuccess(true);
                }, 1500);
            } else {
                setTimeout(() => {
                    setIsLoading(false);
                    setIsFailed(true)
                    setIsSuccess(false);
                }, 1500);
            }
        } catch (e) {
            setTimeout(() => {
                setIsFailed(true)
                setIsLoading(false);
                setIsSuccess(false);
            }, 1500);
        }
    };

    return (
        <AnimatePresence>
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                    />

                    <motion.div
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative bg-white w-full max-w-lg rounded-t-[2rem] p-6 pb-10 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl"
                    >
                        <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-6" />

                        {isSuccess ? (
                            <SuccessState invoice={paymentData.invoice} onClose={handleClose} />
                        ) : (
                            <>
                                <header className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Ringkasan Pesanan</h2>
                                    <button onClick={handleClose} className="p-2 bg-neutral-50 rounded-full hover:bg-neutral-100 transition">
                                        <X size={20} />
                                    </button>
                                </header>

                                {/* List Produk */}
                                <div className="space-y-4 mb-6">
                                    {cartSnapshot.map(item => (
                                        <CartItem key={item.id} item={item} updateQty={updateQty} isLocked={!!paymentData.code} setIsQty={setIsQty} />
                                    ))}
                                </div>

                                {/* Rincian Biaya */}
                                <section className="border-t border-dashed border-neutral-200 py-4 space-y-2 text-xs">
                                    <div className="flex justify-between text-neutral-500"><span>Subtotal</span><span>{formatIDR(cartTotal)}</span></div>
                                    <div className="flex justify-between text-neutral-500"><span>Biaya Pengiriman</span><span>{formatIDR(SHIPPING_COST)}</span></div>
                                    <div className="flex justify-between font-bold text-base pt-2 text-neutral-800 border-t border-neutral-50 mt-2">
                                        <span>Total Bayar</span>
                                        <span className="text-[var(--primary-color)]">{formatIDR(cartTotal + SHIPPING_COST)}</span>
                                    </div>
                                </section>

                                {/* Metode Pembayaran */}
                                <div className="mt-6 space-y-4">
                                    <p className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Metode Pembayaran</p>

                                    <div className="grid grid-cols-2 gap-3">
                                        {['transfer', 'va'].map((m) => (
                                            <button
                                                key={m}
                                                disabled={!!paymentData.code}
                                                onClick={() => setPaymentMethod(m as any)}
                                                className={`p-4 rounded-2xl border text-xs font-bold transition-all ${paymentMethod === m ? "border-[var(--primary-color)] bg-[var(--primary-color)]/5 text-[var(--primary-color)]" : "border-neutral-200 text-neutral-400 opacity-60"}`}
                                            >
                                                {m === 'transfer' ? 'Transfer Bank' : 'Virtual Account'}
                                            </button>
                                        ))}
                                    </div>

                                    {paymentMethod === "transfer" && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="grid grid-cols-3 gap-3">
                                                {BANKS.map((bank) => (
                                                    <button
                                                        key={bank.code}
                                                        onClick={() => setSelectedBankCode(bank)}
                                                        className={`p-3 rounded-xl border text-xs font-bold transition ${selectedBankCode?.code === bank.code ? "border-[var(--primary-color)] bg-[var(--primary-color)]/5 text-[var(--primary-color)]" : "border-neutral-100 text-neutral-400"}`}
                                                    >
                                                        {bank.name}
                                                    </button>
                                                ))}
                                            </div>

                                            {selectedBank && (
                                                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex justify-between items-center">
                                                    <div>
                                                        <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-tight">{selectedBank.name} a/n {selectedBank.accountName}</p>
                                                        <p className="font-black text-[var(--primary-color)] text-sm tracking-widest">{selectedBank.accountNumber}</p>
                                                    </div>
                                                    <button className="text-neutral-400 hover:text-[var(--primary-color)]"><Copy size={16} /></button>
                                                </div>
                                            )}

                                            {selectedBankCode && (
                                                <>
                                                    <UploadBox
                                                        progress={uploadProgress}
                                                        onFileChange={handleFileChange}
                                                        fileName={selectedFile?.name}
                                                    />
                                                    <button
                                                        disabled={uploadProgress < 100 || isLoading}
                                                        onClick={() => handleCheckout(selectedBankCode?.code)}
                                                        className={`w-full py-4 rounded-xl font-black text-sm transition-all ${uploadProgress === 100 ? 'bg-[var(--primary-color)] text-white shadow-lg shadow-orange-200' : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'}`}
                                                    >
                                                        {isLoading ? 'MEMPROSES...' : 'KONFIRMASI PEMBAYARAN'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {paymentMethod === "va" && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                                                {paymentData.code ? (
                                                    <div className="text-center py-2">
                                                        <p className="text-xs text-neutral-500 mb-2">Nomor Virtual Account</p>
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <span className="font-black text-[var(--primary-color)] text-xl tracking-[0.2em]">{paymentData.code}</span>
                                                            <Copy size={18} className="text-neutral-300 cursor-pointer" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4">
                                                        <p className="text-xs text-neutral-400 mb-4">Pembayaran akan diproses otomatis via VA</p>
                                                        <button
                                                            disabled={isLoading}
                                                            onClick={() => handleCheckout('va_mandiri')}
                                                            className="w-full p-4 rounded-xl border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-black text-xs hover:bg-[var(--primary-color)] hover:text-white transition-all"
                                                        >
                                                            {isLoading ? 'GENERATING...' : 'DAPATKAN NOMOR VA'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {paymentData.code && (
                                                <>
                                                    {
                                                        isFailed &&
                                                        <div className='flex items-center text-red-500 gap-2'>
                                                            <AlertTriangle />
                                                            <i className='text-red-500'>Invoice belum dibayar</i>
                                                        </div>
                                                    }
                                                    <button
                                                        onClick={checkPaymentStatus}
                                                        disabled={isLoading}
                                                        className="w-full py-4 rounded-xl bg-[var(--primary-color)] text-white font-black text-sm shadow-lg shadow-orange-200 flex items-center justify-center"
                                                    >
                                                        {isLoading ? (
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        ) : 'CEK STATUS PEMBAYARAN'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// --- Sub-Components ---
const CartItem = ({ item, updateQty, isLocked, setIsQty }: { item: ProductType; updateQty: any; isLocked: boolean, setIsQty: (val: boolean) => void; }) => {
    const isOutOfStock = (item.stock ?? 0) <= 0;
    const isMaxQty = (item.qty ?? 0) >= (item.stock || 0);

    return (
        <div className="flex items-center space-x-3 opacity-90">
            <img src={item.image} className="w-14 h-14 rounded-xl object-cover bg-neutral-100" alt={item.name} />
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate">{item.name}</h4>
                <p className="text-xs text-neutral-400">{formatIDR(item.price)}</p>
            </div>
            {!isLocked ? (
                <div className="flex items-center space-x-3 bg-neutral-50 border border-neutral-100 rounded-lg px-2 py-1">
                    <button disabled={isOutOfStock} onClick={() => {
                        updateQty(item.id, -1)
                        setIsQty(true)
                    }} className="p-1 disabled:text-neutral-200 text-neutral-400 hover:text-black">
                        <Minus size={12} />
                    </button>
                    <span className="font-bold text-xs w-4 text-center">{item.qty}</span>
                    <button disabled={isOutOfStock || isMaxQty} onClick={() => {
                        updateQty(item.id, 1)
                        setIsQty(true)
                    }} className="p-1 disabled:text-neutral-200 text-[var(--primary-color)]">
                        <Plus size={12} />
                    </button>
                </div>
            ) : (
                <div className="text-xs font-bold text-neutral-400 bg-neutral-50 px-3 py-1 rounded-lg">
                    {item.qty}x
                </div>
            )}
        </div>
    );
};

const SuccessState = ({ invoice, onClose }: { invoice: string, onClose: () => void }) => (
    <div className="py-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100"
        >
            <CheckCircle2 size={40} />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Berhasil Dipesan!</h2>
        <p className="text-sm text-neutral-500 mb-8 px-8">
            Terima kasih! Pesanan <span className="font-bold text-neutral-800">#{invoice}</span> telah kami terima.
        </p>
        <div className="w-full space-y-3">
            <button
                onClick={onClose}
                className="w-full py-4 rounded-xl bg-neutral-900 text-white font-bold text-sm hover:bg-black transition-colors"
            >
                TUTUP & KEMBALI BELANJA
            </button>
        </div>
    </div>
);

const UploadBox = ({ progress, onFileChange, fileName }: {
    progress: number,
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    fileName?: string
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            className="group border-2 border-dashed border-neutral-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-neutral-50/50 cursor-pointer hover:bg-neutral-50 hover:border-[var(--primary-color)]/30 transition-all"
        >
            {/* Input File Tersembunyi */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={onFileChange}
            />

            {progress === 100 ? (
                <div className="flex flex-col items-center text-green-600">
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider">File Terpilih</span>
                    </div>
                    {fileName && <p className="text-[10px] text-neutral-400 mt-1 truncate max-w-[200px]">{fileName}</p>}
                </div>
            ) : (
                <>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="text-neutral-400 group-hover:text-[var(--primary-color)]" size={20} />
                    </div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">
                        Klik untuk pilih Bukti Transfer<br />
                        <span className="text-neutral-300 font-normal mt-1 block">(JPG, PNG max 2MB)</span>
                    </p>
                </>
            )}
        </div>
    );
};
export default ModalCheckoutStore;