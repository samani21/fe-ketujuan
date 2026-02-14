"use client";

import React, { useState } from "react";
import FormField from "@/Components/Component/CRUD/FormField";
import Modal from "@/Components/Component/Modal";
import { Save } from "lucide-react";
import IconSelectAutocomplete from "../IconSelectAutocomplete";

type Props = {
    modalType: string | null;
    closeModal: () => void;
    handleSubmit: (e: any) => void;
    data: any;
};

const ExampleFormInput = ({ modalType, closeModal }: Props) => {
    const [errors, setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState<any>({
        text: "",
        number: "",
        date: "",
        email: "",
        password: "",
        rupiah: "",
        select: "",
        textarea: "",
        checkbox: false,
        switch: false
    });

    const update = (name: string, value: any) => {
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setIsLoading(true)
        const newErrors: any = {}

        if (!form.date) newErrors.date = "Tanggal wajib diisi"
        if (!form.text) newErrors.text = "Text wajib diisi"
        if (!form.rupiah) newErrors.rupiah = "Rupiah wajib diisi"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            // setIsLoading(false)
            return
        }

        console.log(form)
        // setIsLoading(false)
    }


    return (
        <Modal
            isOpen={modalType === "add" || modalType === 'edit'}
            onClose={closeModal}
            title="Demo Semua Tipe Input"
        >
            <div className="overflow-auto max-h-[80vh] no-scrollbar ">
                <form onSubmit={handleSubmit} className="space-y-5">

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
