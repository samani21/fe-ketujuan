import React, { useEffect, useState } from 'react';
import {
  Search,
  MapPin,
  ChevronRight,
  Store,
  ShoppingBag,
  Phone,
  Loader2,
  Plus
} from 'lucide-react';
import LayoutStore from '@/pages/Layout/LayoutStore';

// --- TYPE DEFINITIONS (Mencegah Error ESLint 'any') ---
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  description: string | null;
  category: Category | null;
}

interface StoreData {
  id: number;
  name: string;
  logo: string | null;
  business_fields: string | null;
  address: string | null;
  telp: string;
  products: Product[];
}

interface FrontStoreProps {
  subdomain: string;
}

const FrontStore = ({ subdomain }: FrontStoreProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.katujuan.net/v1/front/store-info`, {
          headers: {
            'X-Client-Subdomain': subdomain,
            'Accept': 'application/json'
          }
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
          setStoreData(result.data);
        }
      } catch (error) {
        console.error("Gagal memuat data toko:", error);
      } finally {
        setLoading(false);
      }
    };

    if (subdomain) fetchStoreInfo();
  }, [subdomain]);

  // Filtering Produk dengan Type Safety
  const filteredProducts = storeData?.products?.filter((product: Product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-900 mb-4" size={48} />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Memuat Etalase {subdomain}...
        </p>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-800">Toko Tidak Aktif</h2>
          <p className="text-sm text-slate-500 mt-2">Maaf, toko ini sedang tidak dapat menerima pesanan.</p>
        </div>
      </div>
    );
  }

  return (
    <LayoutStore setSearchQuery={setSearchQuery} searchQuery={searchQuery}>
      {/* --- Dynamic Banner Section --- */}
      <div className="mb-8 overflow-hidden rounded-[2.5rem] bg-slate-900 aspect-[21/9] relative flex items-center justify-center p-6 text-center shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center p-2 shadow-inner">
             <img src={storeData.logo || '/default-store.png'} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-white font-black text-2xl tracking-tight uppercase">{storeData.name}</h2>
          <p className="text-blue-100 text-[10px] mt-1 font-bold uppercase tracking-[0.2em] opacity-80">
            {storeData.business_fields || 'Partner Resmi Katujuan'}
          </p>
        </div>
      </div>

      {/* --- Store Quick Info --- */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-900 rounded-xl"><MapPin size={18} /></div>
          <div className="overflow-hidden">
            <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Lokasi</p>
            <p className="text-[11px] font-bold text-slate-700 truncate">{storeData.address || 'Banjarmasin'}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Phone size={18} /></div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Kontak</p>
            <p className="text-[11px] font-bold text-slate-700">{storeData.telp}</p>
          </div>
        </div>
      </div>

      {/* --- Product Catalog Section --- */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h3 className="font-black text-slate-800 tracking-tight text-lg">Katalog Produk</h3>
          <div className="h-1.5 w-8 bg-blue-900 rounded-full mt-1"></div>
        </div>
        <span className="text-[10px] bg-slate-900 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">
          {filteredProducts.length} Menu
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white rounded-[2rem] border border-slate-50 p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group flex gap-4"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50">
                <img 
                  src={product.image || '/placeholder.png'} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight pr-2 uppercase">
                      {product.name}
                    </h4>
                    <span className="bg-blue-50 text-blue-900 text-[9px] font-black px-2 py-0.5 rounded-lg">
                      {product.category?.name || 'Umum'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 italic font-medium">
                    {product.description || 'Sajian spesial dari kami untuk Anda.'}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <p className="font-black text-blue-900 text-sm">
                    Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                  </p>
                  <button className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-slate-900 text-white text-[10px] font-black hover:bg-blue-900 transition-colors shadow-lg shadow-slate-200">
                    <Plus size={14} /> TAMBAH
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={24} />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Produk tidak ditemukan</p>
          </div>
        )}
      </div>

      {/* --- Floating Action Button (Cart) --- */}
      <div className="fixed bottom-24 right-6 lg:right-[calc(50%-380px)] z-30">
        <button className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-white">
          <ShoppingBag size={24} />
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            0
          </span>
        </button>
      </div>
    </LayoutStore>
  );
};

export default FrontStore;