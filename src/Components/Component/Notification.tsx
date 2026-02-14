import { CheckCircle2, XCircle } from 'lucide-react';
import React, { useEffect } from 'react'

type Props = {
    message: string;
    type: string;
    onClose: () => void;
}

const Notification = ({ message, type, onClose }: Props) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';

    return (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${isSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                {isSuccess ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                <span className="font-medium text-sm">{message}</span>
            </div>
        </div>
    );
};

export default Notification