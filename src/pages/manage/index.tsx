import React, { useState, useRef, useEffect } from 'react';
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
import LayoutAdmin from '../../Components/Layout/LayoutAdmin';
import { ProductType } from '@/types/Product';
import { ProductDummy } from '@/data/ProductsDummy';

export default function ProductManagement() {
    const [products, setProducts] = useState<ProductType[]>();
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        setProducts(ProductDummy);
    }, [])
    const handleToggleStock = (id: number) => {
        setProducts(products?.map(p => p.id === id ? { ...p, status_stock: !p.status_stock } : p));
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            setProducts(products?.filter(p => p.id !== id));
        }
    };

    const filteredProducts = products?.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <LayoutAdmin setSearchQuery={setSearchQuery}>
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
                            {filteredProducts?.map((product) => (
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
                                    <td className="px-6 py-4 font-black text-blue-900 text-sm">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Toggle Switch */}
                                        <button
                                            onClick={() => handleToggleStock(product.id)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${product.status_stock ? 'bg-[var(--primary-color)]' : 'bg-neutral-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.status_stock ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                        <span className={`ml-3 text-xs font-bold ${product.status_stock ? 'text-[var(--primary-color)]' : 'text-neutral-400'}`}>
                                            {product.status_stock ? 'Tersedia' : 'Habis'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-2 text-neutral-400 hover:text-[var(--primary-color)] hover:bg-bblue-50 rounded-lg transition-all">
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
                {filteredProducts?.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-neutral-400 font-medium">Produk tidak ditemukan.</p>
                    </div>
                )}
            </div>
        </LayoutAdmin>
    );
}