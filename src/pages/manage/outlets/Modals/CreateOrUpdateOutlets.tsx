"use client";

import React, { useEffect, useState } from "react";
import FormField from "@/Components/Component/CRUD/FormField";
import Modal from "@/Components/Component/Modal";
import { Save } from "lucide-react";
import { Get } from "@/utils/apiWithToken";
import GoogleMapPicker from "@/Components/Component/CRUD/GoogleMapPicker";

type Props = {
    modalType: string | null;
    closeModal: () => void;
    handleSubmit: (e: any, lat: number, lng: number) => void;
    data: any;
};

type Option = {
    label: string;
    value: string;
}


const CreateOrUpdateOutlets = ({ modalType, closeModal, handleSubmit, data }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [dataCategories, setDataCategories] = useState<Option[]>([]);
    const [location, setLocation] = useState({
        lat: 0,
        lng: 0,
    })

    const [form, setForm] = useState<any>({
        name: "",
        telp: "",
        open_until: "",
        address: "",
        is_open: 1,
    });

    useEffect(() => {
        if (data) {
            setForm({
                name: data?.name,
                telp: data?.telp,
                open_until: data?.open_until,
                address: data?.address,
                is_open: data?.is_open,
            });
            setLocation({
                lat: data?.latitude,
                lng: data?.longitude,
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

        handleSubmit(form, location?.lat, location?.lng)
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

                    <FormField label="Name" name="name" type="text" value={form.name} onChange={update} disabled={isLoading} required />
                    <FormField label="Telephone" name="telp" type="text" value={form.telp} onChange={update} disabled={isLoading} required />
                    <FormField label="Open Until" name="open_until" type="time" value={form.open_until} onChange={update} disabled={isLoading} required />

                    <FormField
                        label="Address"
                        name="address"
                        type="textarea"
                        value={form.address}
                        onChange={update}
                        disabled={isLoading}
                        required />

                    <div className="space-y-4">
                        <h1 className="text-xl font-bold">Pilih Lokasi</h1>

                        <GoogleMapPicker
                            data={data}
                            onChange={(lat, lng) => {
                                setLocation({ lat, lng })
                            }}
                        />

                        <div className="bg-gray-100 p-4 rounded">
                            <p>Latitude: {location.lat}</p>
                            <p>Longitude: {location.lng}</p>
                        </div>
                    </div>
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

export default CreateOrUpdateOutlets;
