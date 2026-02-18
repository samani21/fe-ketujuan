import { StoreData } from "@/services/storeService";

export interface CustomersType {
    id: number;
    client_id: number;
    name: string;
    email: string;
    password: string;
    phone_number: string;
    photo: string;
    role: string;
    status: string;
    verified_at: string;
    ip_address: string;
    client: StoreData;
}