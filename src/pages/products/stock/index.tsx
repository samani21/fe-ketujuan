import DynamicTable from '@/Components/Component/CRUD/DynamicTable'
import HeaderCrud from '@/Components/Component/CRUD/HeaderCrud';
import LayoutAdmin from '@/Components/Layout/LayoutAdmin';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Column } from '@/Components/Component/CRUD/Type';
import { Delete, Get, Post } from '@/utils/apiWithToken';
import * as Icons from 'lucide-react';
import Notification from '@/Components/Component/Notification';
import { ProductStockType } from '@/types/Client/ProductStock';
import CreateOrUpdateProductStock from './Modals/CreateOrUpdateProductStock';
import ModalDeleteProductStock from './Modals/ModalDeleteProductStock';


const ProductsPage = () => {
    const [modalType, setModalType] = useState<string | null>(null);
    const [datProducts, setDataProducts] = useState<ProductStockType[]>([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [data, setData] = useState<ProductStockType | null>(null);
    const [lastPage, setLastPage] = useState<number>(1);
    const [countData, setCountData] = useState<number>(1);
    const [showNotif, setShowNotif] = useState<any>({
        message: '',
        type: '',
        isOpen: false,
    });

    useEffect(() => {

        getStock()
        setLoading(false);
    }, [debouncedSearch, currentPage, startDate, endDate]);


    const columnTable: Column<ProductStockType>[] = [

        {
            header: "Name Product",
            key: "name",
        },
        {
            header: "Stock",
            key: "stock",
        },
        {
            header: "Date",
            key: "date",
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

    const getStock = async () => {
        try {
            const res = await Get<{ status: string, data: any }>(`/v1/product-stock?page=${currentPage}&per_page=10&search=${debouncedSearch ?? ''}${startDate && `&start_date=${startDate}`}${endDate && `&end_date=${endDate}`}`);
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
                const res = await Post<any, FormData>(`/v1/product-stock/${data?.id}`, form);
                if (res?.status == "success") {
                    {
                        setModalType(null)
                        setData(null)
                    };
                    getStock();
                    setShowNotif({
                        message: res?.message,
                        type: res?.status,
                        isOpen: true
                    })
                }
            } else {
                const res = await Post<any, FormData>('/v1/product-stock', form);
                if (res?.status == "success") {
                    {
                        setModalType(null)
                        setData(null)
                    };
                    getStock();
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
            const res = await Delete<any>(`/v1/product-stock/${data?.id}`);
            if (res?.status == "success") {
                {
                    setModalType(null)
                    setData(null)
                };
                getStock();
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
        <LayoutAdmin>
            <div className='space-y-4'>
                <HeaderCrud title={"List Stock Products"}
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
                        <CreateOrUpdateProductStock modalType={modalType} closeModal={() => {
                            setModalType(null)
                            setData(null)
                        }} handleSubmit={handleSubmit} data={data} /> :
                        <ModalDeleteProductStock modalType={modalType} closeModal={() => {
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

export default ProductsPage