import DynamicTable from '@/Components/Component/CRUD/DynamicTable'
import HeaderCrud from '@/Components/Component/CRUD/HeaderCrud';
import LayoutAdmin from '@/Components/Layout/LayoutAdmin';
import { BookText, Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Column } from '@/Components/Component/CRUD/Type';
import { Delete, Get, Post } from '@/utils/apiWithToken';
import Notification from '@/Components/Component/Notification';
import { ClientOrderType } from '@/types/Client/ClientOrders';

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
    const [dataOrders, setDataOrders] = useState<ClientOrderType[]>([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
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


    const columnTable: Column<ClientOrderType>[] = [

        {
            header: "Invoice",
            key: "order_number",
        },
        {
            header: "Shipping Cost",
            key: "amount",
            type: 'rupiah'
        },
        {
            header: "Payment Method",
            key: "payment_method",
            render: (row) => row?.payment_method == 'transfer_bank' ? "Transfer Bank" :
                row?.payment_method == 'qris' ? "Qris" :
                    row?.payment_method == 'virtual_account' ? "Virtual Account" : ""
        },
        {
            header: "Payment Channel",
            key: "payment_channel",
        },
        {
            header: "Payment Code",
            key: "payment_destination",
        },
        {
            header: "Account Name",
            key: "account_name",
        },
        {
            header: "Paid At",
            key: "paid_at",
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

    ]

    const getOrder = async () => {
        try {
            const res = await Get<{ status: string, data: any }>(`/v1/payments?page=${currentPage}&per_page=10&search=${debouncedSearch}&status=paid`);
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
                <HeaderCrud title={"List Paymentex"}
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


            </div>
            {
                showNotif?.isOpen &&
                <Notification onClose={() => setShowNotif(false)} message={showNotif?.message} type={showNotif?.type} />
            }
        </LayoutAdmin>
    )
}

export default PaymentsPage