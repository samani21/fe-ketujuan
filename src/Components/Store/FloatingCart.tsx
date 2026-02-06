import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, ShoppingBag } from 'lucide-react'
import React from 'react'

type Props = {
    cartCount: number;
    cartTotal: number;
    setIsCheckoutOpen: (v: boolean) => void;
}

const FloatingCartStore = ({ cartCount, cartTotal, setIsCheckoutOpen }: Props) => {
    return (
        <AnimatePresence>
            {cartCount > 0 && (
                <motion.div
                    initial={{ y: 100, x: '-50%' }}
                    animate={{ y: 0, x: '-50%' }}
                    exit={{ y: 100, x: '-50%' }}
                    className="fixed bottom-4 left-1/2 w-[92%] max-w-md z-50"
                >
                    <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(6,78,59,0.3)] flex items-center justify-between border border-white/10">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="bg-white/10 p-2.5 rounded-xl">
                                    <ShoppingBag size={20} />
                                </div>
                                <span className="absolute -top-1 -right-1 bg-white text-emerald-900 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] text-emerald-200/70 font-medium uppercase tracking-wider">Total</p>
                                <p className="font-bold text-sm">Rp {cartTotal.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            className="bg-white text-emerald-900 px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-1 active:bg-neutral-100"
                        >
                            <span>Checkout</span>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default FloatingCartStore