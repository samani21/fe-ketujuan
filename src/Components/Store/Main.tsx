import { ProductCategorieType } from '@/types/Client/ProductCategories';
import { ProductType } from '@/types/Product';
import { getClient, getToken, Post } from '@/utils/apiWithToken';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import ModalInfo from './ModalInfo';

type Props = {
    categories: ProductCategorieType[];
    products: ProductType[];
    addToCart?: (P: ProductType) => void;
    setActiveTab?: (val: string) => void;
}

const MainStore = ({ categories, products, addToCart, setActiveTab }: Props) => {
    const [selectCategory, setSelectCategory] = useState<string>('');
    const token = getToken();
    const client = getClient();
    const [openModal, setOpenModal] = useState<boolean>(false)
    const listCategory = useMemo(() => {
        if (!categories) return [];

        if (!selectCategory || selectCategory === '') {
            return categories;
        }

        // 3. Filter based on selection
        return categories.filter((c) => c?.name === selectCategory);
    }, [categories, selectCategory]); // Added categories to dependency array

    const handleAdd = (product: ProductType) => {
        if (!token || !client) {
            setOpenModal(true)
        } else {
            if (addToCart) {
                addCart(product)
            }
        }
    }

    const addCart = async (product: ProductType) => {
        try {
            const formData = new FormData();
            formData.append('product_id', String(product?.id))
            formData.append('quantity', String(1))
            const res = await Post<any, FormData>('/v1/front/carts', formData)
            if (res?.status === 'success') {
                console.log('success')
                if (addToCart) {
                    addToCart(product)
                }
            } else {
                console.log('Failed')
            }
        } catch (e: any) {
            console.log('Failed')
            console.error("Terjadi kesalahan", e)
        }
    }
    return (
        <main className="max-w-screen-md mx-auto px-4 pt-6 space-y-10">
            {categories?.length > 0 ? listCategory?.map((cat) => (
                <section key={cat.id} id={cat.name} className="scroll-mt-32">
                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => {
                        setSelectCategory(selectCategory === '' ? cat?.name : '')
                        setActiveTab && setActiveTab(selectCategory === '' ? cat?.name : 'all')
                    }}>
                        <h2 className="text-xl font-bold text-neutral-800">{cat.name}</h2>
                        <span className="text-xs text-[var(--primary-color)] font-medium">{selectCategory === '' ? "Lihat Semua" : "Kembali"}</span>
                    </div>

                    {/* 2-Column Grid on Mobile */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-6">
                        {products?.length > 0
                            ? products
                                .filter(p => p.category === cat.name)
                                .map((product) => {
                                    const isOutOfStock = !product?.stock || product.stock <= 0;

                                    return (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col"
                                        >
                                            <div className="aspect-square relative overflow-hidden bg-neutral-100">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className={`object-cover w-full h-full ${isOutOfStock ? "grayscale opacity-70" : ""
                                                        }`}
                                                />

                                                {/* Overlay Stok Habis */}
                                                {isOutOfStock && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                            Stok Habis
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-3 flex flex-col flex-1">
                                                <h3 className="font-bold text-sm mb-1 line-clamp-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-[10px] text-neutral-400 line-clamp-2 mb-3 leading-tight">
                                                    {product.desc}
                                                </p>

                                                <div className="mt-auto flex flex-col space-y-2">
                                                    <span className="font-extrabold text-sm text-[var(--primary-color)]">
                                                        Rp {product.price.toLocaleString("id-ID")}
                                                    </span>

                                                    <button
                                                        disabled={isOutOfStock}
                                                        onClick={() => handleAdd(product)}
                                                        className={`w-full py-2 rounded-xl flex items-center justify-center space-x-1 transition-all text-xs font-bold ${isOutOfStock
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            : "bg-[var(--primary-color)]/5 text-[var(--primary-color)] border border-[var(--primary-color)]/10 active:scale-95"
                                                            }`}>
                                                        <Plus size={14} />
                                                        <span>
                                                            {isOutOfStock ? "Stok Habis" : "Tambah"}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            : (
                                <p className="text-gray-500 text-center">
                                    Produk tidak ditemukan
                                </p>
                            )}
                    </div>
                </section>
            )) :
                <p className='text-gray-500 text-center'>Kategori tidak ditemukan!</p>}
            {
                openModal &&
                <ModalInfo isOpen={openModal} onClose={() => setOpenModal(false)} />
            }
        </main>
    )
}

export default MainStore