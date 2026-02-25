"use client";

import React, { useEffect, useState } from "react";
import FormField from "@/Components/Component/CRUD/FormField";
import Modal from "@/Components/Component/Modal";
import { Save } from "lucide-react";

type Props = {
    modalType: string | null;
    closeModal: () => void;
    handleSubmit: (e: any) => void;
    data: any;
};



const CreateOrUpdateOperational = ({ modalType, closeModal, handleSubmit, data }: Props) => {
    // const [errors, setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState<any>({
        day_start: "",
        day_end: "",
        open_time: "",
        close_time: "",
    });

    useEffect(() => {
        if (data) {
            setForm({
                day_start: data?.day_start,
                day_end: data?.day_end,
                open_time: data?.open_time,
                close_time: data?.close_time,
            })
        }
    }, [data])

    const update = (name: string, value: any) => {
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const onSubmit = (e: any) => {
        e.preventDefault();
        setIsLoading(true)

        handleSubmit(form)
        // setIsLoading(false)
    }


    return (
        <Modal
            isOpen={modalType === "add" || modalType === 'edit'}
            onClose={closeModal}
            title={modalType === "add" ? "Add Operational" : "Edit Operational"}
        >
            <div className="overflow-auto max-h-[80vh] no-scrollbar ">
                <form onSubmit={onSubmit} className="space-y-5">
                    <FormField
                        label="Day Start"
                        name="day_start"
                        type="select"
                        value={form.day_start}
                        options={[
                            { label: "Senin", value: "Senin" },
                            { label: "Selasa", value: "Selasa" },
                            { label: "Rabu", value: "Rabu" },
                            { label: "Kamis", value: "Kamis" },
                            { label: "Jum'at", value: "Jum'at" },
                            { label: "Sabtu", value: "Sabtu" },
                            { label: "Minggu", value: "Minggu" },
                        ]}
                        onChange={update} required
                        disabled={isLoading} />
                    <FormField
                        label="Day end"
                        name="day_end"
                        type="select"
                        value={form.day_end}
                        options={[
                            { label: "Senin", value: "Senin" },
                            { label: "Selasal", value: "Selasa" },
                            { label: "Rabu", value: "Rabu" },
                            { label: "Kamis", value: "Kamis" },
                            { label: "Jum'at", value: "Jum'at" },
                            { label: "Sabtu", value: "Sabtu" },
                            { label: "Minggu", value: "Minggu" },
                        ]}
                        onChange={update} required
                        disabled={isLoading} />
                    <FormField label="Open Time" name="open_time" type="time" value={form.open_time} onChange={update} disabled={isLoading} required />
                    <FormField label="Close Time" name="close_time" type="time" value={form.close_time} onChange={update} disabled={isLoading} required />


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

export default CreateOrUpdateOperational;
