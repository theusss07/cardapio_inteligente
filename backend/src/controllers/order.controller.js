const db = require('../data/mockDB');

class OrderController {
  // GET /api/orders
  async getOrders(req, res) {
    try {
      const orders = db.getOrders();
      res.json({ status: 'success', data: orders });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // POST /api/orders
  async createOrder(req, res) {
    try {
      const order = req.body;
      const newOrder = db.addOrder(order);
      res.status(201).json({ status: 'success', data: newOrder });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // PATCH /api/orders/:id/status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedOrder = db.updateOrderStatus(id, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ status: 'error', message: 'Order not found' });
      }
      
      res.json({ status: 'success', data: updatedOrder });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new OrderController();
