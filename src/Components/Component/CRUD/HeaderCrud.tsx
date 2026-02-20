import { Plus, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props = {
    title: string;
    subtitle?: string;
    setModalType: (val: string) => void;
    debouncedSearch?: string
    setDebouncedSearch?: (val: string) => void;
    loading: boolean
    setLoading: (val: boolean) => void;
    startDate?: string
    endDate?: string
    setStartDate?: (val: string) => void
    setEndDate?: (val: string) => void
    isAdd?: boolean;
}

const HeaderCrud = ({ title, subtitle, setModalType, debouncedSearch, setDebouncedSearch, loading, setLoading, startDate, endDate, setStartDate, setEndDate, isAdd = true }: Props) => {
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
                <h1 className="text-2xl font-extrabold tracking-tight text-[var(--primary-color)]">{title}</h1>
                {
                    subtitle &&
                    <p className="text-sm text-slate-500">{subtitle}</p>
                }
            </div>

            <div className="flex items-center gap-3">
                <div className="relative group space-x-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />

                    <input
                        type="text"
                        placeholder="Cari Data..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-[var(--primary-color)] outline-none w-full md:w-64 transition-all shadow-sm"
                    />
                    {
                        setStartDate && setEndDate && <>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate?.(e.target.value)}
                                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-[var(--primary-color)] outline-none shadow-sm"
                            />

                            {/* 📅 End Date */}
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate?.(e.target.value)}
                                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-[var(--primary-color)] outline-none shadow-sm"
                            />
                        </>
                    }
                    {loading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-[var(--primary-color)] rounded-full animate-spin" />
                        </div>
                    )}
                </div>
                {
                    isAdd &&
                    <button
                        onClick={() => setModalType('add')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary-color)] text-white rounded-xl font-bold hover:bg-[var(--primary-color)] transition-all shadow-lg shadow-indigo-100/50"
                    >
                        <Plus size={18} /> Tambah
                    </button>
                }
            </div>
        </div>
    )
}

export default HeaderCrud