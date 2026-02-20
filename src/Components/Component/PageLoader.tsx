import { Loader2 } from 'lucide-react';
import React from 'react'

type Props = {}

const PageLoader = () => {
    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                {/* Logo Animation */}
                {/* <div className="w-16 h-16 bg-[#1A2D5E] rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-900/20 animate-bounce">
                    B
                </div> */}
                <div className="mt-8 flex flex-col items-center">
                    {/* <h2 className="text-xl font-bold text-[#1A2D5E] tracking-tight">BRAND<span className="font-normal text-slate-400">ADMIN</span></h2> */}
                    <div className="mt-4 flex items-center gap-2">
                        <Loader2 className="animate-spin text-blue-600" size={16} />
                        <span className="text-sm font-medium text-slate-400 tracking-wide uppercase">Memuat Halaman...</span>
                    </div>
                </div>
            </div>
            {/* Background Decorative Elements */}
            <div className="absolute bottom-10 text-slate-300 text-[10px] font-bold tracking-[0.2em] uppercase">
                Powered by Katujuan.net
            </div>
        </div>
    );
};


export default PageLoader