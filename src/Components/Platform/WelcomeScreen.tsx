import React from 'react';
import { ArrowRight, Store, ChevronRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const featuredClients = [
  { id: 1, name: "PUREEATS Coffee", subdomain: "pureeats", category: "F&B" },
  { id: 2, name: "Kopi Hatta", subdomain: "hatta", category: "F&B" },
];

const WelcomeScreen = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <nav className="max-w-screen-xl mx-auto px-6 py-6 flex justify-between items-center">
        <img src="/katujuan.png" className="h-8 w-auto" alt="Katujuan" />
        <div className="flex gap-4">
          <Link href="/auth/login" className="text-sm font-bold text-slate-500 pt-2">Masuk</Link>
          <Link href="/auth/register" className="bg-blue-900 text-white px-6 py-2 rounded-full text-sm font-bold">Daftar Gratis</Link>
        </div>
      </nav>

      <main className="max-w-screen-xl mx-auto px-6 pt-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-8 border border-blue-100">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Solusi No.1 UMKM Indonesia</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
          Ubah Toko Konvensional <br /> Jadi <span className="text-blue-900">Digital.</span>
        </h1>
        <div className="flex justify-center gap-4 mt-10">
          <Link href="/auth/register" className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-lg flex items-center gap-3">
            Mulai Sekarang <ArrowRight size={20} />
          </Link>
        </div>
      </main>

      <section className="max-w-screen-xl mx-auto px-6 mt-24">
        <h2 className="text-2xl font-black mb-8">Eksplorasi Toko Pilihan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredClients.map((client) => (
            <a key={client.id} href={`https://${client.subdomain}.katujuan.net`} className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <Store className="text-blue-900 mb-4" size={32} />
              <h3 className="text-xl font-black">{client.name}</h3>
              <p className="text-blue-900 font-bold text-sm mt-2 flex items-center">Lihat Toko <ChevronRight size={14} /></p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WelcomeScreen;