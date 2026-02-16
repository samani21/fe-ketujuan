import DynamicTable from '@/Components/Component/CRUD/DynamicTable'
import HeaderCrud from '@/Components/Component/CRUD/HeaderCrud';
import LayoutAdmin from '@/Components/Layout/LayoutAdmin';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Column } from '@/Components/Component/CRUD/Type';
import { Delete, Get, Post } from '@/utils/apiWithToken';
import * as Icons from 'lucide-react';
import Notification from '@/Components/Component/Notification';
import CreateOrUpdateOutlets from './Modals/CreateOrUpdateOutlets';
import DeleteOutlets from './Modals/DeleteOutlets';
import { OutletType } from '@/types/Outlet';


const OutletsPage = () => {
    const [modalType, setModalType] = useState<string | null>(null);
    const [datProducts, setOutlets] = useState<OutletType[]>([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [data, setData] = useState<OutletType | null>(null);
    const [lastPage, setLastPage] = useState<number>(1);
    const [countData, setCountData] = useState<number>(1);
    const [showNotif, setShowNotif] = useState<any>({
        message: '',
        type: '',
        isOpen: false,
    });

    useEffect(() => {

        getOulets()
        setLoading(false);
    }, [debouncedSearch, currentPage]);


    const columnTable: Column<OutletType>[] = [

        {
            header: "Name Outlet",
            key: "name",
        },

        {
            header: "Address",
            key: "address",
        },
        {
            header: "Telephone",
            key: "telp",
        },
        {
            header: "Latitude",
            key: "latitude",
        },
        {
            header: "Longitude",
            key: "longitude",
        },
        {
            header: "Status Stock",
            key: "status_stock",
            render: (row) => (
                <div className='flex items-center'>
                    <button
                        onClick={() => handleOpen(row)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${row.is_open ? 'bg-[var(--primary-color)]' : 'bg-neutral-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${row.is_open ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className={`ml-3 text-xs font-bold ${row.is_open ? 'text-[var(--primary-color)]' : 'text-neutral-400'}`}>
                        {row.is_open ? 'Buka' : 'Tutup'}
                    </span>
                </div>
            )
        },
        {
            header: "Action",
            type: "custom",
            render: (row) => (
                <div className="flex justify-center gap-2 opacity-90 group-hover:opacity-100">
                    <button onClick={() => {
                        setModalType('edit')
                        setData(row)
                    }}><Edit2 size={16} /></button>
                    <button onClick={() => {
                        setModalType('delete')
                        setData(row)
                    }}><Trash2 size={16} /></button>
                </div>
            )
        }
    ]

    const getOulets = async () => {
        try {
            const res = await Get<{ status: string, data: any }>(`/v1/outlets?page=${currentPage}&per_page=10&search=${debouncedSearch}`);
            if (res?.status === 'success') {
                setOutlets(res?.data?.data)
                setLastPage(res?.data?.last_page)
                setCountData(res?.data?.total)
            }
        } catch (e) {

        }
    }

    const handleSubmit = async (form: any, lat: number, lng: number) => {
        try {
            const formData = new FormData();
            formData.append('name', form?.name);
            formData.append('address', form?.address);
            formData.append('telp', form?.telp);
            formData.append('latitude', String(lat) ?? null);
            formData.append('longitude', String(lng) ?? null);
            formData.append('open_until', form?.open_until);
            if (data) {
                const res = await Post<any, FormData>(`/v1/outlets/${data?.id}`, formData);
                if (res?.status == "success") {
                    {
                        setModalType(null)
                        setData(null)
                    };
                    getOulets();
                    setShowNotif({
                        message: res?.message,
                        type: res?.status,
                        isOpen: true
                    })
                }
            } else {
                const res = await Post<any, FormData>('/v1/outlets', formData);
                if (res?.status == "success") {
                    {
                        setModalType(null)
                        setData(null)
                    };
                    getOulets();
                    setShowNotif({
                        message: res?.message,
                        type: res?.status,
                        isOpen: true
                    })
                }
            }
        } catch (e) {
            setShowNotif({
                message: "Gagal proses",
                type: "error",
                isOpen: true

            })
        }
    }
    const handleDelete = async () => {
        try {
            const res = await Delete<any>(`/v1/outlets/${data?.id}`);
            if (res?.status == "success") {
                {
                    setModalType(null)
                    setData(null)
                };
                getOulets();
                setShowNotif({
                    message: res?.message,
                    type: res?.status,
                    isOpen: true
                })
            }
        } catch (e) {
            setShowNotif({
                message: "Gagal proses",
                type: "error",
                isOpen: true

            })
        }
    }
    const handleOpen = async (row: OutletType) => {
        const formData = new FormData();
        formData.append('is_open', row?.is_open ? "0" : "1")
        const res = await Post<any, FormData>(`/v1/outlets/${row?.id}`, formData);
        if (res?.status == "success") {
            {
                setModalType(null)
                setData(null)
            };
            getOulets();
            setShowNotif({
                message: res?.message,
                type: res?.status,
                isOpen: true
            })
        }
    }
    return (
        <LayoutAdmin>
            <div className='space-y-4'>
                <HeaderCrud title={"List Outlete"}
                    // subtitle={"Kelola list kategori"}
                    setModalType={setModalType}
                    debouncedSearch={debouncedSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    loading={loading}
                    setLoading={setLoading} />
                <DynamicTable
                    columns={columnTable}
                    data={datProducts}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    lastPage={lastPage}
                    countData={countData}
                />

                {
                    modalType === 'add' || modalType === 'edit' ?
                        <CreateOrUpdateOutlets modalType={modalType} closeModal={() => {
                            setModalType(null)
                            setData(null)
                        }} handleSubmit={handleSubmit} data={data} /> :
                        <DeleteOutlets modalType={modalType} closeModal={() => {
                            setModalType(null)
                            setData(null)
                        }} data={data} handleDelete={(v) => handleDelete()} />
                }
            </div>
            {
                showNotif?.isOpen &&
                <Notification onClose={() => setShowNotif(false)} message={showNotif?.message} type={showNotif?.type} />
            }
        </LayoutAdmin>
    )
}

export default OutletsPage