import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    User,
    Phone,
    Store,
    Globe,
    ArrowRight,
    CheckCircle2,
    Zap,
    Loader2
} from 'lucide-react';
import Link from 'next/link';


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

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterForm>();

    // Memantau input Nama Usaha untuk preview otomatis
    // const watchStoreName = watch("storeName", "");

    const onSubmit = (data: RegisterForm) => {
        setIsSubmitting(true);
        // Simulasi proses registrasi
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Pendaftaran Berhasil! Mengalihkan ke Dashboard...");
        }, 2000);
    };

    // Fungsi untuk memformat nama usaha menjadi slug subdomain
    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        setSubdomain(value);
    };

    return (
        <div className="min-h-screen bg-white flex font-sans text-slate-900">
            {/* Sisi Kiri: Ilustrasi & Branding (Hanya Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-200 relative items-center justify-center p-12 overflow-hidden">
                {/* Dekorasi Latar Belakang */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10 max-w-md">
                    <div className="flex items-center gap-2 mb-12">
                        <img src={'/ketujuan.png'} className='w-52' />
                    </div>

                    <h2 className="text-4xl font-black text-black leading-tight mb-6">
                        Langkah Terakhir Menuju <br />
                        <span className="text-[var(--primary-color)] text-5xl">Bisnis Digital.</span>
                    </h2>

                    <div className="space-y-6">
                        {[
                            "Gratis selamanya untuk fitur dasar",
                            "Tanpa perlu kartu kredit",
                            "Toko langsung aktif dalam 1 menit",
                            "Dukungan WhatsApp 24/7"
                        ].map((text, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-[var(--primary-color)] font-medium">
                                <CheckCircle2 size={20} className="text-[var(--secondary-color)]" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-8 bg-blue-800/10 backdrop-blur-sm rounded-[2rem] border border-white/10">
                        <p className="text-[var(--primary-color)] italic text-sm leading-relaxed">
                            "Awalnya ragu buat jualan online karena gaptek, tapi pakai Katujuan ternyata gampang banget. Orderan masuk langsung ke WA!"
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-900 rounded-full"></div>
                            <div>
                                <p className="text-black text-xs font-bold uppercase tracking-widest">Siti Khadijah</p>
                                <p className="text-[var(--accent-color)] text-[10px] font-medium">Owner Toko Berkah</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sisi Kanan: Form Registrasi */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-12 lg:p-20">
                <div className="w-full">
                    {/* Header Mobile */}
                    <div className="lg:hidden flex items-center gap-2 mt-[-10px]">
                        <img src={'/ketujuan.png'} className='w-32' />
                    </div>


                    <div className="mb-10 px-1 ms:px-0">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daftar Sekarang</h1>
                        <p className="text-slate-500 mt-2 font-medium">Lengkapi data usaha Anda untuk memulai.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-1 ms:px-0">
                        {/* Input Nama */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Nama Lengkap</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                                <input
                                    {...register("fullName", { required: "Nama wajib diisi" })}
                                    className={`w-full bg-slate-50 border-2 ${errors.fullName ? 'border-rose-100 focus:ring-rose-500' : 'border-slate-50 focus:border-[var(--primary-color)]'} rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:bg-white transition-all`}
                                    placeholder="Contoh: Budi Santoso"
                                />
                            </div>
                            {errors.fullName?.message && <p className="text-[10px] text-rose-500 font-bold ml-1">{String(errors.fullName.message)}</p>}
                        </div>

                        {/* Input WhatsApp */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Nomor WhatsApp</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                                <input
                                    {...register("whatsapp", {
                                        required: "WhatsApp wajib diisi",
                                        pattern: { value: /^[0-9]+$/, message: "Gunakan format angka saja" }
                                    })}
                                    className={`w-full bg-slate-50 border-2 ${errors.whatsapp ? 'border-rose-100 focus:ring-rose-500' : 'border-slate-50 focus:border-[var(--primary-color)]'} rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:bg-white transition-all`}
                                    placeholder="081234567xxx"
                                />
                            </div>
                            {errors.whatsapp && <p className="text-[10px] text-rose-500 font-bold ml-1">{String(errors.whatsapp.message)}</p>}
                        </div>

                        {/* Input Nama Usaha */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Nama Usaha</label>
                            <div className="relative group">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                                <input
                                    {...register("storeName", { required: "Nama usaha wajib diisi" })}
                                    onChange={(e) => {
                                        register("storeName").onChange(e);
                                        handleSubdomainChange(e);
                                    }}
                                    className={`w-full bg-slate-50 border-2 ${errors.storeName ? 'border-rose-100 focus:ring-rose-500' : 'border-slate-50 focus:border-[var(--primary-color)]'} rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:bg-white transition-all`}
                                    placeholder="Contoh: Kopi Janji Hati"
                                />
                            </div>
                            {errors.storeName && <p className="text-[10px] text-rose-500 font-bold ml-1">{String(errors.storeName.message)}</p>}
                        </div>

                        {/* Input URL Toko (Subdomain) */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Alamat URL Toko (Subdomain)</label>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                                <input
                                    value={subdomain}
                                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-28 text-sm font-bold text-[var(--primary-color)] outline-none focus:bg-white focus:border-[var(--primary-color)] transition-all"
                                    placeholder="nama-toko"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400 uppercase">
                                    .katujuan.net
                                </span>
                            </div>

                            {/* Preview Real-time */}
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <Globe size={14} className="text-[var(--primary-color)]" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-bold text-blue-900/40 uppercase tracking-tighter">Preview URL Toko Anda:</p>
                                    <p className="text-xs font-black text-[var(--primary-color)] truncate">
                                        https://<span className="text-blue-950 underline decoration-blue-300 decoration-2 underline-offset-2">{subdomain || 'toko-anda'}</span>.katujuan.net
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                disabled={isSubmitting}
                                className="w-full bg-[var(--primary-color)] text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-100 hover:bg-[var(--primary-color)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Memproses...
                                    </>
                                ) : (
                                    <>
                                        Buat Toko Sekarang <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-center text-[10px] text-slate-400 font-medium">
                            Dengan mendaftar, Anda menyetujui <a href="#" className="underline font-bold text-slate-500">Syarat & Ketentuan</a> serta <a href="#" className="underline font-bold text-slate-500">Kebijakan Privasi</a> Katujuan.net
                        </p>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-100 text-center px-1 ms:px-0">
                        <p className="text-sm font-semibold text-slate-500">
                            Sudah punya akun? <Link href="login" className="text-[var(--primary-color)] font-black hover:underline">Masuk di sini</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;