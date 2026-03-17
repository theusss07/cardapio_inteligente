import { useState, useMemo } from 'react';
import { categories, products } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import CategoryNav from '../components/CategoryNav';
import ProductGrid from '../components/ProductGrid';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('hotdogs');
  const [search, setSearch] = useState('');
  const { totalItems, totalPrice, setIsCartOpen } = useCart();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = p.category === activeCategory;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div>
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-brand-red-dark via-brand-black to-brand-gray-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-6 text-9xl rotate-12 select-none">🌭</div>
          <div className="absolute bottom-4 left-4 text-7xl -rotate-6 select-none">🍟</div>
          <div className="absolute top-10 left-1/3 text-5xl rotate-6 select-none">🥤</div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-lg">
            <span className="inline-block bg-brand-yellow/20 text-brand-yellow text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              🌭 Street Food de Verdade
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight mb-2">
              Hot Dogs que fazem{' '}
              <span className="text-gradient">história!</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Artesanal • Recheado • Irresistível
            </p>
            <div className="flex gap-4 mt-5">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-brand-yellow">⏱</span> 15–25 min
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-brand-yellow">⭐</span> 4.9 (1.2k avaliações)
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-brand-yellow">🛵</span> Entrega grátis +R$50
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar no cardápio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-gray-dark border border-brand-gray-mid rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-red transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category Nav */}
      <CategoryNav activeCategory={activeCategory} onSelect={setActiveCategory} />

      {/* Products */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <ProductGrid products={filtered} activeCategory={activeCategory} />
      </div>

      {/* Floating cart bar (mobile) */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:hidden animate-slide-in-up">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full btn-yellow py-4 flex items-center justify-between text-base rounded-2xl shadow-2xl"
          >
            <span className="bg-brand-black/20 text-brand-black font-black px-2.5 py-0.5 rounded-lg text-sm">
              {totalItems}
            </span>
            <span className="font-black tracking-wide">Ver Carrinho</span>
            <span className="font-bold">{formatPrice(totalPrice)}</span>
          </button>
        </div>
      )}

      {/* Bottom padding for floating bar */}
      {totalItems > 0 && <div className="h-24 sm:hidden" />}
    </div>
  );
}
