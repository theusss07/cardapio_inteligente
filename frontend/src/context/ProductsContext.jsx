import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProductService } from '../services/api';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [baseProducts, setBaseProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca inicial dos produtos
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await ProductService.getProducts('loja-matriz');
    setBaseProducts(data);
    setLoading(false);
  };

  const addProduct = useCallback(async (product) => {
    try {
      const result = await ProductService.createProduct(product);
      if (result.status === 'success') {
        setBaseProducts((prev) => [...prev, result.data]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const editProduct = useCallback(async (id, updatedData) => {
    try {
      const result = await ProductService.updateProduct(id, updatedData);
      if (result.status === 'success') {
        setBaseProducts((prev) => prev.map((p) => (p.id == id ? result.data : p)));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      const result = await ProductService.deleteProduct(id);
      if (result.status === 'success') {
        setBaseProducts((prev) => prev.filter((p) => p.id != id));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Simulating multi-store logic matching the backend simulation
  // Or hitting the backend dynamically. 
  // For instantaneous UI without loading states per category change, we rely on baseProducts wrapper:
  const getProductsByStore = useCallback((storeId) => {
    if (storeId === 'express-shopping') {
      return baseProducts.map(product => {
        let newPrice = product.price * 0.9;
        let newName = product.name;
        if (product.category === 'hotdogs') {
          newName = newName + ' Express';
        }
        return { ...product, price: newPrice, name: newName };
      });
    }
    return baseProducts;
  }, [baseProducts]);

  return (
    <ProductsContext.Provider
      value={{
        baseProducts,
        loading,
        addProduct,
        editProduct,
        deleteProduct,
        getProductsByStore,
        reloadProducts: loadProducts
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
