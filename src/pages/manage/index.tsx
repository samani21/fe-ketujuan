import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    FileText,
    Menu,
    X,
    Plus,
    Search,
    Pencil,
    Trash2,
    Image as ImageIcon,
    ChevronRight,
    TrendingUp,
    Save,
    Upload
} from 'lucide-react';

// --- Data Dummy Produk ---
const INITIAL_PRODUCTS = [
    { id: 1, name: 'Aren Latte', category: 'Coffee', price: 28000, stock: true, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100' },
    { id: 2, name: 'Butter Croissant', category: 'Pastry', price: 22000, stock: true, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100' },
    { id: 3, name: 'Matcha Green Tea', category: 'Non-Coffee', price: 32000, stock: false, image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 4, name: 'Caramel Macchiato', category: 'Coffee', price: 35000, stock: true, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=100' },
];

const SidebarItem = ({ icon, label, active = false }) => (
    <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20' : 'text-neutral-500 hover:bg-neutral-100'}`}>
        {icon}
        <span className="font-semibold text-sm">{label}</span>
    </button>
);

export default function ProductManagement() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [previewImage, setPreviewImage] = useState(null);

    const fileInputRef = useRef(null);

    // --- Handlers ---
    const handleToggleStock = (id) => {
        setProducts(products.map(p => p.id === id ? { ...p, stock: !p.stock } : p));
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">

            {/* --- Sidebar --- */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-neutral-100 p-6 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center space-x-2 mb-10 px-2">
                    <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center">
                        <TrendingUp size={18} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-emerald-900">PURE<span className="font-light text-neutral-400">ADMIN</span></h1>
                </div>
                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <SidebarItem icon={<ShoppingBag size={20} />} label="Produk" active />
                    <SidebarItem icon={<FileText size={20} />} label="Laporan" />
                    <SidebarItem icon={<Users size={20} />} label="Pelanggan" />
                </nav>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-1 min-w-0">
                <header className="bg-white border-b border-neutral-100 sticky top-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-neutral-800">Manajemen Produk</h2>
                    </div>

                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="bg-emerald-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Tambah Produk</span>
                    </button>
                </header>

                <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 space-y-6">

                    {/* --- Search & Filters --- */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari nama produk atau kategori..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                        />
                    </div>

                    {/* --- Table Section --- */}
                    <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-neutral-50/50 text-[11px] uppercase tracking-widest text-neutral-400 font-black">
                                        <th className="px-6 py-5">Info Produk</th>
                                        <th className="px-6 py-5">Kategori</th>
                                        <th className="px-6 py-5">Harga</th>
                                        <th className="px-6 py-5">Status Stok</th>
                                        <th className="px-6 py-5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-neutral-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <img src={product.image} className="w-12 h-12 rounded-xl object-cover bg-neutral-100" alt="" />
                                                    <span className="text-sm font-bold text-neutral-800">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-neutral-100 text-neutral-500 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-black text-emerald-900 text-sm">
                                                Rp {product.price.toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4">
                                                {/* Toggle Switch */}
                                                <button
                                                    onClick={() => handleToggleStock(product.id)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${product.stock ? 'bg-emerald-600' : 'bg-neutral-200'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.stock ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                                <span className={`ml-3 text-xs font-bold ${product.stock ? 'text-emerald-600' : 'text-neutral-400'}`}>
                                                    {product.stock ? 'Tersedia' : 'Habis'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button className="p-2 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredProducts.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-neutral-400 font-medium">Produk tidak ditemukan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* --- Slide-over Drawer (Add Product) --- */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
                        >
                            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-neutral-800">Produk Baru</h2>
                                <button
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="p-2 hover:bg-neutral-100 rounded-full transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Image Upload Area */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Foto Produk</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative aspect-video rounded-3xl border-2 border-dashed border-neutral-200 bg-neutral-50 overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-100 transition-all group"
                                    >
                                        {previewImage ? (
                                            <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <>
                                                <div className="p-4 bg-white rounded-2xl shadow-sm text-neutral-300 group-hover:text-emerald-500 transition-colors">
                                                    <ImageIcon size={32} />
                                                </div>
                                                <p className="mt-3 text-xs font-bold text-neutral-400 uppercase tracking-widest">Klik untuk unggah</p>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-neutral-400 block mb-2">Nama Produk</label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Iced Americano"
                                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-neutral-400 block mb-2">Kategori</label>
                                        <select className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm appearance-none">
                                            <option>Coffee</option>
                                            <option>Non-Coffee</option>
                                            <option>Pastry</option>
                                            <option>Merchandise</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-neutral-400 block mb-2">Harga (Rp)</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-neutral-400 block mb-2">Deskripsi Produk</label>
                                        <textarea
                                            rows="3"
                                            placeholder="Ceritakan tentang rasa atau bahan produk ini..."
                                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
                                <button
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-2 shadow-xl shadow-emerald-900/20 active:scale-95 transition-all"
                                >
                                    <Save size={18} />
                                    <span>Simpan Produk</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}