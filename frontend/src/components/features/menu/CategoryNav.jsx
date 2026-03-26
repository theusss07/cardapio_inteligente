import React from 'react';
import { categories } from '../../../data/products';

export default function CategoryNav({ activeCategory, onSelect }) {
  return (
    <div className="sticky top-16 z-30 bg-brand-black/95 backdrop-blur-sm border-b border-brand-gray-mid">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex gap-2 py-3 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`category-chip ${
                activeCategory === cat.id
                  ? 'bg-brand-red text-white shadow-red-glow scale-105'
                  : 'bg-brand-gray-dark text-gray-300 hover:bg-brand-gray-mid hover:text-white'
              }`}
            >
              <span className="mr-1.5">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
