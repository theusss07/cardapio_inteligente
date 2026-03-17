import ProductCard from './ProductCard';
import { categories } from '../data/products';

export default function ProductGrid({ products, activeCategory }) {
  const category = categories.find((c) => c.id === activeCategory);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-6xl opacity-30">{category?.emoji || '🍔'}</span>
        <p className="text-gray-500 font-medium">Nenhum produto encontrado</p>
      </div>
    );
  }

  return (
    <div>
      {/* Category header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{category?.emoji}</span>
        <div>
          <h2 className="font-display font-bold text-white text-2xl leading-none">
            {category?.label}
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            {products.length} {products.length === 1 ? 'opção disponível' : 'opções disponíveis'}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
