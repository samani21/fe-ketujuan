"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";

type Props = {
    value?: string;
    onChange?: (name: string, icon: string) => void;
    disabled: boolean
    error?: string;
    data: any
};

export default function IconSelectAutocomplete({
    value,
    onChange,
    disabled,
    error,
    data
}: Props) {
    const [query, setQuery] = useState(value || "");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [selected, setSelected] = useState<string | null>(value || null);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    /* ======================
       ICON LIST
    ====================== */
    const iconNames = useMemo(() => {
        return Object.keys(Icons ?? {});
    }, []);

    useEffect(() => {
        setQuery(data?.icon)
        setSelected(data?.icon)
    }, [data])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    /* ======================
       DEBOUNCE SEARCH
    ====================== */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedQuery(query);
        }, 250);

        return () => clearTimeout(t);
    }, [query]);

    /* ======================
       FILTER ICON
    ====================== */
    const filteredIcons = useMemo(() => {
        if (!debouncedQuery || debouncedQuery.length < 1) {
            return iconNames.slice(0, 40);
        }

        return iconNames
            .filter((name) =>
                name.toLowerCase().includes(debouncedQuery.toLowerCase())
            )
            .slice(0, 50); // LIMIT BIAR RINGAN
    }, [debouncedQuery, iconNames]);

    const SelectedIcon = selected
        ? (Icons as any)[selected]
        : null;

    /* ======================
       SELECT ICON
    ====================== */
    const handleSelect = (name: string) => {
        setSelected(name);
        setQuery(name);
        setOpen(false);
        onChange?.("icon", name);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <label className={`text-[10px] font-black uppercase tracking-widest ${disabled ? 'text-slate-300' : 'text-slate-400'}`}>
                Icon
            </label>
            <input
                value={query}
                placeholder="Cari icon..."
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                    setQuery(e.target.value || '');
                    setOpen(true);
                }}
                name="icon"
                autoComplete="off"
                disabled={disabled}
                className={` w-full px-4 py-3 border rounded-xl outline-none text-sm font-medium transition-all ${disabled ? 'bg-slate-100 cursor-not-allowed text-slate-400' : 'bg-[#F8FAFC]'} ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#2D336B]'}`} />

            {/* DROPDOWN */}
            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white border rounded-xl shadow-lg max-h-30 overflow-auto">
                    {filteredIcons.map((name) => {
                        const Icon = (Icons as any)[name];
                        return (
                            <div
                                key={name}
                                onClick={() => handleSelect(name)}
                                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-100"
                            >
                                {Icon && <Icon size={18} />}
                                <span>{name}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* PREVIEW ICON */}
            {SelectedIcon && (
                <div className="mt-3 flex items-center gap-2 border rounded-lg px-3 py-2 w-fit">
                    <SelectedIcon size={22} />
                    <span className="text-sm font-medium">
                        {selected}
                    </span>
                </div>
            )}
            <i className="text-[12px] text-blue-500">Cari nama icon di <span className="cursor-pointer" onClick={() => window.open('https://lucide.dev/icons/', '_blank')}>https://lucide.dev/icons/</span></i>
        </div>
    );
}
