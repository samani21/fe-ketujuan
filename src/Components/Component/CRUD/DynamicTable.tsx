import React from "react";
import { Column } from "./Type";

type Props<T> = {
    columns: Column<T>[];
    data: T[];
    currentPage: number;
    setCurrentPage: (val: number) => void;
    lastPage: number;
    countData: number;
};

export default function DynamicTable<T>({
    columns,
    data,
    currentPage,
    setCurrentPage,
    lastPage,
    countData
}: Props<T>) {
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


    const Footer = () => {
        return (
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                    Menampilkan {data?.length ?? 0} dari total {countData} data
                </p>

                <div className="flex gap-2 items-center">
                    {/* Prev */}
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className={`px-3 py-1 text-xs font-semibold border rounded-lg 
            ${currentPage === 1
                                ? "bg-white border-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-white border-slate-200 text-[var(--primary-color)] hover:border-[var(--primary-color)]"
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
                                        ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)]"
                                        : "bg-white border-slate-200 text-[var(--primary-color)]"
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
                                : "bg-white border-slate-200 text-[var(--primary-color)] hover:border-[var(--primary-color)]"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>

        )
    }
    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            {columns.map((col, i) => (

                                col?.header === "Action" ?
                                    <th
                                        key={i}
                                        className={`px-6 py-4 text-[11px] font-black text-center text-slate-400 uppercase tracking-[0.1em] ${col.className}`}
                                    >
                                        {col.header}
                                    </th> :
                                    <th
                                        key={i}
                                        className={`px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ${col.className}`}
                                    >
                                        {col.header}
                                    </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-50">
                        {data?.length > 0 ? data.map((row: any, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-slate-50/80 transition-colors group"
                            >
                                {columns.map((col, colIndex) => {

                                    const value = col.key ? row[col.key] : null

                                    const renderValue = () => {

                                        if (col.render) {
                                            return col.render(row, value)
                                        }

                                        if (value === null || value === undefined) {
                                            return "-"
                                        }

                                        switch (col.type) {

                                            case "rupiah":
                                                return `Rp ${Number(value).toLocaleString("id-ID")}`

                                            case "date":
                                                return new Date(value).toLocaleDateString("id-ID")

                                            case "datetime":
                                                return new Date(value).toLocaleString("id-ID", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short"
                                                })

                                            case "number":
                                                return Number(value).toLocaleString("id-ID")

                                            case "badge":
                                                return (
                                                    <span className="px-2 py-1 text-xs rounded-lg bg-slate-100">
                                                        {value}
                                                    </span>
                                                )

                                            default:
                                                return value
                                        }

                                    }

                                    return (
                                        <td
                                            key={colIndex}
                                            className={`px-6 py-4 text-sm text-slate-600 ${col.className || ""}`}
                                        >
                                            {renderValue()}
                                        </td>
                                    )
                                })}
                            </tr>
                        )) :
                            <tr>
                                <td colSpan={columns?.length} className="text-gray-700 text-center">
                                    Data tidak ditemukan
                                </td>
                            </tr>}
                    </tbody>

                </table>
            </div>
            <Footer />
        </div>
    );
}
