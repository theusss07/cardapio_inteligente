import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';

export default function AdminLayout({ children }) {
  console.log('AdminLayout: rendering');
  const location = useLocation();
  const { pendingCount } = useAdmin();
  console.log('AdminLayout: pendingCount', pendingCount);

  const navItems = [
    { label: 'Pedidos', path: '/admin/orders', icon: '📝', badge: pendingCount > 0 ? pendingCount : null },
    { label: 'Produtos', path: '/admin', icon: '🌭' },
    { label: 'Voltar ao App', path: '/', icon: '🚪' }
  ];

  return (
    <div className="min-h-screen bg-brand-black flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-gray-dark border-r border-brand-gray-mid flex-shrink-0">
        <div className="p-6 border-b border-brand-gray-mid">
          <h1 className="font-display font-black text-white text-2xl flex items-center gap-2">
            <span className="text-brand-yellow">⚙️</span> Admin
          </h1>
          <p className="text-gray-400 text-xs mt-1">Gerenciamento da Loja</p>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-brand-red text-white font-bold'
                    : 'text-gray-400 hover:bg-brand-gray-mid hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-white text-brand-red text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
