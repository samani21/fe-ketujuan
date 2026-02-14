"use client";

import React, { useEffect, useState } from "react";
import FormField from "@/Components/Component/CRUD/FormField";
import Modal from "@/Components/Component/Modal";
import { Save } from "lucide-react";
import IconSelectAutocomplete from "@/Components/Component/CRUD/IconSelectAutocomplete";
import { Post } from "@/utils/apiWithToken";
import { ProductCategorieType } from "@/types/Client/ProductCategories";

type Props = {
    modalType: string | null;
    closeModal: () => void;
    handleSubmit: (e: any) => void;
    data: ProductCategorieType | null;
};

const CreateOrUpdateCategories = ({ modalType, closeModal, handleSubmit, data }: Props) => {
    const [errors, setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState<any>({
        name: "",
        icon: "",
    });

    const update = (name: string, value: any) => {
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };
    useEffect(() => {
        if (data) {
            setForm({
                name: data?.name,
                icon: data?.icon,
            })
        }
    }, [data])
    const submit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true)
        const newErrors: any = {}

        if (!form.name) newErrors.name = "Nama kategori wajib diisi"


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return
        }
        handleSubmit(form)
    }


    return (
        <Modal
            isOpen={modalType === "add" || modalType === 'edit'}
            onClose={closeModal}
            title="Demo Semua Tipe Input"
        >
            <div className="overflow-auto max-h-[80vh] no-scrollbar ">
                <form onSubmit={submit} className="space-y-5">
                    <IconSelectAutocomplete
                        value={''}
                        onChange={update}
                        disabled={isLoading}
                        data={data}
                    />
                    <FormField label="text" name="name" type="text" value={form.name} onChange={update} disabled={isLoading} required />
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

export default CreateOrUpdateCategories;
