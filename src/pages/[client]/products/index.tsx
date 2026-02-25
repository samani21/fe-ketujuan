import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    const [products, setProducts] = useState<ProductType[]>([]);
    const [productsOriginal, setProductsOriginal] = useState<ProductType[]>([]);
    const [categories, setCategories] = useState<ProductCategorieType[]>([]);
    const [infoStore, setInfoStore] = useState<StoreData | null>(null);

    const [activeTab, setActiveTab] = useState('all');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const originalStockRef = useRef<Record<number, number>>({});
    console.log('products', products)
    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    const originalMap = useMemo(() => {
        const map: Record<number, number> = {};
        productsOriginal.forEach(p => map[p.id] = p.stock ?? 0);
        return map;
    }, [productsOriginal]);

    // hanya sekali saat load
    useEffect(() => {
        fetchStore();
        fetchProducts();
        fetchCarts();
    }, []);
    useEffect(() => {
        if (cart?.length === 0) {
            fetchProducts();
        }
    }, [cart]);
    /*
    |--------------------------------------------------------------------------
    | Sync Stock + Debounce API Cart
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        syncStockFromCart();

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            updateQuantity();
        }, 300);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [cart]);


    /*
    |--------------------------------------------------------------------------
    | Cart Logic
    |--------------------------------------------------------------------------
    */

    const addToCart = (product: ProductType) => {
        fetchProducts();
        setCart(prev => {
            const exist = prev.find(i => i.id === product.id);

            if (exist) {
                return prev.map(i =>
                    i.id === product.id
                        ? { ...i, qty: (i.qty ?? 0) + 1 }
                        : i
                );
            }

            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id: number, delta: number, soldOut?: boolean) => {
        setCart(prev => {
            const updatedCart = prev
                .map(i => {
                    if (i.id !== id) return i;

                    const newQty = Math.max(0, (i.qty ?? 0) + delta);
                    return { ...i, qty: soldOut ? originalMap[i.id] : newQty, soldout: soldOut };
                })
                .filter(i => (i.qty ?? 0) > 0);

            // update product jika soldout
            if (soldOut) {
                setProducts(products =>
                    products.map(product =>
                        product.id === id
                            ? { ...product, soldout: true, stock: originalMap[product.id] }
                            : product
                    )
                );
            }

            return updatedCart;
        });
    };


    /*
    |--------------------------------------------------------------------------
    | Stock Sync
    |--------------------------------------------------------------------------
    */

    const syncStockFromCart = () => {
        setProducts(prev =>
            prev.map(product => {

                if (originalStockRef.current[product.id] === undefined) {
                    originalStockRef.current[product.id] = product.stock ?? 0;
                }

                const baseStock = originalStockRef.current[product.id];

                const cartItem = cart.find(c => c.id === product.id);
                const qty = cartItem?.qty ?? 0;

                return {
                    ...product,
                    stock: product.soldout
                        ? originalMap[product.id]
                        : Math.max(baseStock - qty, 0),
                    soldout: true ? false : true
                };
            })
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Derived Cart Data
    |--------------------------------------------------------------------------
    */

    const cartTotal = cart.reduce(
        (sum, item) => sum + (item.price * (item.qty ?? 0)),
        0
    );

    const cartCount = cart.reduce(
        (sum, item) => sum + (item.qty ?? 0),
        0
    );


    /*
    |--------------------------------------------------------------------------
    | API
    |--------------------------------------------------------------------------
    */

    const fetchStore = async (lat?: number, lng?: number) => {
        try {
            const result = await storeService.getStoreInfo(lat, lng);

            if (result.status === 'success') {

                setInfoStore(result.data ?? null);

                if (result.data) {
                    const color = result.data.branding?.primary_color || '#1A2D5E';

                    document.documentElement.style.setProperty('--primary-color', color);

                    const r = parseInt(color.slice(1, 3), 16);
                    const g = parseInt(color.slice(3, 5), 16);
                    const b = parseInt(color.slice(5, 7), 16);

                    document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
                }
            }

        } catch (error) {
            console.error("Gagal memuat store:", error);
        }
    };


    const fetchProducts = async () => {
        try {
            const res = await storeService.getProducts();

            if (res?.status === 'success') {
                setProducts(res?.data?.products ?? []);
                setProductsOriginal(res?.data?.products ?? []);
                setCategories(res?.data?.categories ?? []);
            }

        } catch (error) {
            console.error("Gagal memuat produk:", error);
        }
    };


    const fetchCarts = async () => {
        try {
            const res = await Get<{ status: string, data: ProductType[] }>('/v1/front/carts');

            if (res?.status === 'success') {
                setCart(res.data ?? []);
            }

        } catch (error) {
            console.error("Gagal memuat cart:", error);
        }
    };


    const updateQuantity = async () => {
        try {

            const formData = new FormData();

            if (cart.length === 0) {
                formData.append("clear", "1");
            } else {
                cart.forEach((item, i) => {
                    formData.append(`product_id[${i}]`, String(item.id));
                    formData.append(`quantity[${i}]`, String(item.qty));
                });
            }

            await Post('/v1/front/carts/quantity', formData);

        } catch (error) {
            console.error("Gagal update cart:", error);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-neutral-900 pb-32">

            <HeaderStore
                categories={categories}
                infoStore={infoStore}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <MainStore
                categories={categories}
                products={products}
                addToCart={addToCart}
                setActiveTab={setActiveTab}
            />

            <FloatingCartStore
                cartCount={cartCount}
                cartTotal={cartTotal}
                setIsCheckoutOpen={setIsCheckoutOpen}
            />

            <ModalChckoutStore
                isCheckoutOpen={isCheckoutOpen}
                setIsCheckoutOpen={setIsCheckoutOpen}
                cart={cart}
                setCart={setCart}
                updateQty={updateQty}
                fetchProducts={fetchProducts}
            />

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                body { -webkit-tap-highlight-color: transparent; }
            `}</style>

        </div>
    );
}