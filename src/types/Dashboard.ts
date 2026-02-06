export interface StatType {
    id: number;
    label: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
    color: string
    bg: string;
}

export interface RecentOrderType {
    id: number;
    invoice: string;
    customer: string;
    items: string;
    amount: string;
    status: string;
    date: string

}