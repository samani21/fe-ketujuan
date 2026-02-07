// pages/404.tsx
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8">
        <span className="text-4xl">🧐</span>
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-4">Toko Tidak Ditemukan</h1>
      <p className="text-slate-500 max-w-sm mb-12 font-medium">
        Maaf, sepertinya alamat toko yang Anda cari belum terdaftar di Katujuan atau pengetikannya salah.
      </p>
      <Link href="https://katujuan.net" 
            className="bg-[var(--primary-color)] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:scale-105 transition-all">
        Buka Tokomu Sekarang
      </Link>
      <p className="mt-12 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
        © 2026 Katujuan: Kami Bantu Jualan
      </p>
    </div>
  );
}