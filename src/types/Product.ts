export interface ProductType {
    id: number;
    cart_id?: number;
    category: string;
    name: string;
    price: number;
    desc: string;
    image: string;
    qty?: number
    stock?: number
    status_stock?: boolean
}