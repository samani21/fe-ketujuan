import { OrdersType } from '@/types/Client/Orders';
import { AlertCircle, Ban, CheckCircle2, Clock, Clock4, CreditCard, ExternalLink, Package, Receipt, Truck, X, XCircle } from 'lucide-react'
import React from 'react'

type Props = {
    closeModal: () => void;
    data: OrdersType | null;
    handleUpdateStatus: (id: number, status: string) => void;
}
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};
const OrderDetailModal = ({ closeModal, data, handleUpdateStatus }: Props) => {
    // Helper untuk styling status
    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'finished':
            case 'paid':
                return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle2 size={16} /> };
            case 'processing':
            case 'pending':
                return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Clock4 size={16} /> };
            case 'expired':
                return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Clock size={16} /> };
            case 'failed':
                return { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={16} /> };
            default:
                return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <AlertCircle size={16} /> };
        }
    };

    const statusStyle = getStatusStyles(data?.status ?? '');

    const renderActions = () => {
        const status = data?.status?.toLowerCase();

        const ActionButton = ({ onClick, label, icon: Icon, variant = "primary" }: { onClick: string, label: string, icon: any, variant?: string }) => (
            <button
                onClick={() => handleUpdateStatus && data && handleUpdateStatus(data?.id, onClick)}
                className={`flex-1 sm:flex-none px-6 py-2.5 text-xs font-black rounded-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest ${variant === "primary"
                    ? "bg-[var(--primary-color)]/80 text-white hover:bg-[var(--primary-color)] shadow-[var(--primary-color)]/1"
                    : "bg-red-50 text-red-600 hover:bg-red-100 shadow-red-50"
                    }`}
            >
                {Icon && <Icon size={14} />}
                {label}
            </button>
        );

        if (status === 'pending') {
            return (
                <>
                    <ActionButton onClick="failed" label="Tolak Pesanan" icon={Ban} variant="danger" />
                    <ActionButton onClick="paid" label="Terima Pembayaran" icon={CheckCircle2} />
                </>
            );
        }

        if (status === 'paid') {
            return (
                <>
                    <ActionButton onClick="failed" label="Kembalikan / Gagal" icon={XCircle} variant="danger" />
                    <ActionButton onClick="processing" label="Proses Pesanan" icon={Clock4} />
                </>
            );
        }

        if (status === 'processing') {
            return (
                <ActionButton onClick="finished" label="Selesaikan Pesanan" icon={Package} />
            );
        }

        return (
            <button
                onClick={closeModal}
                className="px-8 py-2.5 text-xs font-black bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest"
            >
                Tutup
            </button>
        );
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col scale-100 transition-transform">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--primary-color)] rounded-lg text-white">
                            <Receipt size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">Detail Pesanan</h3>
                            <p className="text-sm text-gray-500 font-medium">{data?.order_number}</p>
                        </div>
                    </div>
                    <button
                        onClick={closeModal}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Top Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-2 mb-2 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                                <Clock size={14} /> Waktu Pesanan
                            </div>
                            <p className="text-gray-900 font-bold">{data?.created_at && new Date(data?.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-2 mb-2 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                                <CreditCard size={14} /> Metode Pembayaran
                            </div>
                            <p className="text-gray-900 font-bold">{data?.client_order?.payment_method == 'virtual_account' ? "Virtual Account " : "Transfer "}{data?.client_order?.payment_channel}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-2 mb-2 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-[var(--primary-color)]"></span> Status Terkini
                            </div>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${statusStyle.bg} ${statusStyle.text}`}>
                                {statusStyle.icon}
                                {data?.status}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                                <Package size={14} /> Item Pesanan ({data?.items?.length || 0})
                            </h4>
                            <div className="space-y-3">
                                {data?.items?.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                                        <div className="h-16 w-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">{item.product.name}</p>
                                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{item.product.category}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-xs font-bold text-gray-500">
                                                    {item.quantity} x <span className="text-gray-700">{formatCurrency(item.price_at_purchase)}</span>
                                                </p>
                                                <p className="text-sm font-black text-[var(--primary-color)]">
                                                    {formatCurrency(item.quantity * item.price_at_purchase)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Payment Summary & Evidence */}
                        <div className="space-y-6">
                            {/* Payment Summary */}
                            <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-xl shadow-gray-200">
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Ringkasan Biaya</h4>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between text-gray-400 font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-gray-200 font-bold">{formatCurrency(data?.subtotal ?? 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 font-medium">
                                        <span>Biaya Kirim</span>
                                        <span className="text-gray-200 font-bold">{formatCurrency(data?.shipping_cost ?? 0)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                                        <span className="font-bold text-white uppercase text-xs tracking-wider">Total Harga</span>
                                        <span className="text-2xl font-black text-white">
                                            {formatCurrency(data?.total_price ?? 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Evidence */}
                            <div className="p-5 border border-gray-100 rounded-3xl bg-gray-50/30 space-y-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Bukti Transfer</h4>
                                {data?.client_order.payment_proof_url ? (
                                    <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-white border border-gray-200 shadow-sm">
                                        <img
                                            src={data?.client_order?.payment_proof_url}
                                            alt="Proof"
                                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
                                        />
                                        <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button onClick={() => window.open(data?.client_order?.payment_proof_url, '_blank')} className="bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-black shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                <ExternalLink size={14} /> LIHAT DETAIL
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-300">
                                        <CreditCard size={32} className="mb-2 opacity-20" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Menunggu Unggahan</p>
                                    </div>
                                )}
                                <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Kode Bayar</p>
                                    <p className="text-xs font-mono font-black text-[var(--primary-color)] truncate">
                                        {data?.client_order?.payment_destination || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-5 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:block">
                        Terakhir diupdate: {new Date().toLocaleDateString('id-ID')}
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        {renderActions()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailModal