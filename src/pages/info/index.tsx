import { Award, ChevronRight, Clock, Facebook, Globe, Instagram, Phone, Store, Users } from 'lucide-react'
import React from 'react'
import LayoutStore from '../Layout/LayoutStore'

const InfoPage = () => {
    return (
        <LayoutStore>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Profil Singkat */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[var(--primary-color)]"></div>
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                        <Store size={40} className="text-[var(--primary-color)]" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">PURE EATS</h2>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Pelopor minuman cokelat artisan dengan cita rasa khas yang menghangatkan hati sejak pertama kali berdiri.
                    </p>
                </div>

                {/* Statistik/Highlight */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[var(--primary-color)] rounded-3xl p-5 text-white shadow-lg shadow-blue-900/20">
                        <Award className="mb-2 text-blue-300" size={24} />
                        <h4 className="text-lg font-bold">100%</h4>
                        <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Cokelat Asli</p>
                    </div>
                    <div className="bg-white rounded-3xl p-5 text-slate-800 border border-slate-100 shadow-sm">
                        <Users className="mb-2 text-[var(--primary-color)]" size={24} />
                        <h4 className="text-lg font-bold">50+</h4>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Mitra Outlet</p>
                    </div>
                </div>

                {/* Media Sosial & Kontak */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-[var(--primary-color)]" /> Hubungi Kami
                    </h3>
                    <div className="space-y-3">
                        <a href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-100 text-pink-600 rounded-lg group-hover:bg-white transition-colors">
                                    <Instagram size={20} />
                                </div>
                                <span className="text-sm font-bold text-slate-700">@pureeats</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                        </a>
                        <a href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-white transition-colors">
                                    <Facebook size={20} />
                                </div>
                                <span className="text-sm font-bold text-slate-700">PURE EATS Pusat</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                        </a>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-[var(--primary-color)] rounded-lg">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block leading-none mb-1 font-bold uppercase tracking-tighter">Customer Service</span>
                                    <span className="text-sm font-bold text-slate-700">0812-5555-xxxx</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jam Operasional Pusat */}
                <div className="bg-blue-50 rounded-[2.5rem] p-6 border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-[var(--primary-color)]" /> Jam Layanan Pusat
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-[var(--primary-color)] font-medium">Senin - Jumat</span>
                            <span className="font-bold text-blue-900">09:00 - 21:00</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-[var(--primary-color)] font-medium">Sabtu - Minggu</span>
                            <span className="font-bold text-blue-900">10:00 - 22:00</span>
                        </div>
                    </div>
                </div>

                <div className="text-center pb-8">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Versi 2.4.0 • Made with Love</p>
                </div>
            </div>
        </LayoutStore>
    )
}

export default InfoPage