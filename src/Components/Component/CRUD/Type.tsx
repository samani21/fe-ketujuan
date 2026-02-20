export type Column<T = any> = {
    header: string
    key?: keyof T | string
    className?: string
    type?: "text" | "number" | "date" | "rupiah" | "badge" | "custom" | "datetime"
    render?: (row: T, value?: any) => React.ReactNode
}

export const renderCellValue = (type: string | undefined, value: any) => {

    if (value === null || value === undefined) return "-"

    switch (type) {
        case "rupiah":
            return `Rp ${Number(value).toLocaleString("id-ID")}`

        case "date":
            return new Date(value).toLocaleDateString("id-ID")

        case "badge":
            return (
                <span className="px-2 py-1 text-xs rounded-lg bg-slate-100">
                    {value}
                </span>
            )

        case "number":
            return Number(value).toLocaleString("id-ID")

        default:
            return value
    }
}
