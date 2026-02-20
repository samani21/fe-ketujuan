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
            header: "Name",
            key: "name",
        },
        {
            header: "Email",
            key: "email",
        },
        {
            header: "Message",
            key: "message",
        },
        {
            header: "Date",
            key: "date",
        },
    ]

    const getStock = async () => {
        try {
            const res = await Get<{ status: string, data: any }>(`/v1/message?page=${currentPage}&per_page=10&search=${debouncedSearch ?? ''}${startDate && `&start_date=${startDate}`}${endDate && `&end_date=${endDate}`}`);
            if (res?.status === 'success') {
                setDataProducts(res?.data?.data)
                setLastPage(res?.data?.last_page)
                setCountData(res?.data?.total)
            }
        } catch (e) {

        }
    }


    return (
        <LayoutAdmin>
            <div className='space-y-4'>
                <HeaderCrud title={"List Contact Message"}
                    // subtitle={"Kelola list kategori"}
                    setModalType={setModalType}
                    debouncedSearch={debouncedSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    loading={loading}
                    setLoading={setLoading}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    isAdd={false} />
                <DynamicTable
                    columns={columnTable}
                    data={datProducts}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    lastPage={lastPage}
                    countData={countData}
                />
            </div>
            {
                showNotif?.isOpen &&
                <Notification onClose={() => setShowNotif(false)} message={showNotif?.message} type={showNotif?.type} />
            }
        </LayoutAdmin>
    )
}

export default ProductsPage