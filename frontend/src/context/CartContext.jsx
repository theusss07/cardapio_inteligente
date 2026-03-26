import { createContext, useContext, useState, useCallback } from 'react';
import { OrderService } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [animatingId, setAnimatingId] = useState(null);

  const addItem = useCallback((product) => {
    setAnimatingId(product.id);
    setTimeout(() => setAnimatingId(null), 400);

    setItems((prev) => {
      const targetId = product.cartItemId || product.id;
      const existing = prev.find((i) => (i.cartItemId || i.id) === targetId);
      if (existing) {
        return prev.map((i) =>
          (i.cartItemId || i.id) === targetId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((identifier) => {
    setItems((prev) => prev.filter((i) => (i.cartItemId || i.id) !== identifier));
  }, []);

  const updateQuantity = useCallback((identifier, delta) => {
    setItems((prev) =>
      prev
        .map((i) =>
          (i.cartItemId || i.id) === identifier ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const rawTotalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Auto combo logic
  const hotdogsCount = items.filter(i => i.category === 'hotdogs').reduce((sum, i) => sum + i.quantity, 0);
  const friesCount = items.filter(i => i.category === 'extras' && i.name.toLowerCase().includes('batata')).reduce((sum, i) => sum + i.quantity, 0);
  const drinksCount = items.filter(i => i.category === 'drinks').reduce((sum, i) => sum + i.quantity, 0);
  
  const comboCount = Math.min(hotdogsCount, friesCount, drinksCount);
  const comboDiscount = comboCount * 4.0; // R$ 4 discount per full combo
  
  const totalPrice = Math.max(0, rawTotalPrice - comboDiscount);

  const placeOrder = useCallback(async (clientData = {}) => {
    try {
      const orderData = {
        items: items.map(i => ({
          productId: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          customizations: i.customizationsText || ''
        })),
        totalItems,
        totalPrice,
        rawTotalPrice,
        comboDiscount,
        // Sanitize clientData to ensure no circular references reach serialization
        ...(typeof clientData === 'object' && clientData !== null && !clientData.nativeEvent ? clientData : {})
      };

      const result = await OrderService.createOrder(orderData);
      
      if (result.status === 'success') {
        setOrderPlaced(true);
        setIsCartOpen(false);
        setTimeout(() => {
          setOrderPlaced(false);
          clearCart();
        }, 4000);
      }
    } catch (e) {
      console.error('Erro ao realizar pedido:', e);
      alert('Houve um erro ao processar seu pedido. Tente novamente.');
    }
  }, [items, totalItems, totalPrice, rawTotalPrice, comboDiscount, clearCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        rawTotalPrice,
        comboDiscount,
        hotdogsCount,
        friesCount,
        drinksCount,
        isCartOpen,
        setIsCartOpen,
        orderPlaced,
        placeOrder,
        animatingId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
