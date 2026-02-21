import { ProductType } from "../Product";

export interface ItemsType {
    id: number;
    quantity: number;
    price_at_purchase: number;
    product: ProductType
}

export interface OrdersType {
    id: number;
    client_id: number;
    order_number: string;
    client_user_id: number;
    subtotal: number;
    shipping_cost: number;
    total_price: number;
    payment_method: string;
    payment_destination: string;
    payment_proof_url: string;
    status: string
    expired_at: string;
    created_at: string;
    updated_at: string;
    items: ItemsType[]
}