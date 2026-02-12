import React, { useState } from 'react';
import {
    Lock,
    Eye,
    EyeOff,
    Loader2,
    ArrowRight,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';

interface Errors {
    password: string;
    confirmPassword: string;
}

const NewPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<Errors | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: Errors = {
            password: "",
            confirmPassword: ""
        };

        if (formData.password.length < 8) {
            newErrors.password = "Kata sandi minimal 8 karakter";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Konfirmasi kata sandi tidak cocok";
        }

        // cek apakah ada error isi
        if (newErrors.password || newErrors.confirmPassword) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            setErrors(null);

            await authService.changePassword(
                {
                    password: formData.password
                },
                token ?? ''
            );

            setIsSuccess(true);

        } catch (err: any) {
            setErrors({
                password: "",
                confirmPassword: err?.message || "Gagal mengubah password",
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-white flex font-sans text-slate-900">
            {/* Sisi Kiri: Visual Branding (Hanya Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-50 relative items-center justify-center p-12 overflow-hidden border-r border-slate-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <div className="relative z-10 max-w-md text-center">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-[var(--primary-color)]">
                            <Lock size={40} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4">
                        Amankan Kembali <br />
                        <span className="text-[var(--primary-color)]">Akun Toko Anda</span>
                    </h2>
                    <p className="text-slate-500 font-medium mb-12">
                        Buat kata sandi baru yang kuat untuk melindungi data bisnis dan transaksi UMKM Anda.
                    </p>

                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-left">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle2 size={14} />
                                </div>
                                <p className="text-slate-600 text-xs font-bold">Gunakan minimal 8 karakter</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle2 size={14} />
                                </div>
                                <p className="text-slate-600 text-xs font-bold">Kombinasi huruf & angka</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle2 size={14} />
                                </div>
                                <p className="text-slate-600 text-xs font-bold">Simpan di tempat yang aman</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sisi Kanan: Form New Password */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20">
                <div className="w-full max-w-md lg:max-w-none">
                    {!isSuccess ? (
                        <>
                            <div className="mb-10 px-1 sm:px-0">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kata Sandi Baru</h1>
                                <p className="text-slate-500 mt-2 font-medium">Silakan buat kata sandi baru untuk akun Anda.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 px-1 sm:px-0">
                                {/* Kata Sandi Baru */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Kata Sandi Baru</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className={`w-full bg-slate-50 border-2 ${errors?.password ? 'border-rose-100 focus:ring-rose-500' : 'border-slate-50 focus:border-[var(--primary-color)]'} rounded-2xl py-4 pl-12 pr-12 text-sm font-semibold outline-none focus:bg-white transition-all`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors?.password && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors?.password}</p>}
                                </div>

                                {/* Konfirmasi Kata Sandi */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Konfirmasi Kata Sandi</label>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className={`w-full bg-slate-50 border-2 ${errors?.confirmPassword ? 'border-rose-100 focus:ring-rose-500' : 'border-slate-50 focus:border-[var(--primary-color)]'} rounded-2xl py-4 pl-12 pr-12 text-sm font-semibold outline-none focus:bg-white transition-all`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors?.confirmPassword && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors?.confirmPassword}</p>}
                                </div>

                                <div className="pt-2">
                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-[var(--primary-color)] text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-100 hover:bg-[var(--secondary-color)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} /> Memperbarui...
                                            </>
                                        ) : (
                                            <>
                                                Simpan Kata Sandi <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center px-1 sm:px-0 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Berhasil Diperbarui!</h1>
                            <p className="text-slate-500 font-medium mb-12">
                                Kata sandi Anda telah berhasil diubah. Sekarang Anda bisa masuk kembali ke dashboard menggunakan kata sandi yang baru.
                            </p>

                            <Link href="login" className="block w-full bg-[var(--primary-color)] text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-100 hover:bg-[var(--secondary-color)] transition-all text-center">
                                Masuk Sekarang
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewPassword;