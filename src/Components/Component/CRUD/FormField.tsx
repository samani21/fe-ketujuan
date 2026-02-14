import React from 'react'

type Option = {
    label: string;
    value: string;
}

type Props = {
    label: string;
    name: string;
    type?:
    | 'text'
    | 'number'
    | 'date'
    | 'email'
    | 'password'
    | 'select'
    | 'rupiah'
    | 'textarea'
    | 'checkbox'
    | 'switch';

    value: any;
    onChange: (name: string, value: any) => void;
    options?: Option[];
    required?: boolean;
    error?: string;
    disabled?: boolean;
}

const formatRupiah = (value: number | '') => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(value);
}

const FormField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    options = [],
    required,
    error,
    disabled
}: Props) => {

    const baseClass = `
        w-full px-4 py-3 border rounded-xl outline-none
        text-sm font-medium transition-all
        ${disabled
            ? 'bg-slate-100 cursor-not-allowed text-slate-400'
            : 'bg-[#F8FAFC]'
        }
        ${error
            ? 'border-red-500 focus:border-red-500'
            : 'border-slate-200 focus:border-[var(--primary-color)]'
        }
    `

    const handleInput = (e: any) => {
        if (disabled) return;
        onChange(name, e.target.value);
    }

    const handleCheckbox = (e: any) => {
        if (disabled) return;
        onChange(name, e.target.checked);
    }

    const handleRupiah = (e: any) => {
        if (disabled) return;
        const raw = e.target.value.replace(/\D/g, '');
        onChange(name, raw ? Number(raw) : '');
    }

    return (
        <div className="space-y-1.5">
            {type !== 'checkbox' && type !== 'switch' && (
                <label className={`text-[10px] font-black uppercase tracking-widest ${disabled ? 'text-slate-300' : 'text-slate-400'}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* SELECT */}
            {type === 'select' && (
                <select
                    disabled={disabled}
                    required={required}
                    value={value}
                    onChange={handleInput}
                    className={baseClass}
                >
                    <option value="">Pilih...</option>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            )}

            {/* TEXTAREA */}
            {type === 'textarea' && (
                <textarea
                    disabled={disabled}
                    required={required}
                    value={value}
                    onChange={handleInput}
                    className={baseClass}
                    rows={4}
                />
            )}

            {/* CHECKBOX */}
            {type === 'checkbox' && (
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={value}
                        disabled={disabled}
                        onChange={handleCheckbox}
                    />
                    <span>{label}</span>
                </label>
            )}

            {/* SWITCH */}
            {type === 'switch' && (
                <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={value}
                            disabled={disabled}
                            onChange={handleCheckbox}
                        />
                        <div className="w-10 h-5 bg-slate-300 rounded-full peer-checked:bg-[var(--primary-color)]"></div>
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                    </div>
                    <span>{label}</span>
                </label>
            )}

            {/* INPUT */}
            {!['select', 'textarea', 'checkbox', 'switch'].includes(type) && (
                <input
                    type={type === 'rupiah' ? 'text' : type}
                    disabled={disabled}
                    required={required}
                    value={type === 'rupiah' ? formatRupiah(value) : value}
                    onChange={type === 'rupiah' ? handleRupiah : handleInput}
                    className={baseClass}
                />
            )}

            {error && (
                <p className="text-xs text-red-500 font-medium">
                    {error}
                </p>
            )}
        </div>
    )
}

export default FormField
