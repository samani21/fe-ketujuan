import { StoreData } from '@/services/storeService';
import { CategorieType } from '@/types/CategorieProduct'
import { Search, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/router';
import React, { useState } from 'react'

type Props = {
    categories: CategorieType[];
    isPreview?: boolean;
    infoStore: StoreData | null;
}

const HeaderStore = ({ categories, isPreview, infoStore }: Props) => {
    const route = useRouter();
    const [activeTab, setActiveTab] = useState<string>('Coffee');
    const scrollToCategory = (name: string) => {
        setActiveTab(name);
        const element = document.getElementById(name);
        if (element) {
            const offset = 120; // Adjusted for mobile header
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
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                        <ShoppingBag size={18} className="text-neutral-600" />
                    </div>
                </div>
            </div>

            {/* --- Category Tabs (Mobile Scroll) --- */}
            <nav className="max-w-screen-md mx-auto px-4 pb-3 overflow-x-auto no-scrollbar flex space-x-2 scroll-smooth">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => scrollToCategory(cat.name)}
                        className={`flex items-center space-x-1.5 whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${activeTab === cat.name
                            ? 'bg-[var(--primary-color)] text-white shadow-md'
                            : 'bg-neutral-100 text-neutral-500'
                            }`}
                    >
                        {cat.icon}
                        <span>{cat.name}</span>
                    </button>
                ))}
            </nav>
        </header>
    )
}

export default HeaderStore