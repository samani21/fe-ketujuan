import { StoreData } from '@/services/storeService';
import { ProductCategorieType } from '@/types/Client/ProductCategories';
import { Search, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import * as Icons from 'lucide-react';
import Link from 'next/link';
type Props = {
    categories: ProductCategorieType[];
    isPreview?: boolean;
    infoStore: StoreData | null;
    activeTab?: string
    setActiveTab?: (val: string) => void;
}

const HeaderStore = ({ categories, isPreview, infoStore, activeTab, setActiveTab }: Props) => {
    const route = useRouter();
    const scrollToCategory = (name: string) => {
        setActiveTab && setActiveTab(name);

        // Jika 'all', langsung scroll ke paling atas
        if (name.toLowerCase() === 'all') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        const element = document.getElementById(name);
        if (element) {
            const offset = 120;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };
    return (
        <header className="sticky top-0 z-40 bg-slate-100 backdrop-blur-lg border-b border-neutral-100">
            <div className="max-w-screen-md mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex flex-col cursor-pointer" onClick={() => !isPreview && route.push('/')}>
                    <h1 className="text-lg font-extrabold tracking-tight text-[var(--primary-color)] leading-none">
                        {infoStore?.name}
                    </h1>
                    {/* <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-medium">{infoStore?.name}</span> */}
                </div>
                <div className="flex items-center space-x-3">
                    <button className="p-2 text-neutral-400"><Search size={20} /></button>
                    <Link href={isPreview ? "#" : '/orders'} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center cursor-pointer" >
                        <Icons.History size={18} className="text-neutral-600" />
                    </Link>
                </div>
            </div>

            {/* --- Category Tabs (Mobile Scroll) --- */}
            <nav className="max-w-screen-md mx-auto px-4 pb-3 overflow-x-auto no-scrollbar flex space-x-2 scroll-smooth">
                {categories?.length > 0 ? <>
                    {
                        categories.map((cat) => {
                            const LucideIcon = cat.icon && (Icons as any)[cat.icon];
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => scrollToCategory(cat.name)}
                                    className={`flex items-center space-x-1.5 whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${activeTab === cat.name
                                        ? 'bg-[var(--primary-color)] text-white shadow-md'
                                        : 'bg-neutral-100 text-neutral-500'
                                        }`}
                                >
                                    <LucideIcon className="w-[16px] h-[16px]" />
                                    <span>{cat.name}</span>
                                </button>
                            )
                        })}
                    <button
                        onClick={() => scrollToCategory('all')}
                        className={`flex items-center space-x-1.5 whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${activeTab === 'all'
                            ? 'bg-[var(--primary-color)] text-white shadow-md'
                            : 'bg-neutral-100 text-neutral-500'
                            }`}
                    >
                        <span>Semua</span>
                    </button>
                </> : <p className='text-gray-500'>Kategori tidak ditemukan!</p>}
            </nav>
        </header>
    )
}

export default HeaderStore