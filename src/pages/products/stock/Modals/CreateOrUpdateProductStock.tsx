"use client";

import React, { useEffect, useState } from "react";
import FormField from "@/Components/Component/CRUD/FormField";
import Modal from "@/Components/Component/Modal";
import { Save } from "lucide-react";
import { Get } from "@/utils/apiWithToken";
import { ProductCategorieType } from "@/types/Client/ProductCategories";

type Props = {
    modalType: string | null;
    closeModal: () => void;
    handleSubmit: (e: any) => void;
    data: any;
};

type Option = {
    label: string;
    value: string;
}

const CreateOrUpdateProductStock = ({ modalType, closeModal, handleSubmit, data }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [dataProducts, setDataProducts] = useState<Option[]>([])
    const [form, setForm] = useState<any>({
        product_id: "",
        stock: "",
        date: "",
    });

    useEffect(() => {
        if (data) {
            setForm({
                product_id: data?.product_id,
                stock: data?.stock,
                date: data?.date,
            })
        }
    }, [data])
    useEffect(() => {
        getProducts();
    }, [])
    const update = (name: string, value: any) => {
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const onSubmit = (e: any) => {
        e.preventDefault();
        setIsLoading(true)

        handleSubmit(form)
        console.log(form)
        // setIsLoading(false)
    }
    const getProducts = async () => {
        try {
            const res = await Get<{ status: string, data: any }>(`/v1/products?per_page=10000`);
            if (res?.status === 'success') {
                const products = res?.data?.data?.map((item: any) => ({
                    label: item.name,   // sesuaikan dengan field API
                    value: item.id,
                })) ?? [];

                setDataProducts(products);
            }
        } catch (e) {

        }
    }


    return (
        <Modal
            isOpen={modalType === "add" || modalType === 'edit'}
            onClose={closeModal}
            title={modalType === "add" ? "Add Stock Product" : "Edit Stock Product"}
        >
            <div className="overflow-auto max-h-[80vh] no-scrollbar ">
                <form onSubmit={onSubmit} className="space-y-5">
                    <FormField
                        label="Product"
                        name="product_id"
                        type="autocomplete"
                        value={form.product_id}
                        options={dataProducts}
                        onChange={update}
                        disabled={isLoading} required />

                    <FormField label="Stock" name="stock" type="number" value={form.stock} onChange={update} disabled={isLoading} required />

                    <FormField label="date" name="date" type="date" value={form.date} onChange={update} disabled={isLoading} required />

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

export default CreateOrUpdateProductStock;
