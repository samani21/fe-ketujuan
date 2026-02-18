import DynamicTable from '@/Components/Component/CRUD/DynamicTable'
import HeaderCrud from '@/Components/Component/CRUD/HeaderCrud';
import LayoutAdmin from '@/Components/Layout/LayoutAdmin';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Column } from '@/Components/Component/CRUD/Type';
import { Delete, Get, Post } from '@/utils/apiWithToken';
import * as Icons from 'lucide-react';
import Notification from '@/Components/Component/Notification';
import CreateOrUpdateCustomers from './Modals/CreateOrUpdateCustomers';
import { StoreData } from '@/services/storeService';
import { CustomersType } from '@/types/Client/Customes';
import ModalDeleteCustomers from './Modals/ModalDeleteCustomers';


const CustomersPage = () => {
    const [modalType, setModalType] = useState<string | null>(null);
    const [datProducts, setDataProducts] = useState<CustomersType[]>([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [data, setData] = useState<CustomersType | null>(null);
    const [lastPage, setLastPage] = useState<number>(1);
    const [countData, setCountData] = useState<number>(1);
    const [showNotif, setShowNotif] = useState<any>({
        message: '',
        type: '',
        isOpen: false,
    });
    const [storeInfo, setStoreInfo] = useState<StoreData | null>(null)

    useEffect(() => {

        getCustomers()
        setLoading(false);
    }, [debouncedSearch, currentPage, startDate, endDate]);


    const columnTable: Column<CustomersType>[] = [

        {
            header: "Name Product",
            key: "name",
        },
        {
            header: "Email",
            key: "email",
        },
        {
            header: "Phone Number",
            key: "phone_number",
        },
        {
            header: "Created_at",
            key: "created_at",
            type: "datetime"
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

    const getCustomers = async () => {
        try {
            const res = await Get<{ status: string, data: any }>(`/v1/client-user?page=${currentPage}&per_page=10&search=${debouncedSearch ?? ''}${startDate && `&start_date=${startDate}`}${endDate && `&end_date=${endDate}`}&order_by_role=customer`);
            if (res?.status === 'success') {
                setDataProducts(res?.data?.data)
                setLastPage(res?.data?.last_page)
                setCountData(res?.data?.total)
            }
        } catch (e) {

        }
    }

    const handleSubmit = async (form: any) => {
        try {

            if (data) {
                const res = await Post<any, FormData>(`/v1/client-user/${data?.id}`, form);
                if (res?.status == "success") {
                    {
                        setModalType(null)
                        setData(null)
                    };
                    getCustomers();
                    setShowNotif({
                        message: res?.message,
                        type: res?.status,
                        isOpen: true
                    })
                }
            } else {
                const res = await Post<any, FormData>('/v1/client-user', form);
                if (res?.status == "success") {
                    {
                        setModalType(null)
                        setData(null)
                    };
                    getCustomers();
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
            const res = await Delete<any>(`/v1/client-user/${data?.id}`);
            if (res?.status == "success") {
                {
                    setModalType(null)
                    setData(null)
                };
                getCustomers();
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
    return (
        <LayoutAdmin setInfoStore={setStoreInfo}>
            <div className='space-y-4'>
                <HeaderCrud title={"List Customers"}
                    // subtitle={"Kelola list kategori"}
                    setModalType={setModalType}
                    debouncedSearch={debouncedSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    loading={loading}
                    setLoading={setLoading}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate} />
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
                        <CreateOrUpdateCustomers modalType={modalType} closeModal={() => {
                            setModalType(null)
                            setData(null)
                        }} handleSubmit={handleSubmit} data={data} storeInfo={storeInfo} /> :
                        <ModalDeleteCustomers modalType={modalType} closeModal={() => {
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

export default CustomersPage