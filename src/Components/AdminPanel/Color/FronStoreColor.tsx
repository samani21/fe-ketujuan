import LayoutStore from '@/Components/Layout/LayoutStore'
import { StoreData } from '@/services/storeService'
import { Get } from '@/utils/apiWithToken'
import { ChevronRight, Clock, MapPin, Navigation, Store } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props = {
    infoStore: StoreData | null;
}

const FronStoreColor = ({ infoStore }: Props) => {
    return (
        <LayoutStore isPreview={true} storeData={infoStore}>
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex flex-col">
                    <h3 className="font-black text-slate-800 tracking-tight text-lg">Daftar Outlet Terdekat</h3>
                    <div className="h-1 w-6 bg-[var(--primary-color)] rounded-full mt-1"></div>
                </div>
                <span className="text-[10px] bg-[var(--primary-color)]/5 text-[var(--primary-color)] px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
                    {infoStore?.outlets?.length} Lokasi
                </span>
            </div>
            <div>
                {
                    infoStore?.outlets?.map((outlet) => (
                        <div key={outlet.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-[var(--primary-color)] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                                        <Store size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[var(--primary-color)] text-sm uppercase leading-tight">{outlet.name}</h4>
                                        <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed max-w-[200px]">{outlet.address}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </div>

                            <div className="flex items-center gap-6 mb-6 ml-16">
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={12} className="text-slate-400" />
                                    <p className="text-[10px] font-bold text-slate-500 tracking-tight">
                                        {/* MENAMPILKAN JARAK DARI BACKEND */}
                                        -- Km
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={12} className={outlet.is_open ? "text-emerald-500" : "text-rose-500"} />
                                    <p className="text-[10px] font-bold text-slate-500">
                                        <span className={outlet.is_open ? "text-emerald-600" : "text-rose-600"}>
                                            {outlet.is_open ? "Buka" : "Tutup"}
                                        </span>
                                        {outlet.is_open && ` • s/d ${outlet.open_until}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Navigation size={14} /> Navigasi
                                </button>
                                <button
                                    className="flex-[1.5] py-4 bg-[var(--primary-color)] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-100"
                                >
                                    Pesan Sekarang
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </LayoutStore>
    )
}

export default FronStoreColor