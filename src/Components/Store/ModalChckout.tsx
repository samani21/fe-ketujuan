import { ProductType } from '@/types/Product';
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Minus, Plus, Upload, X } from 'lucide-react';
import React, { useState } from 'react'

type Props = {
    isCheckoutOpen: boolean;
    setIsCheckoutOpen: (v: boolean) => void;
    cart: ProductType[];
    cartTotal: number;
    setCart: (v: ProductType[]) => void;
    updateQty: (id: number, qty: number) => void;
}

const ModalChckoutStore = ({ isCheckoutOpen, setIsCheckoutOpen, cart, cartTotal, setCart, updateQty }: Props) => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const handleFileUpload = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 25;
            });
        }, 150);
    };

    const handleCheckout = () => {
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setIsCheckoutOpen(false);
            setCart([]);
        }, 2500);
    };
    return (
        <AnimatePresence>
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCheckoutOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                    />

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative bg-white w-full max-w-lg rounded-t-[2rem] p-6 pb-10 max-h-[85vh] overflow-y-auto shadow-2xl"
                    >
                        {/* Handle Bar */}
                        <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-6" />

                        {isSuccess ? (
                            <div className="py-10 flex flex-col items-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4"
                                >
                                    <CheckCircle2 size={36} />
                                </motion.div>
                                <h2 className="text-xl font-bold mb-2">Berhasil Dipesan!</h2>
                                <p className="text-sm text-neutral-400">Pesanan Anda sedang kami siapkan.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Ringkasan Pesanan</h2>
                                    <button onClick={() => setIsCheckoutOpen(false)} className="p-2 bg-neutral-50 rounded-full"><X size={20} /></button>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center space-x-3">
                                            <img src={item.image} className="w-14 h-14 rounded-xl object-cover" alt="" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm truncate">{item.name}</h4>
                                                <p className="text-xs text-neutral-400">Rp {item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="flex items-center space-x-3 bg-neutral-50 border border-neutral-100 rounded-lg px-2 py-1">
                                                <button onClick={() => updateQty(item.id, -1)} className="text-neutral-400 p-1"><Minus size={12} /></button>
                                                <span className="font-bold text-xs">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="text-emerald-700 p-1"><Plus size={12} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-dashed border-neutral-200 py-4 space-y-2">
                                    <div className="flex justify-between text-xs text-neutral-500">
                                        <span>Subtotal</span>
                                        <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-neutral-500">
                                        <span>Biaya Pengiriman</span>
                                        <span>Rp 10.000</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-base pt-2">
                                        <span>Total Bayar</span>
                                        <span className="text-emerald-900">Rp {(cartTotal + 10000).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Metode Transfer Bank</p>
                                    <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                        <p className="text-xs text-neutral-500 mb-1">BCA - PureEats Jakarta</p>
                                        <p className="font-black text-emerald-900 text-sm tracking-widest">8830 1234 5678</p>
                                    </div>

                                    <div
                                        onClick={handleFileUpload}
                                        className="mt-4 border-2 border-dashed border-neutral-100 rounded-2xl p-6 flex flex-col items-center justify-center bg-neutral-50/50"
                                    >
                                        {uploadProgress === 100 ? (
                                            <div className="flex items-center space-x-2 text-emerald-600">
                                                <CheckCircle2 size={18} />
                                                <span className="text-xs font-bold">Bukti Terupload</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="text-neutral-300 mb-2" size={24} />
                                                <p className="text-[10px] font-bold text-neutral-400">UPLOAD BUKTI TRANSFER</p>
                                            </>
                                        )}

                                        {uploadProgress > 0 && uploadProgress < 100 && (
                                            <div className="w-full h-1 bg-neutral-200 rounded-full mt-3 overflow-hidden">
                                                <motion.div animate={{ width: `${uploadProgress}%` }} className="h-full bg-emerald-600" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    disabled={uploadProgress < 100}
                                    onClick={handleCheckout}
                                    className={`w-full mt-6 py-4 rounded-xl font-black text-sm transition-all ${uploadProgress === 100
                                        ? 'bg-emerald-900 text-white shadow-lg'
                                        : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                                        }`}
                                >
                                    KONFIRMASI PESANAN
                                </button>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default ModalChckoutStore