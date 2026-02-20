import DynamicTable from '@/Components/Component/CRUD/DynamicTable'
import HeaderCrud from '@/Components/Component/CRUD/HeaderCrud';
import LayoutAdmin from '@/Components/Layout/LayoutAdmin';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Column } from '@/Components/Component/CRUD/Type';
import { Delete, Get, Post } from '@/utils/apiWithToken';
import { ProductCategorieType } from '@/types/Client/ProductCategories';
import * as Icons from 'lucide-react';
import CreateOrUpdateCategories from './Modal/CreateOrUpdateCategories';
import Notification from '@/Components/Component/Notification';
import DeleteCategories from './Modal/DeleteCategories';


const CategoriesPage = () => {
    const [modalType, setModalType] = useState<string | null>(null);
    const [dataCategories, setDataCategories] = useState<ProductCategorieType[]>([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [data, setData] = useState<ProductCategorieType | null>(null);
    const [lastPage, setLastPage] = useState<number>(1);
    const [countData, setCountData] = useState<number>(1);
    const [showNotif, setShowNotif] = useState<any>({
        message: '',
        type: '',
        isOpen: false,
    });

    useEffect(() => {

        getCategories()
        setLoading(false);
    }, [debouncedSearch, currentPage]);


    const columnTable: Column<ProductCategorieType>[] = [
        {
            header: "Name Category",
            key: "name",
        },
        {
            header: "Icon",
            key: "icon",
            render: (row) => {
                const LucideIcon = row.icon && (Icons as any)[row.icon];
                return LucideIcon ? (
                    <LucideIcon className="w-6 h-6" />
                ) : (
                    "-"
                )
            }
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

    const getCategories = async () => {
        try {
            const res = await Get<{ status: string, data: any }>(`/v1/product-categorie?page=${currentPage}&per_page=10&search=${debouncedSearch}`);
            if (res?.status === 'success') {
                setDataCategories(res?.data?.data)
                setLastPage(res?.data?.last_page)
                setCountData(res?.data?.total)
            }
        } catch (e) {

        }
    }

    const handleSubmit = async (form: any) => {
        try {
            if (data) {
                const res = await Post<any, FormData>(`/v1/product-categorie/${data?.id}`, form);
                if (res?.status == "success") {
                    {
                        setModalType(null)
                        setData(null)
                    };
                    getCategories();
                    setShowNotif({
                        message: res?.message,
                        type: res?.status,
                        isOpen: true
                    })
                }
            } else {
                const res = await Post<any, FormData>('/v1/product-categorie', form);
                if (res?.status == "success") {
                    {
                        setModalType(null)
                        setData(null)
                    };
                    getCategories();
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
            const res = await Delete<any>(`/v1/product-categorie/${data?.id}`);
            if (res?.status == "success") {
                {
                    setModalType(null)
                    setData(null)
                };
                getCategories();
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
                    data={dataCategories}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    lastPage={lastPage}
                    countData={countData}
                />

                {
                    modalType === 'add' || modalType === 'edit' ?
                        <CreateOrUpdateCategories modalType={modalType} closeModal={() => {
                            setModalType(null)
                            setData(null)
                        }} handleSubmit={handleSubmit} data={data} /> :
                        <DeleteCategories modalType={modalType} closeModal={() => {
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

export default CategoriesPage