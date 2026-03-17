import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-brand-gray-mid last:border-0 animate-fade-in">
      {/* Emoji placeholder */}
      <div className="w-14 h-14 bg-brand-gray-mid rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <span className="hidden w-full h-full items-center justify-center text-2xl">
          {({ hotdogs: '🌭', burgers: '🍔', combos: '🎉', drinks: '🥤', extras: '🧀' })[item.category]}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{item.name}</p>
        <p className="text-brand-yellow font-bold text-sm">{formatPrice(item.price)}</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => updateQuantity(item.id, -1)}
          className="quantity-btn bg-brand-gray-mid hover:bg-brand-red text-white"
        >
          −
        </button>
        <span className="text-white font-bold w-5 text-center text-sm">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, 1)}
          className="quantity-btn bg-brand-gray-mid hover:bg-green-600 text-white"
        >
          +
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="text-gray-500 hover:text-brand-red transition-colors ml-1"
        aria-label="Remover item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function CartDrawer() {
  const { items, totalItems, totalPrice, isCartOpen, setIsCartOpen, clearCart, placeOrder } = useCart();

  if (!isCartOpen) return null;

  const deliveryFee = totalPrice > 0 && totalPrice < 50 ? 5.99 : 0;
  const grandTotal = totalPrice + deliveryFee;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-brand-gray-dark shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-gray-mid">
          <div>
            <h2 className="font-display font-bold text-white text-xl">Meu Pedido</h2>
            <p className="text-gray-400 text-xs mt-0.5">
              {totalItems === 0 ? 'Carrinho vazio' : `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 rounded-xl bg-brand-gray-mid hover:bg-brand-red transition-colors flex items-center justify-center text-gray-300 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
              <div className="text-7xl">🛒</div>
              <p className="text-gray-400 text-center font-medium">Seu carrinho está vazio</p>
              <p className="text-gray-600 text-sm text-center">Adicione deliciosos burgers ao seu pedido!</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-primary mt-2 text-sm"
              >
                Ver Cardápio
              </button>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer with summary */}
        {items.length > 0 && (
          <div className="border-t border-brand-gray-mid p-5 space-y-3">
            {/* Price breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Entrega</span>
                <span className={deliveryFee === 0 ? 'text-green-400 font-semibold' : ''}>
                  {deliveryFee === 0 ? 'Grátis 🎉' : formatPrice(deliveryFee)}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-gray-500">Frete grátis em pedidos acima de R$ 50</p>
              )}
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-brand-gray-mid">
                <span>Total</span>
                <span className="text-brand-yellow">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={placeOrder}
              className="btn-yellow w-full text-base font-black py-4 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Finalizar Pedido • {formatPrice(grandTotal)}
            </button>
            <button
              onClick={clearCart}
              className="w-full text-gray-500 hover:text-brand-red text-xs text-center py-1 transition-colors"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  );
}
