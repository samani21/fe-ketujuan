import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Mail,
    Lock,
    ArrowRight,
    Zap,
    Loader2,
    Eye,
    EyeOff,
} from 'lucide-react';
import Link from 'next/link';
type RegisterForm = {
    password: string;
    identifier: string;
};

const LoginPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>();

    const onSubmit = (data: RegisterForm) => {
        setIsSubmitting(true);
        // Simulasi proses login
        setTimeout(() => {
            setIsSubmitting(false);
            console.log("Login data:", data);
            alert("Login Berhasil! Mengalihkan ke Dashboard...");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white flex font-sans text-slate-900">
            {/* Sisi Kiri: Visual & Testimonial (Hanya Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-50 relative items-center justify-center p-12 overflow-hidden border-r border-slate-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <div className="relative z-10 max-w-md text-center">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200 animate-pulse">
                            <Zap className="text-white w-10 h-10" fill="white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4">
                        Selamat Datang Kembali di <br />
                        <span className="text-emerald-600">Katujuan.net</span>
                    </h2>
                    <p className="text-slate-500 font-medium mb-12">
                        Kelola tokomu, pantau pesanan, dan tingkatkan penjualan UMKM-mu hari ini.
                    </p>

                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-left">
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <span key={s} className="text-emerald-500">★</span>
                            ))}
                        </div>
                        <p className="text-slate-600 font-medium italic text-sm leading-relaxed">
                            "Dashboard-nya sangat bersih dan mudah dipahami bahkan untuk orang awam seperti saya. Sangat membantu operasional harian toko!"
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                            <div>
                                <p className="text-slate-900 text-xs font-bold uppercase tracking-widest">Andi Wijaya</p>
                                <p className="text-slate-400 text-[10px] font-medium">Owner Kopi Hatta</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sisi Kanan: Form Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20">
                <div className="w-full">
                    {/* Back to Home / Logo Mobile */}
                    <div className="flex items-center justify-between mb-12">
                        {/* <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors text-sm font-bold">
                            <ChevronLeft size={18} /> Kembali
                        </button> */}
                        <div className="lg:hidden flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <Zap className="text-white w-5 h-5" fill="white" />
                            </div>
                            <span className="text-xl font-black text-emerald-950 tracking-tighter">Katujuan</span>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Masuk</h1>
                        <p className="text-slate-500 mt-2 font-medium">Akses dashboard toko online Anda.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Input Email / Phone */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Email atau No. WhatsApp</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                <input
                                    {...register("identifier", { required: "Email atau nomor WhatsApp wajib diisi" })}
                                    className={`w-full bg-slate-50 border-2 ${errors.identifier ? 'border-rose-100 focus:ring-rose-500' : 'border-slate-50 focus:border-emerald-600'} rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:bg-white transition-all`}
                                    placeholder="email@toko.com atau 0812..."
                                />
                            </div>
                            {errors.identifier && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.identifier.message}</p>}
                        </div>

                        {/* Input Password */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Kata Sandi</label>
                                <a href="#" className="text-[11px] font-bold text-emerald-700 hover:underline">Lupa Sandi?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", { required: "Kata sandi wajib diisi" })}
                                    className={`w-full bg-slate-50 border-2 ${errors.password ? 'border-rose-100 focus:ring-rose-500' : 'border-slate-50 focus:border-emerald-600'} rounded-2xl py-4 pl-12 pr-12 text-sm font-semibold outline-none focus:bg-white transition-all`}
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
                            {errors.password && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.password.message}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2 ml-1">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                            <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer">Ingat saya di perangkat ini</label>
                        </div>

                        <div className="pt-2">
                            <button
                                disabled={isSubmitting}
                                className="w-full bg-emerald-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Memverifikasi...
                                    </>
                                ) : (
                                    <>
                                        Masuk Sekarang <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                        <p className="text-sm font-semibold text-slate-500">
                            Belum punya toko? <Link href={'register'} className="text-emerald-700 font-black hover:underline">Daftar gratis di sini</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;