import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import OrderSuccess from './components/OrderSuccess';
import MenuPage from './pages/MenuPage';

function AppContent() {
  const { orderPlaced } = useCart();

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
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
