import React from "react";
import { Column } from "./Type";

type Props<T> = {
    columns: Column<T>[];
    data: T[];
    Footer?: React.ComponentType;
};

export default function DynamicTable<T>({
    columns,
    data,
    Footer,
}: Props<T>) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            {columns.map((col, i) => (
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
                        {data.map((row: any, rowIndex) => (
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
                        ))}
                    </tbody>

                </table>
            </div>
            {Footer &&
                <Footer />}
        </div>
    );
}
