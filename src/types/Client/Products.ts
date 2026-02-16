import { StoreData } from "@/services/storeService"
import { ProductCategorieType } from "./ProductCategories"

export interface ProductsType {
    id: number;
    client_id: number;
    category_id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    status_stock: boolean;
    category: ProductCategorieType
    client: StoreData
}