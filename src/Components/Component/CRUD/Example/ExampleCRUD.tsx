import DynamicTable from '@/Components/Component/CRUD/DynamicTable'
import HeaderCrud from '@/Components/Component/CRUD/HeaderCrud';
import LayoutAdmin from '@/Components/Layout/LayoutAdmin';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Column } from '@/Components/Component/CRUD/Type';
import { Delete, Get, Post } from '@/utils/apiWithToken';
import * as Icons from 'lucide-react';
import Notification from '@/Components/Component/Notification';
import { ProductsType } from '@/types/Client/Products'; import ExampleFormInput from './ExampleFormInput';
import ExampleDelete from './ExampleDelete';
;


const ProductsPage = () => {
    const [modalType, setModalType] = useState<string | null>(null);
    const [datProducts, setDataProducts] = useState<ProductsType[]>([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [data, setData] = useState<ProductsType | null>(null);
    const [lastPage, setLastPage] = useState<number>(1);
    const [countData, setCountData] = useState<number>(1);
    const [showNotif, setShowNotif] = useState<any>({
        message: '',
        type: '',
        isOpen: false,
    });

    useEffect(() => {

        getProducts()
        setLoading(false);
    }, [debouncedSearch, currentPage]);


    const columnTable: Column<ProductsType>[] = [
        {
            header: "Image",
            key: "custom",
            render: (row) => (
                <img src={row?.image} className='w-32' />
            )
        },
        {
            header: "Name Product",
            key: "name",
        },
        {
            header: "Name Category",
            key: "category.name",
            render: (row) => row.category?.name ?? "-"
        },
        {
            header: "Price",
            key: "price",
            type: "rupiah",
        },
        {
            header: "Description",
            key: "description",
        },
        {
            header: "Status Stock",
            key: "status_stock",
            render: (row) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${row?.status_stock ? "bg-green-100" : "bg-red-100"}`}>
                    {row?.status_stock ? "Tersedia" : "Habis"}
                </span>
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

    const getProducts = async () => {
        try {
            const res = await Get<{ status: string, data: any }>(`/v1/products?page=${currentPage}&per_page=10&search=${debouncedSearch}`);
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
            const formData = new FormData();
            formData.append('category_id', form?.category_id);
            formData.append('name', form?.name);
            formData.append('price', form?.price);
            formData.append('description', form?.description);
            formData.append('image', form?.image ?? null);
            if (data) {
                const res = await Post<any, FormData>(`/v1/products/${data?.id}`, formData);
                if (res?.status == "success") {
                    {
                        setModalType(null)
                        setData(null)
                    };
                    getProducts();
                    setShowNotif({
                        message: res?.message,
                        type: res?.status,
                        isOpen: true
                    })
                }
            } else {
                const res = await Post<any, FormData>('/v1/products', formData);
                if (res?.status == "success") {
                    {
                        setModalType(null)
                        setData(null)
                    };
                    getProducts();
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
            const res = await Delete<any>(`/v1/products/${data?.id}`);
            if (res?.status == "success") {
                {
                    setModalType(null)
                    setData(null)
                };
                getProducts();
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
                <HeaderCrud title={"List Category"}
                    subtitle={"Kelola list kategori"}
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
                        <ExampleFormInput modalType={modalType} closeModal={() => {
                            setModalType(null)
                            setData(null)
                        }} handleSubmit={handleSubmit} data={data} /> :
                        <ExampleDelete modalType={modalType} closeModal={() => {
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