import FronStoreColor from '@/Components/AdminPanel/Color/FronStoreColor';
import ProductColor from '@/Components/AdminPanel/Color/ProductColor';
import Notification from '@/Components/AdminPanel/Notification';
import LayoutAdmin from '@/Components/Layout/LayoutAdmin'
import LayoutStore from '@/Components/Layout/LayoutStore';
import { StoreData } from '@/services/storeService';
import { Get, Post } from '@/utils/apiWithToken';
import { Check, Palette, RefreshCcw } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const presets = [
    { name: 'Ocean Blue', color: '#1A2D5E', textColor: 'white' },
    { name: 'Emerald Green', color: '#10b981', textColor: 'black' },
    { name: 'Royal Purple', color: '#7c3aed', textColor: 'white' },
    { name: 'Rose Pink', color: '#f43f5e', textColor: 'black' },
    { name: 'Sunset Orange', color: '#f59e0b', textColor: 'black' },
    { name: 'Midnight Slate', color: '#334155', textColor: 'white' },
];

const ColorPage = () => {
    const [primaryColor, setPrimaryColor] = useState<string>(''); // Default Blue
    const [isFrontStore, setIsFrontStore] = useState<boolean>(true);
    const [showNotif, setShowNotif] = useState<any>({
        message: '',
        type: '',
        isOpen: false,
    });
    const [infoStore, setInfoStore] = useState<StoreData | null>(null);
    useEffect(() => {
        if (infoStore) {
            setPrimaryColor(infoStore?.branding?.primary_color)
        }
    }, [infoStore])
    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', primaryColor || "#1A2D5E");
        // Mengonversi hex ke RGB sederhana untuk transparansi (biasanya pakai library, di sini manual sederhana)
        const r = parseInt(primaryColor?.slice(1, 3), 16);
        const g = parseInt(primaryColor?.slice(3, 5), 16);
        const b = parseInt(primaryColor?.slice(5, 7), 16);
        document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    }, [infoStore, primaryColor]);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('primary_color', primaryColor);
            const res = await Post<any, FormData>('v1/branding', formData);
            if (res?.status) {
                setShowNotif({
                    message: res?.message,
                    type: res?.status,
                    isOpen: true
                })
            }
        } catch (e) {
            setShowNotif({
                message: "Gagal proses",
                type: "error",
                isOpen: true

            })
        }
    }


    return (
        <LayoutAdmin setInfoStore={setInfoStore}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Theme Controls Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Kustomisasi Warna Utama</h3>
                                <p className="text-sm text-gray-500">Pilih warna identitas yang akan diaplikasikan ke seluruh dashboard.</p>
                            </div>
                            <button
                                onClick={() => setPrimaryColor('#1A2D5E')}
                                className="p-2 text-gray-400 hover:text-[var(--primary-color)] transition-colors"
                                title="Reset ke default"
                            >
                                <RefreshCcw size={18} />
                            </button>
                        </div>

                        {/* Preset Grids */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {presets.map((p) => (
                                <button
                                    key={p.name}
                                    onClick={() => setPrimaryColor(p.color)}
                                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${primaryColor === p.color
                                        ? `border-[var(--primary-color)] bg-opacity-5 bg-[var(--primary-color)] text-${p?.textColor}`
                                        : 'border-gray-50 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: p.color }}></div>
                                    <span className={`text-sm font-semibold ${primaryColor != p?.color && 'text-gray-800'}`}>{p.name}</span>
                                    {primaryColor === p.color && <Check size={16} className="ml-auto text-[var(--primary-color)]" />}
                                </button>
                            ))}
                        </div>

                        {/* Custom Color Picker */}
                        <div className="p-5 bg-gray-50 rounded-2xl">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Warna Kustom Sendiri</label>
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="w-16 h-16 rounded-xl cursor-pointer border-none bg-transparent"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl">
                                        <span className="text-gray-400 font-mono">HEX:</span>
                                        <input
                                            type="text"
                                            value={primaryColor?.toUpperCase()}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="font-mono font-bold text-gray-800 focus:outline-none w-full"
                                        />
                                    </div>
                                </div>
                                <button onClick={handleSubmit} className='bg-[#1A2D5E] text-white hover:bg-[#15254d] shadow-sm rounded-lg px-4 py-3'>
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real-time Preview Card */}
                <div className="space-y-6 lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 sticky top-8">
                        <div className='lg:flex items-center justify-between p-6'>
                            <h3 className="text-lg font-bold text-gray-800">Live Preview</h3>
                            <div className="flex items-center justify-end ">
                                <div className={`${isFrontStore && 'bg-[#1A2D5E] text-white '} px-4 border border-gray-300 rounded-l-full cursor-pointer`} onClick={() => setIsFrontStore(true)}>
                                    Front Store
                                </div>
                                <div className={`${!isFrontStore && 'bg-[#1A2D5E] text-white '} px-4 border border-gray-300 rounded-r-full cursor-pointer`} onClick={() => setIsFrontStore(false)}>
                                    Product
                                </div>
                            </div>
                        </div>
                        <div className='h-[73vh] overflow-auto no-scrollbar'>
                            {
                                isFrontStore ? <FronStoreColor infoStore={infoStore} /> : <ProductColor />
                            }
                        </div>
                    </div>
                </div>
            </div>
            {
                showNotif?.isOpen &&
                <Notification onClose={() => setShowNotif(false)} message={showNotif?.message} type={showNotif?.type} />
            }
        </LayoutAdmin>
    )
}

export default ColorPage