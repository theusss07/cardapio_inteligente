import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { OrderService } from '../services/api';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  console.log('AdminProvider: rendering');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [knownOrderIds, setKnownOrderIds] = useState(new Set());
  const knownIdsRef = useRef(new Set());
  const [showToast, setShowToast] = useState(false);

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play();
    } catch (e) {
      console.warn('Could not play notification sound:', e);
    }
  }, []);

  const loadOrders = useCallback(async (isInitial = false) => {
    try {
      const data = await OrderService.getOrders();
      
      if (!isInitial && data.length > 0) {
        const newOrders = data.filter(order => !knownIdsRef.current.has(order.id));
        if (newOrders.length > 0) {
          playNotificationSound();
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
          
          newOrders.forEach(o => knownIdsRef.current.add(o.id));
          setKnownOrderIds(new Set(knownIdsRef.current));
        }
      } else if (isInitial) {
        const initialIds = new Set(data.map(o => o.id));
        knownIdsRef.current = initialIds;
        setKnownOrderIds(initialIds);
      }

      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  }, [playNotificationSound]);

  useEffect(() => {
    loadOrders(true);
    const interval = setInterval(() => loadOrders(false), 5000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <AdminContext.Provider
      value={{
        orders,
        loading,
        pendingCount,
        showToast,
        setShowToast,
        loadOrders,
        knownOrderIds
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
};
