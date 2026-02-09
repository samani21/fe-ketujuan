import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next'; // --- WAJIB IMPORT INI ---
import { Mail, MessageCircle, Phone, Send, User, Loader2, ChevronRight } from 'lucide-react';
import LayoutStore from '@/Components/Layout/LayoutStore';
import { storeService, StoreData } from '@/services/storeService';

interface ContactPageProps {
  subdomain: string;
}

type BasicStoreInfo = Partial<StoreData>;

const ContactPage = ({ subdomain }: ContactPageProps) => {
    const [storeData, setStoreData] = useState<BasicStoreInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        // Pipa data sekarang sudah tersambung karena subdomain diambil dari getServerSideProps
        if (!subdomain) return;

        const fetchInfo = async () => {
            try {
                setLoading(true);
                const result = await storeService.getBasicInfo();
                if (result.status === 'success' && result.data) {
                    setStoreData(result.data);
                }
            } catch (error) {
                console.error("Gagal memuat info brand:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, [subdomain]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const payload = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
        };

        try {
            const result = await storeService.sendMessage(payload);
            if (result.status === 'success') {
                setFormSubmitted(true);
                form.reset();
                setTimeout(() => setFormSubmitted(false), 5000);
            }
        } catch (error) {
            console.error("Gagal kirim:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-blue-900" size={32} />
        </div>
    );

    const waNumber = storeData?.telp?.replace(/\D/g, '') || '';

    return (
        <LayoutStore 
            storeData={storeData as StoreData} 
            userLocationName="Banjarmasin"
        >
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center px-4">
                    <h3 className="font-black text-2xl text-slate-800 tracking-tight">Hubungi Kami</h3>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                        Kirimkan pertanyaan atau saran Anda
                    </p>
                </div>

                {/* --- Form Kontak --- */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                    {formSubmitted ? (
                        <div className="py-12 text-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send size={30} />
                            </div>
                            <h4 className="font-black text-slate-800 uppercase tracking-tight">Pesan Terkirim!</h4>
                            <p className="text-xs text-slate-500 mt-1">Terima kasih atas masukan Anda.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-950 transition-colors" size={16} />
                                    <input name="name" required type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-900/10 outline-none transition-all" placeholder="Masukkan nama Anda" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-950 transition-colors" size={16} />
                                    <input name="email" required type="email" className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-900/10 outline-none transition-all" placeholder="kamu@email.com" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pesan / Masukan</label>
                                <textarea name="message" required className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-900/10 outline-none min-h-[120px] transition-all" placeholder="Tuliskan pesan Anda di sini..."></textarea>
                            </div>

                            <button disabled={submitting} type="submit" className="w-full bg-blue-950 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em] disabled:bg-slate-300">
                                {submitting ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Kirim Pesan</>}
                            </button>
                        </form>
                    )}
                </div>

                {/* --- Kontak Alternatif (GRID UTUH) --- */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Kartu WhatsApp Bisnis */}
                    <a 
                        href={`https://wa.me/${waNumber}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="relative bg-gradient-to-br from-emerald-50 to-white p-6 rounded-[2.5rem] flex items-center justify-between border border-emerald-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 group transition-all duration-500 active:scale-[0.98]"
                    >
                        {/* Indikator Status Online (Glow Effect) */}
                        <div className="absolute top-6 right-8 flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                Online
                            </span>
                        </div>

                        <div className="flex items-center gap-5">
                            {/* Container Icon dengan Double Border */}
                            <div className="relative w-14 h-14 bg-white rounded-[1.25rem] flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50 group-hover:rotate-[10deg] transition-all duration-500">
                                <MessageCircle size={28} className="group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-black text-emerald-950 text-base uppercase tracking-tight leading-none">
                                    WhatsApp Bisnis
                                </h4>
                                <div className="flex items-center gap-2 mt-2">
                                    
                                    <p className="text-[10px] text-emerald-600/60 font-bold uppercase tracking-widest">
                                        Kemitraan & Keluhan
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ikon Panah yang muncul saat Hover */}
                        <div className="bg-emerald-500 p-2.5 rounded-2xl text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 shadow-lg shadow-emerald-200">
                            <ChevronRight size={20} strokeWidth={3} />
                        </div>
                    </a>

                    {/* Kartu Telepon Kantor (KEMBALI ADA) */}
                    <div className="bg-white p-6 rounded-[2rem] flex items-center gap-4 border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Telepon Kantor</h4>
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest">{storeData?.telp || '(0511) 1234 567'}</p>
                        </div>
                    </div>
                </div>

                <div className="pb-10"></div>
            </div>
        </LayoutStore>
    );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    // Ambil variabel [client] dari URL
    const { client } = context.params as { client: string };

    return {
        props: {
            subdomain: client, // Ini yang masuk ke function ContactPage di atas
        },
    };
};

export default ContactPage;