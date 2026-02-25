export interface ClientOrderType {
    id: number;
    order_id: number;
    payment_method: string;
    payment_channel: string;
    payment_destination: string;
    payment_proof_url: string;
    account_name: string;
    amount: number;
    status: string;
    paid_at: string;
    transaction_id: string;
    provider: string;
    provider_response: string;
    order_number?: string;
}