import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    User,
    Phone,
    Store,
    Globe,
    ArrowRight,
    CheckCircle2,
    Loader2,
    Mail,
    Lock
} from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { ApiResponse } from '@/types/api';
import api from '@/utils/api';
import { appConfig } from '@/config/appConfig';

type RegisterForm = {
    fullName: string;
    email: string;
    password: string;
    storeName: string;
    whatsapp: string;
};

const RegisterPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subdomain, setSubdomain] = useState('');
    const [serverError, setServerError] = useState('');

    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    // Gunakan useEffect untuk memantau perubahan subdomain
    useEffect(() => {
        if (subdomain.length < 3) {
            setIsAvailable(null);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsChecking(true);
            try {
                const response = await api.get(`/check-subdomain?name=${subdomain}`);
                setIsAvailable(response.data.available);
            } catch (error) {
                setIsAvailable(false);
            } finally {
                setIsChecking(false);
            }
        }, 500); // Tunggu 500ms setelah ketikan terakhir

        return () => clearTimeout(delayDebounceFn);
    }, [subdomain]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>();

    const onSubmit = async (data: RegisterForm) => {
        setIsSubmitting(true);
        setServerError('');

        try {
            const response = await authService.register({ ...data, subdomain });
            // Berhasil (status 200)
            console.log('response', response)
            // --- REDIRECT DINAMIS ---
            const redirectUrl = appConfig.getTenantUrl(subdomain, '');
            window.location.href = redirectUrl;
        } catch (err: unknown) {
            // Karena kita sudah melempar ApiResponse di catch authService:
            const errorData = err as ApiResponse;
            setServerError(errorData.message || "Pendaftaran gagal.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        setSubdomain(value);
    };

    return (
        <div className="min-h-screen bg-white flex font-sans text-slate-900">
            {/* --- SISI KIRI: Visual & Branding (Rich Content) --- */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-200 relative items-center justify-center p-12 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10 max-w-md">
                    <div className="flex items-center gap-2 mb-12">
                        <img src={'/katujuan.png'} className='w-52' alt="Katujuan Logo" />
                    </div>

                    <h2 className="text-4xl font-black text-black leading-tight mb-6">
                        Kami Bantu Jualan<br />
                        <span className="text-[var(--primary-color)] text-5xl">dengan Internet</span>
                    </h2>

                    <div className="space-y-6 mb-16">
                        {[
                            "Gratis selamanya untuk fitur dasar",
                            "Tanpa perlu kartu kredit",
                            "Toko langsung aktif dalam 1 menit",
                            "Dukungan Tim 24/7"
                        ].map((text, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-[var(--primary-color)] font-medium">
                                <CheckCircle2 size={20} className="text-emerald-500" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 bg-blue-800/10 backdrop-blur-sm rounded-[2rem] border border-white/10">
                        <p className="text-[var(--primary-color)] italic text-sm leading-relaxed">
                            {"Awalnya antrian kedai saya membludak, setelah pakai Katujuan pelanggan saya bisa pesan duluan dan datang setelah pesanan hampir selesai."}
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-900 rounded-full"></div>
                            <div>
                                <p className="text-black text-xs font-bold uppercase tracking-widest">Siti Yasmin</p>
                                <p className="text-slate-500 text-[10px] font-medium">Owner Kedai Yasmin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SISI KANAN: Form Registrasi (Integrated) --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-12 lg:p-20">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <img src={'/katujuan.png'} className='w-32' alt="Logo" />
                    </div>

                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daftar Sekarang</h1>
                        <p className="text-slate-500 mt-2 font-medium">Lengkapi data usaha Anda untuk memulai.</p>
                    </div>

                    {/* Alert Server Error */}
                    {serverError && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl">
                            ⚠️ {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Nama Lengkap */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                                <input
                                    {...register("fullName", { required: "Nama wajib diisi" })}
                                    className={`w-full bg-slate-50 border-2 ${errors.fullName ? 'border-rose-100' : 'border-slate-50 focus:border-[var(--primary-color)]'} rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:bg-white transition-all`}
                                    placeholder="Contoh: Budi Santoso"
                                />
                            </div>
                            {errors.fullName && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.fullName.message}</p>}
                        </div>

                        {/* WhatsApp */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                                <input
                                    {...register("whatsapp", { required: "Nomor wajib diisi" })}
                                    className={`w-full bg-slate-50 border-2 ${errors.whatsapp ? 'border-rose-100' : 'border-slate-50 focus:border-[var(--primary-color)]'} rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:bg-white transition-all`}
                                    placeholder="081234567xxx"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                                <input
                                    {...register("email", { required: "Email wajib diisi" })}
                                    type="email"
                                    className={`w-full bg-slate-50 border-2 ${errors.email ? 'border-rose-100' : 'border-slate-50 focus:border-[var(--primary-color)]'} rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:bg-white transition-all`}
                                    placeholder="email@toko.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Kata Sandi</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                                <input
                                    {...register("password", { required: "Sandi wajib diisi", minLength: { value: 6, message: "Minimal 6 karakter" } })}
                                    type="password"
                                    className={`w-full bg-slate-50 border-2 ${errors.password ? 'border-rose-100' : 'border-slate-50 focus:border-[var(--primary-color)]'} rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:bg-white transition-all`}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Nama Usaha */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Usaha</label>
                            <div className="relative group">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                                <input
                                    {...register("storeName", { required: "Nama usaha wajib diisi" })}
                                    onChange={(e) => {
                                        register("storeName").onChange(e);
                                        handleSubdomainChange(e);
                                    }}
                                    className={`w-full bg-slate-50 border-2 ${errors.storeName ? 'border-rose-100' : 'border-slate-50 focus:border-[var(--primary-color)]'} rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:bg-white transition-all`}
                                    placeholder="Contoh: Kopi Janji Hati"
                                />
                            </div>
                        </div>

                        {/* Subdomain URL */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                URL Toko (Subdomain)
                            </label>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                                <input
                                    value={subdomain}
                                    onChange={handleSubdomainChange}
                                    className={`w-full bg-slate-50 border-2 rounded-2xl py-4 pl-12 pr-28 text-sm font-bold text-[var(--primary-color)] outline-none transition-all 
                                        ${isAvailable === true ? 'border-emerald-100 focus:border-emerald-500' : ''} 
                                        ${isAvailable === false ? 'border-rose-100 focus:border-rose-500' : ''} 
                                        ${isAvailable === null ? 'border-slate-50 focus:border-[var(--primary-color)]' : ''}`}
                                    placeholder="nama-toko"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    {isChecking && <Loader2 className="animate-spin text-slate-400" size={14} />}
                                    <span className="text-[11px] font-black text-slate-400">.katujuan.net</span>
                                </div>
                            </div>

                            {/* --- PESAN FEEDBACK (Real-time) --- */}
                            <div className="min-h-[20px] ml-1">
                                {subdomain.length > 0 && subdomain.length < 3 && (
                                    <p className="text-[10px] text-slate-400 font-bold italic">Minimal 3 karakter...</p>
                                )}
                                {isAvailable === true && !isChecking && (
                                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Subdomain tersedia!
                                    </p>
                                )}
                                {isAvailable === false && !isChecking && (
                                    <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                                        ⚠️ Subdomain ini sudah digunakan, coba nama lain.
                                    </p>
                                )}
                            </div>

                            {/* Preview Card */}
                            <div className={`p-4 rounded-2xl border transition-all ${isAvailable === false ? 'opacity-50 grayscale' : 'bg-blue-50 border-blue-100'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-[var(--primary-color)]"><Globe size={14} /></div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-bold text-blue-900/40 uppercase tracking-tighter">Preview URL Toko Anda:</p>
                                        <p className="text-xs font-black text-[var(--primary-color)] truncate">
                                            https://<span className={`${isAvailable === false ? 'text-rose-500' : 'text-blue-950'} underline decoration-blue-300 decoration-2 underline-offset-2`}>{subdomain || 'toko-anda'}</span>.katujuan.net
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !subdomain}
                                className="w-full bg-[var(--primary-color)] text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-100 hover:bg-blue-900 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Memproses...</> : <>Buat Toko Sekarang <ArrowRight size={20} /></>}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                        <p className="text-sm font-semibold text-slate-500">
                            Sudah punya akun? <Link href="/login" className="text-[var(--primary-color)] font-black hover:underline">Masuk di sini</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;