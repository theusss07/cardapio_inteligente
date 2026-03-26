// In a real SaaS, this would connect to MongoDB or PostgreSQL.
// Here we simulate the database state in memory until a real DB is attached.

let productsDB = [
  { id: 1, name: 'Tradicional', price: 15.90, description: 'Pão, salsicha, ketchup, mostarda, maionese e batata palha', category: 'hotdogs' },
  { id: 2, name: 'Duplo Cheddar', price: 21.90, description: 'Pão, 2x salsicha, muito cheddar, bacon e batata palha', badge: 'Mais Vendido', badgeColor: 'bg-brand-red text-white', category: 'hotdogs' },
  { id: 3, name: 'Vegano Ervas', price: 23.90, description: 'Pão vegano, salsicha vegetal, maionese de ervas e milho', badge: 'Novo', badgeColor: 'bg-green-600 text-white', category: 'hotdogs' },
  { id: 4, name: 'Especial Paulista', price: 19.90, description: 'Pão, salsicha, purê de batata, vinagrete, milho, ervilha, queijo ralado e batata palha', badge: 'Clássico', badgeColor: 'bg-blue-600 text-white', category: 'hotdogs' },
  { id: 5, name: 'Gourmet Defumado', price: 28.90, description: 'Pão brioche, salsicha artesanal defumada, cebola caramelizada, queijo prato derretido e molho barbecue', badge: 'Especial', badgeColor: 'bg-brand-yellow text-brand-black', category: 'hotdogs' },
  
  // Combos
  { id: 10, name: 'Combo Casal', price: 45.90, description: '2x Tradicionais + Porção de Fritas + 2 Refris', badge: 'Economia', badgeColor: 'bg-brand-yellow text-brand-black', category: 'combos' },
  { id: 11, name: 'Combo Família', price: 89.90, description: '4x Hot Dogs à escolha + Fritas Grande + Refri 2L', category: 'combos' },
  
  // Bebidas
  { id: 12, name: 'Refrigerante Lata', price: 6.00, description: 'Coca-Cola, Guaraná, Fanta ou Sprite (350ml)', category: 'drinks' },
  { id: 13, name: 'Suco Natural', price: 8.50, description: 'Laranja, Limão ou Maracujá (400ml)', category: 'drinks' },
  { id: 14, name: 'Água Mineral', price: 4.00, description: 'Com ou sem gás (500ml)', category: 'drinks' },
  { id: 15, name: 'Cerveja Long Neck', price: 12.00, description: 'Heineken, Stella Artois ou Budweiser', category: 'drinks' },
  
  // Adicionais/Porções
  { id: 16, name: 'Batata Frita', price: 15.00, description: 'Porção individual de batatas fritas crocantes com sal e orégano', category: 'extras' },
  { id: 17, name: 'Batata com Cheddar e Bacon', price: 22.00, description: 'Porção de batatas com cobertura farta de cheddar cremoso e cubos de bacon', badge: 'Top', badgeColor: 'bg-brand-red text-white', category: 'extras' },
  { id: 18, name: 'Onion Rings', price: 18.00, description: 'Anéis de cebola empanados e fritos, servidos com molho especial', category: 'extras' }
];

let ordersDB = [];

class MockDB {
  getProducts(storeId) {
    if (storeId === 'express-shopping') {
      return productsDB.map(product => {
        let newPrice = product.price * 0.9;
        let newName = product.name;
        if (product.category === 'hotdogs') {
          newName = newName + ' Express';
        }
        return { ...product, price: newPrice, name: newName };
      });
    }
    return productsDB;
  }

  addProduct(product) {
    const newId = Date.now();
    const newProduct = { ...product, id: newId };
    productsDB.push(newProduct);
    return newProduct;
  }

  updateProduct(id, productData) {
    productsDB = productsDB.map(p => p.id == id ? { ...p, ...productData, id: Number(id) } : p);
    return productsDB.find(p => p.id == id);
  }

  deleteProduct(id) {
    productsDB = productsDB.filter(p => p.id != id);
    return true;
  }

  // Orders
  getOrders() {
    return ordersDB.sort((a, b) => b.createdAt - a.createdAt);
  }

  addOrder(order) {
    const newOrder = { 
      ...order, 
      id: ordersDB.length + 1, 
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    ordersDB.push(newOrder);
    return newOrder;
  }

  updateOrderStatus(id, status) {
    ordersDB = ordersDB.map(o => o.id == id ? { ...o, status } : o);
    return ordersDB.find(o => o.id == id);
  }
}

module.exports = new MockDB();
