const app = require('./app');

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Backend Server is running on http://localhost:${PORT}`);
  console.log(`To see products: http://localhost:${PORT}/api/products/loja-matriz`);
});
