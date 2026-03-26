import { useEffect } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { ProductsProvider } from './context/ProductsContext';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/layout/Header';
import CartDrawer from './components/features/cart/CartDrawer';
import OrderSuccess from './components/features/cart/OrderSuccess';
import MenuPage from './pages/MenuPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const { orderPlaced, clearCart } = useCart();
  const { storeId } = useParams();

  useEffect(() => {
    clearCart();
  }, [storeId, clearCart]);

  return (
    <div className="min-h-screen bg-brand-black">
      <Header />
      <MenuPage />
      <CartDrawer />
      {orderPlaced && <OrderSuccess />}
    </div>
  );
}

export default function App() {
  return (
    <ProductsProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/store/loja-matriz" replace />} />
        <Route
          path="/store/:storeId"
          element={
            <CartProvider>
              <AppContent />
            </CartProvider>
          }
        />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </ProductsProvider>
  );
}
