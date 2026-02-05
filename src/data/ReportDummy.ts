import { SalesDataType, TransactionDetailType } from "@/types/Report";

export const SalesDataDummy: SalesDataType[] = [
    { day: 'Sen', sales: 1200000 },
    { day: 'Sel', sales: 1900000 },
    { day: 'Rab', sales: 1500000 },
    { day: 'Kam', sales: 2200000 },
    { day: 'Jum', sales: 3100000 },
    { day: 'Sab', sales: 4500000 },
    { day: 'Min', sales: 3800000 },
];

export const TransactionDetailsDummy: TransactionDetailType[] = [
    { id: 1, date: '01 Feb 2024', customer: 'Rudi Tabuti', product: 'Aren Latte (2)', total: 56000, method: 'BCA Transfer' },
    { id: 2, date: '01 Feb 2024', customer: 'Siska Putri', product: 'Matcha Series (1)', total: 32000, method: 'E-Wallet' },
    { id: 3, date: '02 Feb 2024', customer: 'Bambang', product: 'Croissant Box (3)', total: 66000, method: 'QRIS' },
    { id: 4, date: '02 Feb 2024', customer: 'Ayu Lestari', product: 'Caramel Macchiato', total: 35000, method: 'BCA Transfer' },
    { id: 5, date: '03 Feb 2024', customer: 'Kevin Sanjaya', product: 'Americano (5)', total: 100000, method: 'E-Wallet' },
];