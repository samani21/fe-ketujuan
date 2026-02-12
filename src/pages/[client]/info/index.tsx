import LayoutStore from '@/Components/Layout/LayoutStore'
import { StoreData, storeService } from '@/services/storeService'
import { Clock, Globe, Mail, Phone, Store, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const InfoPage = () => {
    const [infoCleint, setInfoClient] = useState<StoreData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        getClient()
    }, [])

    const getClient = async () => {
        try {
            const result = await storeService.getStoreInfo();
            if (result.status === 'success') {
                setInfoClient(result.data as StoreData ?? null);
            }
        } catch (error) {
            console.error("Gagal memuat:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <LayoutStore>
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-[var(--primary-color, #3b82f6)] rounded-full animate-spin"></div>
                    <p className="animate-pulse text-slate-400 font-medium">Memuat informasi bisnis...</p>
                </div>
            </LayoutStore>
        );
    }

    return (
        <LayoutStore>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Profil Singkat */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[var(--primary-color)]"></div>
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                        <Store size={40} className="text-[var(--primary-color)]" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">{infoCleint?.name}</h2>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {infoCleint?.description ?? 'Informasi deskripsi bisnis belum ditambahkan.'}
                    </p>
                </div>

                {/* Statistik/Highlight */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[var(--primary-color)] rounded-3xl p-5 text-white shadow-lg shadow-blue-900/20">
                        <Globe className="mb-2 text-blue-500" size={24} />
                        <h4 className="text-lg font-bold">{infoCleint?.subdomain}</h4>
                        <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Subdomain</p>
                    </div>
                    <div className="bg-white rounded-3xl p-5 text-slate-800 border border-slate-100 shadow-sm">
                        <Users className="mb-2 text-[var(--primary-color)]" size={24} />
                        <h4 className="text-lg font-bold">{infoCleint?.outlets?.length}</h4>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Mitra Outlet</p>
                    </div>
                </div>

                {/* Media Sosial & Kontak */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-[var(--primary-color)]" /> Hubungi Kami
                    </h3>
                    <div className="space-y-3">
                        {/* <a href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors group">
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
                        </a> */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-[var(--primary-color)] rounded-lg">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block leading-none mb-1 font-bold uppercase tracking-tighter">Customer Service</span>
                                    <span className="text-sm font-bold text-slate-700">{infoCleint?.telp}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-[var(--primary-color)] rounded-lg">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block leading-none mb-1 font-bold uppercase tracking-tighter">Customer Service</span>
                                    <span className="text-sm font-bold text-slate-700">{infoCleint?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jam Operasional Pusat */}
                {
                    infoCleint?.business_hour && infoCleint?.business_hour?.length > 0 &&
                    <div className="bg-blue-50 rounded-[2.5rem] p-6 border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <Clock size={18} className="text-[var(--primary-color)]" /> Jam Layanan Pusat
                        </h3>

                        <div className="space-y-2">
                            {
                                infoCleint?.business_hour?.map((bh, i) => (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-[var(--primary-color)] font-medium">{bh?.day_start} - {bh?.day_end}</span>
                                        <span className="font-bold text-blue-900">{bh?.open_time} - {bh?.close_time}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }


            </div>
        </LayoutStore>
    )
}

export default InfoPage