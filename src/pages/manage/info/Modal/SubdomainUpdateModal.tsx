import React, { useState, useEffect } from 'react';
import { LogOut, AlertTriangle, X, RefreshCw } from 'lucide-react';
type Props = {
    isOpen: boolean
    setIsOpen: (val: boolean) => void;
}
const SubdomainUpdateModal = ({ isOpen, setIsOpen }: Props) => {

    // Munculkan modal otomatis saat komponen dimuat (simulasi logika pengecekan)
    useEffect(() => {
        // Anda bisa menambahkan logika pengecekan di sini, 
        // misalnya mengecek localStorage atau parameter URL
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        // Tambahkan logika logout Anda di sini
        // Contoh: window.location.href = '/api/auth/logout';
        setIsOpen(false);
        window.location.href = '/auth/login'
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="relative w-full max-w-md bg-white  rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-300"
                role="dialog"
                aria-modal="true"
            >
                {/* Header Decor */}
                <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500" />

                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="flex flex-col items-center text-center">
                        {/* Icon Container */}
                        <div className="mb-6 p-4 bg-amber-50  rounded-full text-amber-500">
                            <AlertTriangle size={48} strokeWidth={1.5} />
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900  mb-3">
                            Pembaruan Subdomain
                        </h2>

                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Kami mendeteksi perubahan pada alamat subdomain Anda. Untuk memastikan keamanan dan sinkronisasi data yang akurat, harap <span className="font-semibold text-slate-900 ">Logout</span> terlebih dahulu sebelum melakukan update data lainnya.
                        </p>

                        <div className="flex flex-col w-full gap-3">
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-slate-900  text-white  font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                            >
                                <LogOut size={18} />
                                Logout Sekarang
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="px-8 py-4 bg-slate-50  border-t border-slate-100  flex items-center justify-center gap-2 text-xs text-slate-500">
                    <RefreshCw size={12} className="animate-spin-slow" />
                    <span>Update sesi diperlukan untuk menghindari error data.</span>
                </div>
            </div>
        </div>
    );
};

// Tambahkan animasi kustom di tailwind.config.js jika diperlukan, 
// atau gunakan class Tailwind standar seperti di atas.

export default SubdomainUpdateModal;