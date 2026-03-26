import { Link } from 'react-router-dom';
import { useProducts } from '../../../context/ProductsContext';
import { formatPrice } from '../../../data/products';

export default function ProductList() {
  const { baseProducts, deleteProduct, editProduct } = useProducts();

  const categoriesMap = {
    hotdogs: '🌭 Hot Dog',
    combos: '🎉 Combo',
    drinks: '🥤 Bebida',
    extras: '🧀 Adicional'
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Tem certeza que deseja remover "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const handleToggleActive = (product) => {
    editProduct(product.id, { isActive: product.isActive === false ? true : false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-white text-3xl">Produtos</h2>
          <p className="text-gray-400 text-sm mt-1">Gerencie os itens do seu cardápio base.</p>
        </div>
        <Link to="/admin/new" className="btn-primary text-center">
          + Novo Produto
        </Link>
      </div>

      <div className="bg-brand-gray-dark border border-brand-gray-mid rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-gray-mid/30 text-gray-400 text-sm border-b border-brand-gray-mid">
                <th className="p-4 font-medium min-w-[200px]">Nome do Produto</th>
                <th className="p-4 font-medium">Categoria</th>
                <th className="p-4 font-medium">Preço</th>
                <th className="p-4 font-medium text-center">Destaque</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-mid/50 text-white text-sm">
              {baseProducts.map(product => (
                <tr key={product.id} className={`hover:bg-brand-gray-mid/20 transition-colors ${product.isActive === false ? 'opacity-50 grayscale' : ''}`}>
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-gray-mid shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-lg">{categoriesMap[product.category]?.split(' ')[0]}</span>
                        )}
                      </div>
                      <span className="truncate max-w-[180px]" title={product.name}>{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{categoriesMap[product.category] || product.category}</td>
                  <td className="p-4 font-bold text-brand-yellow">{formatPrice(product.price)}</td>
                  <td className="p-4 text-center">
                    {product.badge ? (
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${product.badgeColor || 'bg-brand-gray-mid text-white'}`}>
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleToggleActive(product)} className={`${product.isActive === false ? 'text-gray-500 hover:text-green-400' : 'text-green-400 hover:text-gray-500'} p-2 transition-colors`} title={product.isActive === false ? "Ativar Produto" : "Pausar Produto"}>
                        {product.isActive === false ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <Link to={`/admin/edit/${product.id}`} className="text-blue-400 hover:text-blue-300 p-2 transition-colors" title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </Link>
                      <button onClick={() => handleDelete(product.id, product.name)} className="text-brand-red hover:text-red-400 p-2 transition-colors" title="Remover">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {baseProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Nenhum produto cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
