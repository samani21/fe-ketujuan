import { RecentOrderType, StatType } from "@/types/Dashboard";
import { DollarSign, ShoppingBag, Users } from "lucide-react";

export const StatsDummy: StatType[] = [
    { id: 1, label: 'Total Penjualan', value: 'Rp 12.450.000', icon: <DollarSign size={20} />, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 2, label: 'Pesanan Baru', value: '142', icon: <ShoppingBag size={20} />, trend: '+8.2%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 3, label: 'Pelanggan Baru', value: '48', icon: <Users size={20} />, trend: '+5.4%', color: 'text-amber-600', bg: 'bg-amber-50' },
];

export const RecentOrderDummy: RecentOrderType[] = [
    { id: 1, invoice: '#ORD-7721', customer: 'Budi Santoso', items: 'Aren Latte, Butter Croissant', amount: 'Rp 75.000', status: 'Selesai', date: '5 Menit yang lalu' },
    { id: 2, invoice: '#ORD-7722', customer: 'Siti Aminah', items: 'Matcha Green Tea', amount: 'Rp 32.000', status: 'Diproses', date: '12 Menit yang lalu' },
    { id: 3, invoice: '#ORD-7723', customer: 'Andi Wijaya', items: 'Caramel Macchiato', amount: 'Rp 35.000', status: 'Menunggu', date: '25 Menit yang lalu' },
    { id: 4, invoice: '#ORD-7724', customer: 'Dewi Lestari', items: 'Pain au Chocolat', amount: 'Rp 26.000', status: 'Selesai', date: '1 Jam yang lalu' },
];
