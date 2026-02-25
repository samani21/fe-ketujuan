"use client";

import React, { useEffect, useState } from "react";
import FormField from "@/Components/Component/CRUD/FormField";
import Modal from "@/Components/Component/Modal";
import { Save } from "lucide-react";
import { Get } from "@/utils/apiWithToken";

type Props = {
    modalType: string | null;
    closeModal: () => void;
    handleSubmit: (id: number, status: string) => void;
    data: any;
};

type Option = {
    label: string;
    value: string;
}


const UpdateOrders = ({ modalType, closeModal, handleSubmit, data }: Props) => {
    const [errors, setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [dataCategories, setDataCategories] = useState<Option[]>([])
    const [form, setForm] = useState<any>({
        status: "",
    });

    useEffect(() => {
        if (data) {
            setForm({
                status: data?.status,
                order_number: data?.order_number,
                subtotal: data?.subtotal,
                shipping_cost: data?.shipping_cost,
                total_price: data?.total_price,
                payment_method: data?.payment_method,
                payment_destination: data?.payment_destination,
                payment_proof_url: data?.payment_proof_url,
            })
        }
    }, [data])
    const update = (name: string, value: any) => {
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const onSubmit = (e: any) => {
        e.preventDefault();
        setIsLoading(true)

        handleSubmit(data?.id, form?.status)
        // setIsLoading(false)
    }


    return (
        <Modal
            isOpen={modalType === "add" || modalType === 'edit'}
            onClose={closeModal}
            title="Update Orders"
        >
            <div className="overflow-auto max-h-[80vh] no-scrollbar ">
                <form onSubmit={onSubmit} className="space-y-5">
                    <FormField label="Invoice" name="order_number" type="text" value={form.order_number} onChange={update} disabled={true} required />
                    <FormField label="Subtotal" name="subtotal" type="rupiah" value={form.subtotal} onChange={update} disabled={true} required />
                    <FormField label="Shipping Cost" name="shipping_cost" type="rupiah" value={form.shipping_cost} onChange={update} disabled={true} required />
                    <FormField label="Total Price" name="total_price" type="rupiah" value={form.total_price} onChange={update} disabled={true} required />
                    <FormField label="Payment Method" name="payment_method" type="text" value={form.payment_method} onChange={update} disabled={true} required />
                    <FormField label="Payement Code" name="payment_destination" type="text" value={form.payment_destination} onChange={update} disabled={true} required />
                    <FormField label="Payment Proof Url" name="paymen_proof_url" type="image" value={form.payment_proof_url} onChange={update} disabled={true} required />
                    <FormField
                        label="status"
                        name="status"
                        type="select"
                        value={form.status}
                        options={[
                            { label: "Pending", value: "pending" },
                            { label: "Finished", value: "finished" },
                            { label: "Processing", value: "processing" },
                            { label: "Expired", value: "expired" },
                            { label: "Failed", value: "failed" },
                            { label: "Paid", value: "paid" },
                        ]}
                        onChange={update}
                        disabled={isLoading} />

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={isLoading ? "rounded-xl flex items-center gap-2 px-6 py-2 bg-slate-100 cursor-not-allowed text-slate-400" : "flex items-center gap-2 px-6 py-2 bg-[var(--primary-color)] text-white rounded-xl"}
                        >
                            <Save size={16} />
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default UpdateOrders;
