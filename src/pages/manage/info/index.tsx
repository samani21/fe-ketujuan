import FormField from '@/Components/Component/CRUD/FormField';
import LayoutAdmin from '@/Components/Layout/LayoutAdmin';
import { StoreData } from '@/services/storeService';
import api from '@/utils/api';
import { Post } from '@/utils/apiWithToken';
import { CheckCircle2, Database, Globe, Info, LayoutDashboard, Loader2, Mail, Phone, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import SubdomainUpdateModal from './Modal/SubdomainUpdateModal';
import Notification from '@/Components/Component/Notification';
type Props = {}

const InfoPage = () => {
    const [infoStore, setInfoStore] = useState<StoreData | null>(null)
    const [form, setForm] = useState<any>({
        name: "",
        short_name: "",
        description: "",
        logo: null
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [subdomain, setSubdomain] = useState<string>('');
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [showNotif, setShowNotif] = useState<any>({
        message: '',
        type: '',
        isOpen: false,
    });
    useEffect(() => {
        setForm({
            name: infoStore?.name,
            short_name: infoStore?.short_name,
            description: infoStore?.description,
            telp: infoStore?.telp,
            email: infoStore?.email,
            address: infoStore?.address,
            logo: infoStore?.logo,
        })
        setSubdomain(infoStore?.subdomain ?? '');
    }, [infoStore])
    useEffect(() => {
        if (subdomain.length < 3) {
            setIsAvailable(null);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsChecking(true);
            try {
                const response = await api.get(`/check-subdomain?name=${subdomain}`);
                setIsAvailable(response.data.available);
            } catch (error) {
                setIsAvailable(false);
            } finally {
                setIsChecking(false);
            }
        }, 500); // Tunggu 500ms setelah ketikan terakhir

        return () => clearTimeout(delayDebounceFn);
    }, [subdomain]);
    const update = (name: string, value: any) => {
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const formData = new FormData();
            formData.append('name', form?.name);
            formData.append('short_name', form?.short_name);
            formData.append('description', form?.description);
            formData.append('email', form?.email);
            formData.append('telp', form?.telp);
            formData.append('address', form?.address);
            formData.append('subdomain', subdomain);
            if (form?.logo) {
                formData.append('logo', form?.logo ?? null);

            }
            const res = await Post<any, FormData>(`/v1/client-update/${infoStore?.id}`, formData);
            if (res?.status == "success") {
                setIsLoading(false);
                if (infoStore?.subdomain != subdomain) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('client');
                    localStorage.removeItem('user');
                    setIsOpenModal(true);
                }
                setShowNotif({
                    message: res?.message,
                    type: res?.status,
                    isOpen: true
                })
            } else {
                setIsLoading(false);
            }
        } catch (e: any) {
            setIsLoading(false)
        }
        // setIsLoading(false)
    }

    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        setSubdomain(value);
    };

    const isOwnSubdomain = infoStore?.subdomain === subdomain;

    const isTooShort = subdomain.length > 0 && subdomain.length < 3;

    const isValid =
        subdomain.length >= 3 &&
        !isChecking &&
        (isOwnSubdomain || isAvailable === true);

    const isInvalid =
        subdomain.length >= 3 &&
        !isChecking &&
        !isOwnSubdomain &&
        isAvailable === false;

    const borderClass = isTooShort
        ? 'border-slate-200 focus:border-[#1A2D5E]'
        : isValid
            ? 'border-emerald-200 focus:border-emerald-500'
            : isInvalid
                ? 'border-rose-200 focus:border-rose-500'
                : 'border-slate-200 focus:border-[#1A2D5E]';
    return (
        <LayoutAdmin setInfoStore={setInfoStore}>
            <form onSubmit={onSubmit} className="space-y-6 text-slate-800">

                {/* Informasi Utama */}
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-50">
                        <div className='flex items-center gap-2'>
                            <Info className="text-indigo-900" size={20} />
                            <h3 className="font-bold text-slate-800">Informasi Umum</h3>
                        </div>
                        <span className={infoStore?.status ? "bg-green-500 text-[14px] px-4 rounded-full text-gray-100 font-semibold" : "bg-red-500 px-4 rounded-full text-gray-100 font-semibold text-[14px]"}>{infoStore?.status ? "Active" : "Not Active"}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6">

                        <FormField label="Name" name="name" type="text" value={form.name} onChange={update} disabled={isLoading} required />
                        <FormField label="Short Name" name="short_name" type="text" value={form.short_name} onChange={update} disabled={isLoading} required />
                        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={update} disabled={isLoading} />
                        <FormField
                            label="Logo"
                            name="logo"
                            type="image"
                            value={form.logo}
                            onChange={update}
                            disabled={isLoading}
                        />
                        <div className='flex items-center w-full col-span-2 gap-6'>
                            <div className='w-full'>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    URL Toko (Subdomain)
                                </label>

                                <div className="relative group">
                                    <Globe
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1A2D5E] transition-colors"
                                        size={18}
                                    />

                                    <input
                                        value={subdomain}
                                        onChange={handleSubdomainChange}
                                        className={`w-full bg-slate-50 border-2 rounded-2xl py-4 pl-12 pr-28 text-sm font-bold text-[#1A2D5E] outline-none transition-all ${borderClass}`}
                                        placeholder="nama-toko"
                                    />

                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        {isChecking && (
                                            <Loader2 className="animate-spin text-slate-400" size={14} />
                                        )}
                                        <span className="text-[11px] font-black text-slate-400">
                                            .katujuan.net
                                        </span>
                                    </div>
                                </div>

                            </div>
                            <div className='w-full'>
                                {/* --- FEEDBACK --- */}
                                <div className="min-h-[20px] ml-1">
                                    {isTooShort && (
                                        <p className="text-[10px] text-slate-400 font-bold italic">
                                            Minimal 3 karakter...
                                        </p>
                                    )}

                                    {isValid && (
                                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                            <CheckCircle2 size={12} />
                                            Subdomain tersedia!
                                        </p>
                                    )}

                                    {isInvalid && (
                                        <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                                            ⚠️ Subdomain ini sudah digunakan, coba nama lain.
                                        </p>
                                    )}
                                </div>

                                {/* --- PREVIEW --- */}
                                <div
                                    className={`p-4 rounded-2xl border transition-all ${isInvalid
                                        ? 'opacity-50 grayscale border-rose-200 bg-rose-50'
                                        : 'bg-blue-50 border-blue-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#1A2D5E]">
                                            <Globe size={14} />
                                        </div>

                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold text-blue-900/40 uppercase tracking-tighter">
                                                Preview URL Toko Anda:
                                            </p>

                                            <p className="text-xs font-black text-[#1A2D5E] truncate">
                                                https://
                                                <span
                                                    className={`${isInvalid
                                                        ? 'text-rose-500'
                                                        : 'text-blue-950'
                                                        } underline decoration-blue-300 decoration-2 underline-offset-2`}
                                                >
                                                    {subdomain || 'toko-anda'}
                                                </span>
                                                .katujuan.net
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Kontak & Alamat */}
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-50">
                        <Phone className="text-indigo-900" size={20} />
                        <h3 className="font-bold text-slate-800">Kontak & Lokasi</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <FormField label="Email" name="email" type="email" value={form.email} onChange={update} disabled={isLoading} required />
                        <FormField label="Telephone" name="telp" type="text" value={form.telp} onChange={update} disabled={isLoading} required />
                        <FormField label="Address" name="address" type="textarea" value={form.address} onChange={update} disabled={isLoading} required />
                    </div>
                </section>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-all"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-3 bg-indigo-900 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-950 transition-all flex items-center gap-2"
                    >
                        <Save size={20} />
                        Simpan Perubahan
                    </button>
                </div>

            </form>

            {
                isOpenModal &&
                <SubdomainUpdateModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} />
            }
            {
                showNotif?.isOpen &&
                <Notification onClose={() => setShowNotif(false)} message={showNotif?.message} type={showNotif?.type} />
            }
        </LayoutAdmin>
    )
}

export default InfoPage