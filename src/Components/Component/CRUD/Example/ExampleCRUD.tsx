import DynamicTable from '@/Components/Component/CRUD/DynamicTable'
import HeaderCrud from '@/Components/Component/CRUD/HeaderCrud';
import LayoutAdmin from '@/Components/Layout/LayoutAdmin';
import { Edit2, Filter, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Column } from '@/Components/Component/CRUD/Type';
import ExampleFormInput from './ExampleFormInput';
import ExampleDelete from './ExampleDelete';

type Transaction = {
    id: number
    tanggal: string
    nama: string
    produk: string
    qty: number
    total: number
    metode: string
}


type Props = {}

const ExampleCRUD = (props: Props) => {
    const [modalType, setModalType] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)
    let lastPage = 12
    const [transactions] = useState([
        ...Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            tanggal: `2024-02-${String((i % 28) + 1).padStart(2, "0")}`,
            nama: `User ${i + 1}`,
            produk: ["Aren Latte", "Matcha", "Americano", "Croissant", "Cappuccino"][i % 5],
            qty: (i % 5) + 1,
            total: ((i % 5) + 1) * 20000 + 16000,
            metode: ["BCA Transfer", "QRIS", "E-Wallet", "Tunai"][i % 4],
            status: ["Sukses", "Pending", "Batal"][i % 3],
            aktif: i % 2 === 0,
            foto: `https://picsum.photos/40?random=${i + 1}`,
            rating: (i % 5) + 1,
            created_at: `2024-02-${String((i % 28) + 1).padStart(2, "0")}T${String((i % 12) + 1).padStart(2, "0")}:${String((i % 60) + 1).padStart(2, "0")}:${String((i % 60) + 1).padStart(2, "0")}`,
        }))
    ]);

    const [data, setData] = useState<any>();
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');

    useEffect(() => {
        if (!debouncedSearch) return;

        console.log("Search jalan:", debouncedSearch);
        setLoading(false);
        // panggil API disini
        // getProducts(debouncedSearch)

    }, [debouncedSearch]);


    const columnTable: Column<Transaction>[] = [
        {
            header: "Tanggal",
            key: "tanggal",
            type: "date"
        },
        {
            header: "Nama Pelanggan",
            key: "nama",
        },
        {
            header: "Produk",
            type: "custom",
            render: (row) => `${row.produk} (${row.qty})`
        },
        {
            header: "Total",
            key: "total",
            type: "rupiah"
        },
        {
            header: "Metode",
            key: "metode",
            type: "badge"
        },
        {
            header: "Cretad At",
            key: "created_at",
            type: "datetime"
        },
        {
            header: "Aksi",
            type: "custom",
            render: (row) => (
                <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => setModalType('edit')}><Edit2 size={16} /></button>
                    <button onClick={() => {
                        setModalType('delete')
                        setData(row)
                    }}><Trash2 size={16} /></button>
                </div>
            )
        }
    ]


    const generatePagination = (current: number, last: number) => {
        const delta = 2;
        const range = [];
        const pages: (number | string)[] = [];

        for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
            range.push(i);
        }

        if (current - delta > 2) {
            pages.push(1, "...");
        } else {
            pages.push(1);
        }

        pages.push(...range);

        if (current + delta < last - 1) {
            pages.push("...", last);
        } else if (last > 1) {
            pages.push(last);
        }

        return [...new Set(pages)];
    };


    const footerTable = () => {
        return (
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                    Menampilkan {transactions.length} transaksi terbaru
                </p>

                <div className="flex gap-2 items-center">
                    {/* Prev */}
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className={`px-3 py-1 text-xs font-semibold border rounded-lg 
            ${currentPage === 1
                                ? "bg-white border-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-white border-slate-200 text-[#2D336B] hover:border-[#2D336B]"
                            }`}
                    >
                        Prev
                    </button>

                    {/* Number Pages */}
                    {generatePagination(currentPage, lastPage).map((page, i) =>
                        page === "..." ? (
                            <span key={i} className="px-2 text-xs text-slate-400">...</span>
                        ) : (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(page as number)}
                                className={`px-3 py-1 text-xs font-semibold border rounded-lg
            ${currentPage === page
                                        ? "bg-[#2D336B] text-white border-[#2D336B]"
                                        : "bg-white border-slate-200 text-[#2D336B]"
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}

                    {/* Next */}
                    <button
                        disabled={currentPage === lastPage}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className={`px-3 py-1 text-xs font-semibold border rounded-lg
            ${currentPage === lastPage
                                ? "bg-white border-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-white border-slate-200 text-[#2D336B] hover:border-[#2D336B]"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>

        )
    }
    return (
        <LayoutAdmin>
            <HeaderCrud title={"List Category"}
                subtitle={"Kelola list kategori"}
                setModalType={setModalType}
                debouncedSearch={debouncedSearch}
                setDebouncedSearch={setDebouncedSearch}
                loading={loading}
                setLoading={setLoading} />
            <DynamicTable
                columns={columnTable}
                data={transactions}
                Footer={footerTable}
            />
            {
                modalType === 'add' || modalType === 'edit' ?
                    <ExampleFormInput modalType={modalType} closeModal={() => setModalType(null)} /> :
                    <ExampleDelete modalType={modalType} closeModal={() => setModalType(null)} data={data} handleDelete={(v) => console.log(v)} />
            }
        </LayoutAdmin>
    )
}

export default ExampleCRUD