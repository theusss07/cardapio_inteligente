import { useAdmin } from '../../../context/AdminContext';
import { OrderService } from '../../../services/api';
import { formatPrice } from '../../../data/products';

export default function AdminOrders() {
  const { 
    orders = [], 
    loading, 
    loadOrders, 
    showToast, 
    knownOrderIds = new Set() 
  } = useAdmin();

  const statusColors = {
    pending: 'bg-brand-yellow text-brand-black',
    preparing: 'bg-blue-600 text-white',
    ready: 'bg-green-600 text-white',
    delivered: 'bg-brand-gray-mid text-gray-400',
    cancelled: 'bg-brand-red text-white'
  };

  const statusLabels = {
    pending: 'Pendente',
    preparing: 'Preparando',
    ready: 'Pronto / Saiu',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await OrderService.updateStatus(id, newStatus);
      loadOrders?.(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-white text-center py-20">Carregando pedidos...</div>;

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[100] animate-bounce-in">
          <div className="bg-brand-yellow text-brand-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-white/20">
            <span className="text-3xl">🔔</span>
            <div>
              <p className="font-black text-lg leading-tight">Novo Pedido!</p>
              <p className="text-xs font-bold opacity-70">Um novo pedido acaba de chegar na cozinha.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-white text-3xl">Pedidos</h2>
          <p className="text-gray-400 text-sm mt-1">Acompanhe e gerencie as vendas em tempo real.</p>
        </div>
        <button 
          onClick={() => loadOrders?.(false)}
          className="p-2 bg-brand-gray-mid hover:bg-brand-gray-light rounded-xl text-white transition-colors"
          title="Atualizar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.length === 0 ? (
          <div className="bg-brand-gray-dark border border-brand-gray-mid rounded-2xl p-12 text-center text-gray-500">
            Nenhum pedido recebido ainda.
          </div>
        ) : (
          [...orders].sort((a, b) => {
            try {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return (dateB || 0) - (dateA || 0);
            } catch (e) {
              return 0;
            }
          }).map((order) => {
            try {
              const isNew = knownOrderIds?.has?.(order.id) === false; // If we use the ref logic, it might be different, but here we use the state
              
              return (
                <div key={order.id} className={`bg-brand-gray-dark border ${isNew ? 'border-brand-yellow ring-1 ring-brand-yellow/30' : 'border-brand-gray-mid'} rounded-2xl overflow-hidden shadow-lg animate-fade-in`}>
                  {/* Card Header */}
                  <div className={`p-4 ${isNew ? 'bg-brand-yellow/10' : 'bg-brand-gray-mid/30'} flex items-center justify-between border-b border-brand-gray-mid`}>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-black text-brand-yellow">#{order.id}</span>
                      <span className="text-gray-400 text-xs">
                        {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </span>
                      {isNew && <span className="bg-brand-yellow text-brand-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Novo</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-500'}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                      <div className="relative group">
                        <button className="p-1 hover:bg-brand-gray-mid rounded-lg text-gray-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-10 bg-brand-gray-dark border border-brand-gray-mid rounded-xl p-2 shadow-2xl min-w-[150px]">
                          {Object.keys(statusLabels).map(s => (
                            <button 
                              key={s}
                              onClick={() => handleStatusChange(order.id, s)}
                              className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-brand-gray-mid rounded-lg transition-colors"
                            >
                              Mudar para {statusLabels[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Itens do Pedido</h4>
                      <ul className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-start text-sm">
                            <div className="flex gap-2">
                              <span className="text-brand-yellow font-bold">{item.quantity}x</span>
                              <div>
                                <p className="text-white font-medium">{item.name}</p>
                                {item.customizations && (
                                  <p className="text-[11px] text-gray-500 italic mt-0.5">{item.customizations}</p>
                                )}
                              </div>
                            </div>
                            <span className="text-gray-400 font-medium">
                              {formatPrice ? formatPrice(Number(item.price || 0) * (item.quantity || 1)) : `R$ ${item.price}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-brand-gray-mid md:pl-4 pt-4 md:pt-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Pagamento</h4>
                          <p className="text-white text-sm font-bold">
                            {formatPrice ? formatPrice(Number(order.totalPrice || 0)) : `R$ ${order.totalPrice}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'preparing')}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                          >
                            Aceitar Pedido
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'ready')}
                            className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                          >
                            Marcar como Pronto
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            } catch (err) {
              console.error('Error rendering order:', order?.id, err);
              return <div key={order?.id} className="text-red-500">Erro ao renderizar pedido #{order?.id}</div>;
            }
          })
        )}
      </div>
    </div>
  );
}
