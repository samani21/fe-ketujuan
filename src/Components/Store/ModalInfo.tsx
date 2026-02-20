import { AlertCircle, ArrowRight, LogIn, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
type Props = {
    isOpen: boolean;
    onClose: () => void;
}
const ModalInfo = ({ isOpen, onClose }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay dengan backdrop blur */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Card Modal */}
            <div className="relative w-full max-w-md overflow-hidden bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Decorative Header */}
                <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500 w-full" />

                <button
                    onClick={onClose}
                    className="absolute right-4 top-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                <div className="p-8 flex flex-col items-center text-center">
                    {/* Icon Section */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-amber-100 rounded-full scale-150 blur-xl opacity-50" />
                        <div className="relative p-4 bg-amber-50 rounded-full border-4 border-white shadow-sm">
                            <AlertCircle className="w-10 h-10 text-amber-600" />
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        Ups! Anda Belum Login
                    </h3>

                    <p className="text-slate-600 leading-relaxed mb-8">
                        Maaf, Anda tidak bisa memesan item ini karena status akun Anda saat ini sedang logout.
                        Silakan masuk untuk melanjutkan transaksi aman Anda.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col w-full gap-3">
                        <Link href={'/auth/login'}
                            className="group flex items-center justify-center gap-2 w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                        >
                            <LogIn size={20} />
                            Login Sekarang
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <button
                            onClick={onClose}
                            className="w-full py-4 px-6 text-slate-500 font-semibold hover:text-slate-800 transition-colors"
                        >
                            Kembali Jelajahi Item
                        </button>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck size={14} />
                    Transaksi Anda dilindungi dengan enkripsi end-to-end
                </div>
            </div>
        </div>
    );
};

export default ModalInfo;