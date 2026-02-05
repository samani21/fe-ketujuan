import React, { useState, useEffect } from 'react';
import { ProductType } from '@/types/Product';
import { CategorieDummy } from '@/data/CategorieDummy';
import { ProductDummy } from '@/data/ProductsDummy';
import HeaderStore from '@/Components/Store/Header';
import { CategorieType } from '@/types/CategorieProduct';
import MainStore from '@/Components/Store/Main';
import FloatingCartStore from '@/Components/Store/FloatingCart';
import ModalChckoutStore from '@/Components/Store/ModalChckout';

export default function App() {
  const [cart, setCart] = useState<ProductType[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [categories, setCategories] = useState<CategorieType[]>();
  const [products, setProducts] = useState<ProductType[]>();
  useEffect(() => {
    setCategories(CategorieDummy);
    setProducts(ProductDummy);
  })
  // --- Logic Keranjang ---
  const addToCart = (product: ProductType) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: (item.qty ?? 0) + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, (item.qty ?? 0) + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => (item.qty ?? 0) > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.qty ?? 0)), 0);
  const cartCount = cart.reduce((sum, item) => sum + (item.qty ?? 0), 0);




  return (
    <div className="min-h-screen bg-slate-100 font-sans text-neutral-900 pb-32">

      <HeaderStore categories={categories ?? []} />

      {/* --- Main Content --- */}

      <MainStore categories={categories ?? []} products={products ?? []} addToCart={addToCart} />

      {/* --- Floating Mobile Cart --- */}
      <FloatingCartStore cartCount={cartCount} cartTotal={cartTotal} setIsCheckoutOpen={setIsCheckoutOpen} />

      {/* --- Mobile Bottom Sheet Checkout --- */}

      <ModalChckoutStore isCheckoutOpen={isCheckoutOpen} setIsCheckoutOpen={setIsCheckoutOpen} cart={cart} cartTotal={cartTotal} setCart={setCart} updateQty={updateQty} />
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}