import DynamicTable from '@/Components/Component/CRUD/DynamicTable'
import HeaderCrud from '@/Components/Component/CRUD/HeaderCrud';
import LayoutAdmin from '@/Components/Layout/LayoutAdmin';
import { BookText, Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Column } from '@/Components/Component/CRUD/Type';
import { Delete, Get, Post } from '@/utils/apiWithToken';
import Notification from '@/Components/Component/Notification';
import { OrdersType } from '@/types/Client/Orders';

const statusConfig: any = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }, // Tambahan ini
    finished: { label: 'Finished', color: 'bg-green-100 text-green-700 border-green-200' },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    expired: { label: 'Expired', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-700 border-red-200' },
    paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

const PaymentsPage = () => {
    const [modalType, setModalType] = useState<string | null>(null);
    const [dataOrders, setDataOrders] = useState<OrdersType[]>([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [data, setData] = useState<OrdersType | null>(null);
    const [lastPage, setLastPage] = useState<number>(1);
    const [countData, setCountData] = useState<number>(1);
    const [showNotif, setShowNotif] = useState<any>({
        message: '',
        type: '',
        isOpen: false,
    });

    useEffect(() => {

        getOrder()
        setLoading(false);
    }, [debouncedSearch, currentPage]);


    const columnTable: Column<OrdersType>[] = [

        {
            header: "Invoice",
            key: "order_number",
        },
        {
            header: "Subtotal",
            key: "subtotal",
            type: 'rupiah'
        },
        {
            header: "Shipping Cost",
            key: "shipping_cost",
            type: 'rupiah'
        },
        {
            header: "Total Price",
            key: "total_price",
            type: 'rupiah'
        },
        {
            header: "Payment Method",
            key: "payment_method",
            render: (row) => row?.payment_method == 'va_mandiri' ? "Virtual Account Mandiri" : "Transfer " + row?.payment_method.toUpperCase()
        },
        {
            header: "Payment Code",
            key: "payment_destination",
        },
        {
            header: "Approve",
            key: "approve_at",
        },
        {
            header: "Status",
            key: "status",
            render: (row) => {
                const status = row.status?.toLowerCase(); // Memastikan case-insensitive
                const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-600' };

                return (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
                        {config.label}
                    </span>
                );
            }
        },
        {
            header: "Action",
            type: "custom",
            render: (row) => (
                <div className="flex justify-center gap-2 opacity-90 group-hover:opacity-100">
                    <button onClick={() => {
                        setModalType('order')
                        setData(row)
                    }}>
                        <BookText size={16} />
                    </button>
                    <button onClick={() => {
                        setModalType('edit')
                        setData(row)
                    }}>
                        <Edit2 size={16} />
                    </button>
                </div>
            )
        }
    ]

    const getOrder = async () => {
        try {
            const res = await Get<{ status: string, data: any }>(`/v1/front/orders?page=${currentPage}&per_page=10&search=${debouncedSearch}&status=paid`);
            if (res?.status === 'success') {
                setDataOrders(res?.data?.data)
                setLastPage(res?.data?.last_page)
                setCountData(res?.data?.total)
            }
        } catch (e) {

        }
    }


    return (
        <LayoutAdmin>
            <div className='space-y-4'>
                <HeaderCrud title={"List Orders"}
                    // subtitle={"Kelola list kategori"}
                    setModalType={setModalType}
                    debouncedSearch={debouncedSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    loading={loading}
                    setLoading={setLoading}
                    isAdd={false} />
                <DynamicTable
                    columns={columnTable}
                    data={dataOrders}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    lastPage={lastPage}
                    countData={countData}
                />

                {/* {
                    modalType === 'add' || modalType === 'edit' ?
                        <ExampleFormInput modalType={modalType} closeModal={() => {
                            setModalType(null)
                            setData(null)
                        }} handleSubmit={handleSubmit} data={data} /> :
                        <ExampleDelete modalType={modalType} closeModal={() => {
                            setModalType(null)
                            setData(null)
                        }} data={data} handleDelete={(v) => handleDelete()} />
                } */}

            </div>
            {
                showNotif?.isOpen &&
                <Notification onClose={() => setShowNotif(false)} message={showNotif?.message} type={showNotif?.type} />
            }
        </LayoutAdmin>
    )
}

export default PaymentsPage