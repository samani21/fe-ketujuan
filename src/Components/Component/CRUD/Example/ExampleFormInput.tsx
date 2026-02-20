"use client";

import React, { useEffect, useState } from "react";
import FormField from "@/Components/Component/CRUD/FormField";
import Modal from "@/Components/Component/Modal";
import { Save } from "lucide-react";
import IconSelectAutocomplete from "../IconSelectAutocomplete";
import { Get } from "@/utils/apiWithToken";

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


const ExampleFormInput = ({ modalType, closeModal, handleSubmit, data }: Props) => {
    const [errors, setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [dataCategories, setDataCategories] = useState<Option[]>([])
    const [form, setForm] = useState<any>({
        category_id: "",
        name: "",
        description: "",
        price: "",
        image: null,
    });

    useEffect(() => {
        if (data) {
            setForm({
                name: data?.name,
                image: data?.image,
                description: data?.description,
                price: data?.price,
                category_id: data?.category_id,
            })
        }
    }, [data])
    useEffect(() => {
        getCategories();
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
    const getCategories = async () => {
        try {
            const res = await Get<{ status: string, data: any }>(`/v1/product-categorie?per_page=10000`);
            if (res?.status === 'success') {
                const categories = res?.data?.data?.map((item: any) => ({
                    label: item.name,   // sesuaikan dengan field API
                    value: item.id,
                })) ?? [];

                setDataCategories(categories);
            }
        } catch (e) {

        }
    }




    return (
        <Modal
            isOpen={modalType === "add" || modalType === 'edit'}
            onClose={closeModal}
            title="Demo Semua Tipe Input"
        >
            <div className="overflow-auto max-h-[80vh] no-scrollbar ">
                <form onSubmit={onSubmit} className="space-y-5">

                    <FormField label="text" name="text" type="text" value={form.text} onChange={update} disabled={isLoading} required />

                    <FormField label="number" name="number" type="number" value={form.number} onChange={update} disabled={isLoading} />

                    <FormField label="date" name="date" type="date" value={form.date} onChange={update} disabled={isLoading} />

                    <FormField label="email" name="email" type="email" value={form.email} onChange={update} disabled={isLoading} />

                    <FormField label="password" name="password" type="password" value={form.password} onChange={update} disabled={isLoading} />

                    <FormField label="rupiah" name="rupiah" type="rupiah" value={form.rupiah} onChange={update} disabled={isLoading} />

                    <FormField
                        label="select"
                        name="select"
                        type="select"
                        value={form.select}
                        options={[
                            { label: "Option 1", value: "1" },
                            { label: "Option 2", value: "2" }
                        ]}
                        onChange={update}
                        disabled={isLoading} />

                    <FormField
                        label="textarea"
                        name="textarea"
                        type="textarea"
                        value={form.textarea}
                        onChange={update}
                        disabled={isLoading} />

                    <FormField
                        label="checkbox"
                        name="checkbox"
                        type="checkbox"
                        value={form.checkbox}
                        onChange={update}
                        disabled={isLoading} />

                    <FormField
                        label="switch"
                        name="switch"
                        type="switch"
                        value={form.switch}
                        onChange={update}
                        disabled={isLoading} />

                    <IconSelectAutocomplete
                        value={''}
                        onChange={update}
                        disabled={isLoading}
                        data={null}
                    />
                    <FormField
                        label="Foto Produk"
                        name="image"
                        type="image"
                        value={form.image}
                        onChange={update}
                        disabled={isLoading}
                    />
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

export default ExampleFormInput;
