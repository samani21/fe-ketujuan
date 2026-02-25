"use client";

import React, { useEffect, useState } from "react";
import FormField from "@/Components/Component/CRUD/FormField";
import Modal from "@/Components/Component/Modal";
import { Save } from "lucide-react";
import { Get } from "@/utils/apiWithToken";
import { ProductCategorieType } from "@/types/Client/ProductCategories";
import { StoreData } from "@/services/storeService";

type Props = {
    modalType: string | null;
    closeModal: () => void;
    handleSubmit: (e: any) => void;
    data: any;
    storeInfo: StoreData | null;
};

type Option = {
    label: string;
    value: string;
}

const CreateOrUpdateCustomers = ({ modalType, closeModal, handleSubmit, data, storeInfo }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [dataProducts, setDataProducts] = useState<Option[]>([])
    const [form, setForm] = useState<any>({
        password: "",
        name: "",
        email: "",
        role: "customer",
    });

    useEffect(() => {
        if (data) {
            setForm({
                name: data?.name,
                email: data?.email,
                phone_number: data?.phone_number,
                // passsword: data?.passsword,
            })
        }
    }, [data])
    useEffect(() => {
        getProducts();
        if (storeInfo?.subdomain && !data) {
            setForm({
                password: storeInfo?.subdomain
            })
        }
    }, [])
    const update = (name: string, value: any) => {
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const onSubmit = (e: any) => {
        e.preventDefault();
        setIsLoading(true)

        handleSubmit(form)
        setIsLoading(false)
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
            title={modalType === "add" ? "Add Customer" : "Edit Customer"}
        >
            <div className="overflow-auto max-h-[80vh] no-scrollbar ">
                <form onSubmit={onSubmit} className="space-y-5">

                    <FormField label="name" name="name" type="text" value={form.name} onChange={update} disabled={isLoading} required />
                    <FormField label="Phone Number" name="phone_number" type="text" value={form.phone_number} onChange={update} disabled={isLoading} />
                    <div className="flex items-center">
                        <FormField label="email" name="email" type="text" value={form.email} onChange={update} disabled={modalType === 'add' ? isLoading : true} required />
                        <div className="mt-6">
                            <FormField label="" name="mail" type="text" value={`@${storeInfo?.subdomain}.net`} onChange={update} disabled={true} />
                        </div>
                    </div>
                    <FormField label="password" name="password" type="password" value={form.password} onChange={update} disabled={isLoading} />
                    {
                        modalType === 'add' ?
                            <i className="text-blue-500 text-[14px]">password default: {storeInfo?.subdomain}</i> :
                            <i className="text-blue-500 text-[14px]">Jika tidak ingin ganti password maka kosongkan aja</i>
                    }
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

export default CreateOrUpdateCustomers;
