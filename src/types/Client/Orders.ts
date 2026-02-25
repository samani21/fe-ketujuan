import { ProductType } from "../Product";
import { ClientOrderType } from "./ClientOrders";

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
    status: string
    approve_at: string
    expired_at: string;
    created_at: string;
    updated_at: string;
    items: ItemsType[]
    client_order: ClientOrderType;
}