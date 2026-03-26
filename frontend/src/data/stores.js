export const stores = [
  { 
    id: 'loja-matriz', 
    name: 'Loja Matriz (Av. Paulista)', 
    theme: 'brand-red-dark', 
    phone: '(11) 99999-0001',
    description: 'A unidade tradicional com os lanches originais'
  }
];

export const getStoreById = (id) => stores.find((s) => s.id === id);
