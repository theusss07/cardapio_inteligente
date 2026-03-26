const http = require('http');

const data = JSON.stringify({
  items: [
    { productId: 1, name: 'Tradicional', quantity: 1, price: 15.9, customizations: '' }
  ],
  totalItems: 1,
  totalPrice: 15.9,
  rawTotalPrice: 15.9,
  comboDiscount: 0,
  clientName: 'Teste',
  clientPhone: '11999999999'
});

const options = {
  hostname: '127.0.0.1',
  port: 3333,
  path: '/api/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('BODY:', body);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
