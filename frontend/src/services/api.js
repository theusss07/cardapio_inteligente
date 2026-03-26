const API_URL = 'http://localhost:3333/api';

/**
 * Serviço centralizado para chamadas de API do Cardápio Inteligente
 */
export const ProductService = {
  
  /**
   * Busca a lista de produtos baseada na loja
   * @param {string} storeId - O ID da loja atual
   * @returns {Promise<Array>} Lista de produtos
   */
  async getProducts(storeId = 'loja-matriz') {
    try {
      const response = await fetch(`${API_URL}/products/${storeId}`);
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      throw new Error(result.message);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },

  /**
   * Cria um novo produto no servidor
   * @param {Object} product - Dados do produto
   */
  async createProduct(product) {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    return response.json();
  },

  /**
   * Atualiza um produto existente
   * @param {string|number} id - ID do produto
   * @param {Object} updateData - Dados para atualizar
   */
  async updateProduct(id, updateData) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    return response.json();
  },

  /**
   * Deleta um produto do servidor
   * @param {string|number} id - ID do produto
   */
  async deleteProduct(id) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};

export const OrderService = {
  /**
   * Busca todos os pedidos
   */
  async getOrders() {
    try {
      const response = await fetch(`${API_URL}/orders`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return [];
    }
  },

  /**
   * Cria um novo pedido
   */
  async createOrder(orderData) {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  /**
   * Atualiza o status de um pedido
   */
  async updateStatus(id, status) {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  }
};
