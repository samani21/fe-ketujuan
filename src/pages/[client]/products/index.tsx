import React, { useState, useEffect, useRef } from 'react';
import { ProductType } from '@/types/Product';
import HeaderStore from '@/Components/Store/Header';
import MainStore from '@/Components/Store/Main';
import FloatingCartStore from '@/Components/Store/FloatingCart';
import ModalChckoutStore from '@/Components/Store/ModalChckout';
import { StoreData, storeService } from '@/services/storeService';
import { ProductCategorieType } from '@/types/Client/ProductCategories';
import { Get, Post } from '@/utils/apiWithToken';

export default function ProductPage() {
    const [cart, setCart] = useState<ProductType[]>([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [categories, setCategories] = useState<ProductCategorieType[]>();
    const [products, setProducts] = useState<ProductType[]>();
    const [infoStore, setInfoStore] = useState<StoreData | null>(null);
    const [activeTab, setActiveTab] = useState<string>('all');
    const prevCartRef = useRef<string>("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        fetchStore();
        fetchProducts();
        fetchCarts()
    }, [])

    useEffect(() => {
        const currentCart = JSON.stringify(cart);

        if (prevCartRef.current !== currentCart) {
            prevCartRef.current = currentCart;

            // clear timeout sebelumnya
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // tunggu sampai cart benar-benar berhenti berubah
            timeoutRef.current = setTimeout(() => {
                updateQuantity();
            }, 500); // delay 500ms (bisa ubah)
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [cart]);
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
        setCart(prev => {
            const updated = prev
                .map(item => {
                    if (item.id === id) {
                        const newQty = Math.max(0, (item.qty ?? 0) + delta);
                        return { ...item, qty: newQty };
                    }
                    return item;
                })
                .filter(item => (item.qty ?? 0) > 0);

            return updated;
        });
    };
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.qty ?? 0)), 0);
    const cartCount = cart.reduce((sum, item) => sum + (item.qty ?? 0), 0);


    const fetchStore = async (lat?: number, lng?: number) => {
        try {
            const result = await storeService.getStoreInfo(lat, lng);
            if (result.status === 'success') {
                setInfoStore(result?.data ?? null)
                if (result.data) {
                    document.documentElement.style.setProperty('--primary-color', result.data?.branding?.primary_color || '#1A2D5E');
                    // Mengonversi hex ke RGB sederhana untuk transparansi (biasanya pakai library, di sini manual sederhana)
                    const r = parseInt(result.data?.branding?.primary_color.slice(1, 3), 16);
                    const g = parseInt(result.data?.branding?.primary_color.slice(3, 5), 16);
                    const b = parseInt(result.data?.branding?.primary_color.slice(5, 7), 16);
                    document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
                }
            }
        } catch (error) {
            console.error("Gagal memuat:", error);
        } finally {
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await storeService.getProducts();
            if (res?.status === 'success') {
                setProducts(res?.data?.products);
                setCategories(res?.data?.categories);
            } else {
                console.log('gagal')
            }
        } catch (error) {
            console.error("Gagal memuat:", error);
        } finally {
        }
    };

    const fetchCarts = async () => {
        try {
            const res = await Get<{ status: string, data: ProductType[] }>('/v1/front/carts');
            if (res?.status === 'success') {
                setCart(res?.data);
            }
        } catch (e: any) {

        }
    }

    const updateQuantity = async () => {
        try {
            const formData = new FormData();
            for (let i = 0; cart?.length > i; i++) {
                formData.append(`product_id[${i}]`, String(cart[i]?.id));
                formData.append(`quantity[${i}]`, String(cart[i]?.qty));
            }
            const res = await Post('/v1/front/carts/quantity', formData);

        } catch (e) {

        }
    }

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-neutral-900 pb-32">

            <HeaderStore categories={categories ?? []} infoStore={infoStore} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* --- Main Content --- */}

            <MainStore categories={categories ?? []} products={products ?? []} addToCart={addToCart} setActiveTab={setActiveTab} />

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