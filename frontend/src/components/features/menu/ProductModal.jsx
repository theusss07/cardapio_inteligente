import { useState, useMemo, useEffect } from 'react';
import { formatPrice } from '../../../data/products';
import { useCart } from '../../../context/CartContext';

const BREAD_OPTIONS = [
  { id: 'tradicional', label: 'Pão Tradicional', price: 0 },
  { id: 'brioche', label: 'Pão Brioche', price: 2 },
  { id: 'australiano', label: 'Pão Australiano', price: 2 },
];

const SAUSAGE_OPTIONS = [
  { id: 'tradicional', label: 'Salsicha Tradicional', price: 0 },
  { id: 'artesanal', label: 'Salsicha Artesanal', price: 3 },
  { id: 'vegana', label: 'Salsicha Vegana', price: 3 },
];

const EXTRAS = [
  { id: 'milho', label: 'Milho', price: 1.0 },
  { id: 'ervilha', label: 'Ervilha', price: 1.0 },
  { id: 'batata_palha', label: 'Batata Palha', price: 1.0 },
  { id: 'bacon', label: 'Bacon', price: 3.5 },
  { id: 'queijo', label: 'Queijo', price: 2.5 },
];

const SAUCES = [
  { id: 'ketchup', label: 'Ketchup', price: 0 },
  { id: 'mostarda', label: 'Mostarda', price: 0 },
  { id: 'maionese', label: 'Maionese', price: 0 },
  { id: 'especial', label: 'Especial', price: 0 },
];

export default function ProductModal({ product, onClose }) {
  const { addItem, animatingId } = useCart();
  const [isClosing, setIsClosing] = useState(false);

  // States
  const [bread, setBread] = useState('tradicional');
  const [sausage, setSausage] = useState('tradicional');
  const [extras, setExtras] = useState(
    EXTRAS.reduce((acc, extra) => ({ ...acc, [extra.id]: 0 }), {})
  );
  const [sauces, setSauces] = useState(
    SAUCES.reduce((acc, sauce) => ({ ...acc, [sauce.id]: false }), {})
  );

  useEffect(() => {
    // Prevent scrolling behind modal
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // match animation duration
  };

  const updateExtra = (id, delta) => {
    setExtras((prev) => {
      const newVal = prev[id] + delta;
      if (newVal < 0) return prev;
      return { ...prev, [id]: newVal };
    });
  };

  const toggleSauce = (id) => {
    setSauces((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalPrice = useMemo(() => {
    let total = product.price;

    const selectedBread = BREAD_OPTIONS.find((b) => b.id === bread);
    if (selectedBread) total += selectedBread.price;

    const selectedSausage = SAUSAGE_OPTIONS.find((s) => s.id === sausage);
    if (selectedSausage) total += selectedSausage.price;

    EXTRAS.forEach((extra) => {
      total += extras[extra.id] * extra.price;
    });

    return total;
  }, [product, bread, sausage, extras]);

  const handleAddToCart = () => {
    // Build customizations text for cart display
    const selectedOptionsText = [];
    if (bread !== 'tradicional') {
      selectedOptionsText.push(BREAD_OPTIONS.find(b => b.id === bread).label);
    }
    if (sausage !== 'tradicional') {
      selectedOptionsText.push(SAUSAGE_OPTIONS.find(s => s.id === sausage).label);
    }
    
    EXTRAS.forEach(extra => {
      if (extras[extra.id] > 0) {
        selectedOptionsText.push(`${extras[extra.id]}x ${extra.label}`);
      }
    });

    const selectedSaucesList = Object.keys(sauces).filter(k => sauces[k]);
    if (selectedSaucesList.length > 0) {
      selectedSaucesList.forEach(s => {
        selectedOptionsText.push(SAUCES.find(sauce => sauce.id === s).label);
      });
    }

    const customizationString = JSON.stringify({ bread, sausage, extras, sauces });
    const cartItemId = `${product.id}-${customizationString}`;

    // Item to add to cart
    const itemToAdd = {
      ...product,
      cartItemId,
      price: totalPrice, // override base price with customized price
      customizationsText: selectedOptionsText.join(', ')
    };

    addItem(itemToAdd);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'animate-fade-in'}`}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-lg bg-brand-gray-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-transform duration-300 ${isClosing ? 'scale-95 opacity-0' : 'animate-scale-in'}`}
      >
        {/* Header with Product Image */}
        <div className="relative h-48 bg-brand-gray-mid flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-red transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Badge */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-gray-dark to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-5 right-4 pointer-events-none">
            <h2 className="font-display font-black text-2xl text-white">{product.name}</h2>
            <p className="text-gray-300 text-sm mt-1">{product.description}</p>
          </div>
        </div>

        {/* Scrollable Options */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">

          {/* Upsell Visual Cards */}
          <section>
            <h3 className="text-brand-yellow font-bold text-lg mb-3 flex items-center gap-2">
              <span className="text-xl">🚀</span> Turbine seu pedido
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar snap-x">
              {EXTRAS.slice(0, 3).map((extra) => (
                <div 
                  key={`upsell-${extra.id}`} 
                  onClick={() => updateExtra(extra.id, 1)}
                  className="snap-start shrink-0 w-32 bg-brand-gray-mid/40 hover:bg-brand-gray-mid rounded-xl p-3 border border-brand-yellow/20 cursor-pointer transition-all active:scale-95 group"
                >
                  <div className="h-12 w-12 bg-brand-gray-dark rounded-full flex items-center justify-center text-xl mb-2 mx-auto group-hover:scale-110 transition-transform">
                    {extra.id === 'bacon' ? '🥓' : extra.id === 'queijo' ? '🧀' : extra.id === 'milho' ? '🌽' : '🍟'}
                  </div>
                  <p className="text-white font-medium text-sm text-center leading-tight">{extra.label}</p>
                  <p className="text-brand-yellow font-bold text-xs text-center mt-1">+ {formatPrice(extra.price)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Base */}
          <section>
            <h3 className="text-brand-yellow font-bold text-lg mb-3">Pão</h3>
            <div className="space-y-2">
              {BREAD_OPTIONS.map((option) => (
                <label key={option.id} className="flex items-center justify-between bg-brand-gray-mid/50 hover:bg-brand-gray-mid rounded-xl p-3 cursor-pointer transition-colors border border-transparent has-[:checked]:border-brand-yellow">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="bread"
                      value={option.id}
                      checked={bread === option.id}
                      onChange={() => setBread(option.id)}
                      className="w-5 h-5 text-brand-yellow bg-gray-700 border-gray-600 focus:ring-brand-yellow"
                    />
                    <span className="text-white font-medium">{option.label}</span>
                  </div>
                  {option.price > 0 && (
                    <span className="text-gray-400 text-sm">+ {formatPrice(option.price)}</span>
                  )}
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-brand-yellow font-bold text-lg mb-3">Salsicha</h3>
            <div className="space-y-2">
              {SAUSAGE_OPTIONS.map((option) => (
                <label key={option.id} className="flex items-center justify-between bg-brand-gray-mid/50 hover:bg-brand-gray-mid rounded-xl p-3 cursor-pointer transition-colors border border-transparent has-[:checked]:border-brand-yellow">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="sausage"
                      value={option.id}
                      checked={sausage === option.id}
                      onChange={() => setSausage(option.id)}
                      className="w-5 h-5 text-brand-yellow bg-gray-700 border-gray-600 focus:ring-brand-yellow"
                    />
                    <span className="text-white font-medium">{option.label}</span>
                  </div>
                  {option.price > 0 && (
                    <span className="text-gray-400 text-sm">+ {formatPrice(option.price)}</span>
                  )}
                </label>
              ))}
            </div>
          </section>

          {/* Adicionais Quantidade */}
          <section>
            <h3 className="text-brand-yellow font-bold text-lg mb-3">Adicionais</h3>
            <div className="space-y-3">
              {EXTRAS.map((option) => (
                <div key={option.id} className="flex items-center justify-between bg-brand-gray-mid/50 rounded-xl p-3">
                  <div>
                    <span className="text-white font-medium block">{option.label}</span>
                    <span className="text-gray-400 text-sm">+ {formatPrice(option.price)}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-brand-gray-dark px-2 py-1.5 rounded-lg border border-gray-700">
                    <button
                      onClick={() => updateExtra(option.id, -1)}
                      disabled={extras[option.id] === 0}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent text-white hover:bg-brand-gray-mid disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-white font-bold w-4 text-center">{extras[option.id]}</span>
                    <button
                      onClick={() => updateExtra(option.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent text-brand-yellow hover:bg-brand-gray-mid transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Molhos Checkboxes */}
          <section>
            <h3 className="text-brand-yellow font-bold text-lg mb-3">Molhos (Grátis)</h3>
            <div className="grid grid-cols-2 gap-3">
              {SAUCES.map((option) => (
                <label key={option.id} className="flex items-center gap-3 bg-brand-gray-mid/50 hover:bg-brand-gray-mid rounded-xl p-3 cursor-pointer transition-colors border border-transparent has-[:checked]:border-brand-yellow">
                  <input
                    type="checkbox"
                    checked={sauces[option.id]}
                    onChange={() => toggleSauce(option.id)}
                    className="w-5 h-5 rounded text-brand-yellow bg-gray-700 border-gray-600 focus:ring-brand-yellow focus:ring-offset-gray-800"
                  />
                  <span className="text-white font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-brand-gray-mid bg-brand-gray-dark shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 font-medium">Total do Item</span>
            <span className="text-brand-yellow font-bold text-2xl">{formatPrice(totalPrice)}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full btn-yellow py-4 text-lg flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Adicionar ao Carrinho
          </button>
        </div>

      </div>
    </div>
  );
}
