import { CategorieType } from '@/types/CategorieProduct'
import { ProductType } from '@/types/Product';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import React from 'react'

type Props = {
    categories: CategorieType[];
    products: ProductType[];
    addToCart: (P: ProductType) => void;
}

const MainStore = ({ categories, products, addToCart }: Props) => {
    return (
        <main className="max-w-screen-md mx-auto px-4 pt-6 space-y-10">
            {categories?.map((cat) => (
                <section key={cat.id} id={cat.name} className="scroll-mt-32">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-neutral-800">{cat.name}</h2>
                        <span className="text-xs text-emerald-700 font-medium">Lihat Semua</span>
                    </div>

                    {/* 2-Column Grid on Mobile */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-6">
                        {products.filter(p => p.category === cat.name).map((product) => (
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
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="p-3 flex flex-col flex-1">
                                    <h3 className="font-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-[10px] text-neutral-400 line-clamp-2 mb-3 leading-tight">{product.desc}</p>

                                    <div className="mt-auto flex flex-col space-y-2">
                                        <span className="font-extrabold text-sm text-emerald-900">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </span>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="w-full py-2 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-xl flex items-center justify-center space-x-1 active:scale-95 transition-all text-xs font-bold"
                                        >
                                            <Plus size={14} />
                                            <span>Tambah</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    )
}

export default MainStore