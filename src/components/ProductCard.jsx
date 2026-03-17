import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

export default function ProductCard({ product }) {
  const { addItem, animatingId } = useCart();
  const [imgError, setImgError] = useState(false);
  const isAnimating = animatingId === product.id;

  const placeholderEmoji = {
    hotdogs: '🌭',
    burgers: '🍔',
    combos: '🎉',
    drinks: '🥤',
    extras: '🧀',
  }[product.category] || '🌭';

  return (
    <div className="card group flex flex-col hover:scale-[1.02] transition-all duration-300">
      {/* Image */}
      <div className="relative h-44 sm:h-48 bg-brand-gray-mid overflow-hidden flex-shrink-0">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-6xl">{placeholderEmoji}</span>
            <span className="text-xs text-gray-500 font-medium">{product.name}</span>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full ${product.badgeColor}`}
          >
            {product.badge}
          </span>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-0 right-0 bg-brand-black/80 backdrop-blur-sm px-3 py-1.5 rounded-tl-xl">
          <span className="text-brand-yellow font-bold text-base">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-display font-bold text-white text-base leading-tight">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed flex-1 line-clamp-3">
          {product.description}
        </p>

        {/* Add to cart */}
        <button
          onClick={() => addItem(product)}
          className={`mt-2 w-full btn-primary flex items-center justify-center gap-2 text-sm ${
            isAnimating ? 'animate-pulse-once' : ''
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Adicionar
        </button>
      </div>
    </div>
  );
}
