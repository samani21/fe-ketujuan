import DynamicTable from '@/Components/Component/CRUD/DynamicTable'
import HeaderCrud from '@/Components/Component/CRUD/HeaderCrud';
import LayoutAdmin from '@/Components/Layout/LayoutAdmin';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Column } from '@/Components/Component/CRUD/Type';
import { Delete, Get, Post } from '@/utils/apiWithToken';
import * as Icons from 'lucide-react';
import Notification from '@/Components/Component/Notification';
import { ProductsType } from '@/types/Client/Products';
import ModalDeleteProducts from './Modals/ModalDeleteProducts';
import CreateOrUpdateProducts from './Modals/CreateOrUpdateProducts';


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
                <img src={row?.image} className='w-32 h-32 object-cover' />
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
            header: "Stock",
            key: "stock",
            render: (row) => (
                <div>{row?.stock ?? 0}</div>
            )
        },
        {
            header: "Status Stock",
            key: "status_stock",
            render: (row) => (
                <div className='flex items-center'>
                    <button
                        onClick={() => handleToggleStock(row)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${row.status_stock ? 'bg-[var(--primary-color)]' : 'bg-neutral-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${row.status_stock ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className={`ml-3 text-xs font-bold ${row.status_stock ? 'text-[var(--primary-color)]' : 'text-neutral-400'}`}>
                        {row.status_stock ? 'Tersedia' : 'Habis'}
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

    const handleToggleStock = async (row: ProductsType) => {
        const formData = new FormData();
        formData.append('status_stock', row?.status_stock ? "0" : "1")
        const res = await Post<any, FormData>(`/v1/products/${row?.id}`, formData);
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
    return (
        <LayoutAdmin>
            <div className='space-y-4'>
                <HeaderCrud title={"List Products"}
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
                        <CreateOrUpdateProducts modalType={modalType} closeModal={() => {
                            setModalType(null)
                            setData(null)
                        }} handleSubmit={handleSubmit} data={data} /> :
                        <ModalDeleteProducts modalType={modalType} closeModal={() => {
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