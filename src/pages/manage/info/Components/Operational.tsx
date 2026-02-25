import DynamicTable from '@/Components/Component/CRUD/DynamicTable';
import HeaderCrud from '@/Components/Component/CRUD/HeaderCrud';
import { Column } from '@/Components/Component/CRUD/Type';
import Notification from '@/Components/Component/Notification';
import { OperationalType } from '@/types/Client/Operational';
import { Delete, Get, Post } from '@/utils/apiWithToken';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import CreateOrUpdateOperational from './CreateOrUpdateOperational';
import DeleteOperational from './DeleteOperational';

type Props = {
    dataOperational: OperationalType[];
    getOperational: () => void
}

function Operational({ dataOperational, getOperational }: Props) {
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [lastPage, setLastPage] = useState<number>(1);
    const [countData, setCountData] = useState<number>(1);
    const [data, setData] = useState<OperationalType | null>(null);
    const [showNotif, setShowNotif] = useState<any>({
        message: '',
        type: '',
        isOpen: false,
    });

    useEffect(() => {

        getOperational()
        setLoading(false);
    }, [debouncedSearch, currentPage]);


    const columnTable: Column<OperationalType>[] = [

        {
            header: "Day Start",
            key: "day_start",
        },
        {
            header: "Day End",
            key: "day_end",
        },
        {
            header: "Open Time",
            key: "open_time",
        },
        {
            header: "close Time",
            key: "close_time",
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



    const handleSubmit = async (form: any) => {
        try {
            const formData = new FormData();
            formData.append('day_start', form?.day_start);
            formData.append('day_end', form?.day_end);
            formData.append('open_time', form?.open_time);
            formData.append('close_time', form?.close_time);
            if (data) {
                const res = await Post<any, FormData>(`/v1/business-hour/${data?.id}`, formData);
                if (res?.status == "success") {
                    {
                        setModalType(null)
                        setData(null)
                    };
                    getOperational();
                    setShowNotif({
                        message: res?.message,
                        type: res?.status,
                        isOpen: true
                    })
                }
            } else {
                const res = await Post<any, FormData>('/v1/business-hour', formData);
                if (res?.status == "success") {
                    {
                        setModalType(null)
                        setData(null)
                    };
                    getOperational();
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
            const res = await Delete<any>(`/v1/business-hour/${data?.id}`);
            if (res?.status == "success") {
                {
                    setModalType(null)
                    setData(null)
                };
                getOperational();
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
        <div>
            <div className='space-y-4'>
                <HeaderCrud title={"List Hours Operational"}
                    // subtitle={"Kelola list kategori"}
                    setModalType={setModalType}
                    debouncedSearch={debouncedSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    loading={loading}
                    setLoading={setLoading} />
                <DynamicTable
                    columns={columnTable}
                    data={dataOperational}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    lastPage={lastPage}
                    countData={countData}
                />

                {
                    modalType === 'add' || modalType === 'edit' ?
                        <CreateOrUpdateOperational modalType={modalType} closeModal={() => {
                            setModalType(null)
                            setData(null)
                        }} handleSubmit={handleSubmit} data={data} /> :
                        <DeleteOperational modalType={modalType} closeModal={() => {
                            setModalType(null)
                            setData(null)
                        }} data={data} handleDelete={(v) => handleDelete()} />
                }
            </div>
            {
                showNotif?.isOpen &&
                <Notification onClose={() => setShowNotif(false)} message={showNotif?.message} type={showNotif?.type} />
            }
        </div>
    )
}

export default Operational