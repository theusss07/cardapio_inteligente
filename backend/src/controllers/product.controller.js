const db = require('../data/mockDB');

class ProductController {
  // GET /api/products/:storeId
  async getProducts(req, res) {
    try {
      const { storeId } = req.params;
      const products = db.getProducts(storeId);
      res.json({ status: 'success', data: products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // POST /api/products
  async createProduct(req, res) {
    try {
      const product = req.body;
      const newProduct = db.addProduct(product);
      res.status(201).json({ status: 'success', data: newProduct });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // PUT /api/products/:id
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;
      const updatedProduct = db.updateProduct(id, productData);
      
      if (!updatedProduct) {
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }
      
      res.json({ status: 'success', data: updatedProduct });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // DELETE /api/products/:id
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      db.deleteProduct(id);
      res.json({ status: 'success', message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new ProductController();
