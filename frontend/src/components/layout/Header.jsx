import { useCart } from '../../context/CartContext';
import { useParams, Link } from 'react-router-dom';
import { getStoreById } from '../../data/stores';

export default function Header() {
  const { storeId } = useParams();
  const store = getStoreById(storeId) || { name: 'Garagem Raiz', description: 'Street Food' };
  
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-brand-black border-b border-brand-gray-mid">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-xl shadow-red-glow hover:scale-105 transition-transform">
            <Link to="/">🌭</Link>
          </div>
          <div>
            <h1 className="font-display font-black text-white text-xl leading-none">
              {store.name.split(' ')[0]} <span className="text-brand-yellow">{store.name.substring(store.name.indexOf(' ') + 1)}</span>
            </h1>
            <p className="text-xs text-gray-400 leading-none mt-0.5">{store.description || 'Hot Dogs & Street Food'}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="hidden sm:flex items-center gap-2 bg-green-900/30 border border-green-700/50 rounded-full px-3 py-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-green-400 text-xs font-medium">Aberto agora</span>
        </div>

        {/* Cart button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark active:scale-95 transition-all duration-200 px-4 py-2 rounded-xl text-white font-semibold text-sm shadow-red-glow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="hidden sm:inline">Carrinho</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-yellow text-brand-black text-xs font-black rounded-full flex items-center justify-center animate-bounce-in">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
