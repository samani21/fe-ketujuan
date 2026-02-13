import { authService } from '@/services/authService';
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Loader2, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'

const ResetPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue) {
            setError("Email atau nomor WhatsApp wajib diisi");
            return;
        }
        try {
            setIsSubmitting(true)
            const response = await authService.resetPassowrd({
                email: inputValue
            });
            // Simulasi API call
            setIsSubmitting(false);
            setIsSubmitted(true);

        } catch (err: unknown) {
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-white flex font-sans text-slate-900">
            {/* Sisi Kiri: Visual & Security Branding (Hanya Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-50 relative items-center justify-center p-12 overflow-hidden border-r border-slate-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <div className="relative z-10 max-w-md text-center">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-[#1A2D5E]">
                            <ShieldCheck size={40} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4">
                        Keamanan Akun <br />
                        <span className="text-[#1A2D5E]">Prioritas Kami</span>
                    </h2>
                    <p className="text-slate-500 font-medium mb-12">
                        Jangan khawatir, kami akan membantu Anda memulihkan akses ke dashboard Katujuan.net dengan aman.
                    </p>

                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-left">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1A2D5E] shrink-0">
                                <KeyRound size={20} />
                            </div>
                            <div>
                                <p className="text-slate-900 font-bold text-sm mb-1">Tips Keamanan</p>
                                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                                    Pastikan Anda menggunakan kata sandi yang unik dan jangan pernah membagikan kode verifikasi kepada siapapun, termasuk pihak Katujuan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sisi Kanan: Form Reset Password */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20">
                <div className="w-full max-w-md lg:max-w-none">
                    {/* Logo Mobile */}
                    <div className="lg:hidden flex items-center gap-2 mt-[-60px] mb-12">
                        <div className="w-10 h-10 bg-[#1A2D5E] rounded-xl flex items-center justify-center text-white font-bold">K</div>
                        <span className="font-black text-xl tracking-tight">Katujuan.net</span>
                    </div>

                    <Link href="login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#1A2D5E] transition-colors mb-8 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Login
                    </Link>

                    {!isSubmitted ? (
                        <>
                            <div className="mb-10 px-1 sm:px-0">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Lupa Sandi?</h1>
                                <p className="text-slate-500 mt-2 font-medium">Masukkan email yang terdaftar untuk menerima instruksi pemulihan.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 px-1 sm:px-0">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1A2D5E] transition-colors" size={18} />
                                        <input
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            className={`w-full bg-slate-50 border-2 ${error ? 'border-rose-100 focus:ring-rose-500' : 'border-slate-50 focus:border-[#1A2D5E]'} rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:bg-white transition-all`}
                                            placeholder="email@toko.com"
                                        />
                                    </div>
                                    {error && <p className="text-[10px] text-rose-500 font-bold ml-1">{error}</p>}
                                </div>

                                <div className="pt-2">
                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-[#1A2D5E] text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-100 hover:bg-[var(--secondary-color)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} /> Memproses...
                                            </>
                                        ) : (
                                            <>
                                                Kirim Instruksi <ArrowRight size={20} />
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
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Cek Kotak Masuk Anda</h1>
                            <p className="text-slate-500 font-medium mb-8">
                                Kami telah mengirimkan instruksi pemulihan ke <br />
                                <span className="text-slate-900 font-bold">{inputValue}</span>. <br />
                                Silakan ikuti tautan di dalamnya untuk mengatur ulang kata sandi.
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="w-full bg-slate-50 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-100 transition-colors"
                                >
                                    Kembali
                                </button>
                                <p className="text-sm font-semibold text-slate-400">
                                    Tidak menerima pesan? <button className="text-[#1A2D5E] font-black hover:underline">Kirim ulang</button>
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-10 pt-10 border-t border-slate-100 text-center px-1 sm:px-0">
                        <p className="text-sm font-semibold text-slate-500">
                            Butuh bantuan lebih lanjut? <Link href="#" className="text-[#1A2D5E] font-black hover:underline">Hubungi Support</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword