import { Filter, Plus, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props = {
    title: string;
    subtitle?: string;
    setModalType: (val: string) => void;
    debouncedSearch?: string
    setDebouncedSearch?: (val: string) => void;
    loading: boolean
    setLoading: (val: boolean) => void;
}

const HeaderCrud = ({ title, subtitle, setModalType, debouncedSearch, setDebouncedSearch, loading, setLoading }: Props) => {
    const [search, setSearch] = useState('');
    useEffect(() => {
        setLoading(true);
        if (setDebouncedSearch) {
            const handler = setTimeout(() => {
                setDebouncedSearch(search);
            }, 700);
            return () => clearTimeout(handler);
        }
        setLoading(false);
    }, [search]);
    useEffect(() => {
        if (!debouncedSearch) {
            setLoading(false);
            return;
        }
    }, [debouncedSearch]);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#2D336B]">{title}</h1>
                {
                    subtitle &&
                    <p className="text-sm text-slate-500">{subtitle}</p>
                }
            </div>

            <div className="flex items-center gap-3">
                {/* {
                    setSearch &&
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2D336B] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Cari transaksi..."
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-[#2D336B] outline-none w-full md:w-64 transition-all shadow-sm"
                        />
                    </div>
                } */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2D336B] transition-colors" size={18} />

                    <input
                        type="text"
                        placeholder="Cari transaksi..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-[#2D336B] outline-none w-full md:w-64 transition-all shadow-sm"
                    />

                    {loading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-[#2D336B] rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {/* <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 shadow-sm">
                    <Filter size={18} />
                </button> */}
                <button
                    onClick={() => setModalType('add')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2D336B] text-white rounded-xl font-bold hover:bg-[#1e234d] transition-all shadow-lg shadow-indigo-100/50"
                >
                    <Plus size={18} /> Tambah
                </button>
            </div>
        </div>
    )
}

export default HeaderCrud