import Modal from '@/Components/Component/Modal'
import { AlertCircle } from 'lucide-react'
import React from 'react'

type Props = {
    modalType: string | null;
    closeModal: () => void;
    handleDelete: (val: number) => void;
    data?: any;
}

const ModalDeleteProducts = ({ modalType, closeModal, handleDelete, data }: Props) => {
    return (
        <Modal isOpen={modalType === 'delete'} onClose={closeModal} title="Konfirmasi">
            <div className="text-center py-4">
                <AlertCircle size={48} className="text-rose-500 mx-auto mb-3" />
                <p className="text-slate-600">Yakin ingin menghapus data {data?.name} ini?</p>
                <div className="flex justify-end pt-4">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button onClick={() => handleDelete(data?.id)} className="px-6 py-2 bg-rose-600 text-white text-sm font-bold rounded-xl shadow-md">Hapus</button>
                </div>

            </div>
        </Modal>
    )
}

export default ModalDeleteProducts