import React from 'react';
import { ShoppingBag, ArrowRight, X } from 'lucide-react';

export default function FloatingCartBar({ cartItems, onOpenCheckout, onClearCart }) {
  if (!cartItems || cartItems.length === 0) return null;

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + ((parseFloat(item.price) || 0) * item.quantity), 0);

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 md:right-10 z-40 animate-in slide-in-from-bottom duration-300">
      <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-indigo-500/40 shadow-2xl bg-slate-900/95 backdrop-blur-xl flex items-center justify-between sm:justify-start gap-3 sm:gap-6 text-white">
        
        {/* Cart Icon Badge */}
        <div className="relative cursor-pointer" onClick={onOpenCheckout}>
          <div className="w-12 h-12 rounded-xl bg-indigo-600 border border-indigo-400/50 flex items-center justify-center text-white shadow-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[11px] font-extrabold w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md">
            {totalQuantity}
          </span>
        </div>

        {/* Cart Summary Text */}
        <div className="cursor-pointer" onClick={onOpenCheckout}>
          <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
            {totalQuantity} Produk Dalam Keranjang
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-sm md:text-base font-extrabold text-white font-mono">
              Total: {totalPrice > 0 ? `Rp ${Number(totalPrice).toLocaleString('id-ID')}` : 'Minta Penawaran'}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onOpenCheckout}
          className="btn-primary py-2.5 px-5 text-xs font-bold shadow-lg flex items-center gap-2 rounded-xl"
        >
          <span>Checkout Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Clear Cart Button */}
        <button
          onClick={onClearCart}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
          title="Kosongkan Keranjang"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
