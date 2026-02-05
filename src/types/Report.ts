export interface SalesDataType {
    day: string;
    sales: number;
}

export interface TransactionDetailType {
    id: number;
    date: string;
    customer:string;
    product:string;
    total:number;
    method:string
}