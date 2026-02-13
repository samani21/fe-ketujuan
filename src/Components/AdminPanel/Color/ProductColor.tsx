import LayoutStore from '@/Components/Layout/LayoutStore'
import FloatingCartStore from '@/Components/Store/FloatingCart'
import HeaderStore from '@/Components/Store/Header'
import MainStore from '@/Components/Store/Main'
import { CategorieDummy } from '@/data/CategorieDummy'
import { ProductDummy } from '@/data/ProductsDummy'
import { StoreData } from '@/services/storeService'
import { CategorieType } from '@/types/CategorieProduct'
import { ProductType } from '@/types/Product'
import { Get } from '@/utils/apiWithToken'
import React, { useEffect, useState } from 'react'

type Props = {}

const ProductColor = (props: Props) => {
    const [categories, setCategories] = useState<CategorieType[]>();
    const [products, setProducts] = useState<ProductType[]>();
    const [cart, setCart] = useState<ProductType[]>([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);


    useEffect(() => {
        setCategories(CategorieDummy);
        setProducts(ProductDummy);
    })
    const addToCart = (product: ProductType) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, qty: (item.qty ?? 0) + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.qty ?? 0)), 0);
    const cartCount = cart.reduce((sum, item) => sum + (item.qty ?? 0), 0);

    return (
        <div className="relative min-h-screen bg-slate-100 font-sans text-neutral-900 [transform:translateZ(0)]">


            <HeaderStore categories={categories ?? []} isPreview={true} />

            {/* --- Main Content --- */}

            <MainStore categories={categories ?? []} products={products ?? []} addToCart={addToCart} />

            {/* --- Floating Mobile Cart --- */}
            <FloatingCartStore cartCount={cartCount} cartTotal={cartTotal} setIsCheckoutOpen={setIsCheckoutOpen} />


            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { -webkit-tap-highlight-color: transparent; }
      `}</style>
        </div>
    );
}

export default ProductColor