import { Mail, MessageCircle, Phone, Send, User } from 'lucide-react';
import React, { useState } from 'react'
import LayoutStore from '../Layout/LayoutStore';


const ContactPage = () => {
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const handleSumbit = (e: any) => {
        e.preventDefault();
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 3000);
    };

    return (
        <LayoutStore>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center px-4">
                    <h3 className="font-extrabold text-2xl text-slate-800 tracking-tight">Hubungi Kami</h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">Kami siap mendengarkan saran dan pertanyaan Anda</p>
                </div>

                {/* Form Kontak */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                    {formSubmitted ? (
                        <div className="py-12 text-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send size={30} />
                            </div>
                            <h4 className="font-bold text-slate-800">Pesan Terkirim!</h4>
                            <p className="text-xs text-slate-500 mt-1">Terima kasih atas masukan Anda.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSumbit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nama Lengkap</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input required type="text" className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-emerald-800 transition-all outline-none" placeholder="Masukkan nama Anda" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Alamat Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input required type="email" className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-emerald-800 transition-all outline-none" placeholder="email@contoh.com" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Pesan / Masukan</label>
                                <textarea required className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-emerald-800 transition-all outline-none min-h-[120px]" placeholder="Tuliskan pesan Anda di sini..."></textarea>
                            </div>

                            <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                <Send size={18} /> Kirim Pesan
                            </button>
                        </form>
                    )}
                </div>

                {/* Kontak Alternatif */}
                <div className="grid grid-cols-1 gap-4">
                    <a href="https://wa.me/628125555xxxx" className="bg-emerald-50 p-5 rounded-3xl flex items-center gap-4 border border-emerald-100 group transition-all">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                            <MessageCircle size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-emerald-900 text-sm italic">WhatsApp Bisnis</h4>
                            <p className="text-[10px] text-emerald-700/70">Respon cepat untuk kemitraan & keluhan</p>
                        </div>
                    </a>

                    <div className="bg-white p-5 rounded-3xl flex items-center gap-4 border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Telepon Kantor</h4>
                            <p className="text-[10px] text-slate-500">(0511) 1234 567</p>
                        </div>
                    </div>
                </div>

                <div className="pb-10"></div>
            </div>
        </LayoutStore>
    );
}

export default ContactPage