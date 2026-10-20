import test from 'node:test';
import assert from 'node:assert';
import app from '../index.js';
import http from 'http';

let server: http.Server;
let port: number;

test.before(() => {
  return new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address() as { port: number };
      port = address.port;
      resolve();
    });
  });
});

test.after(() => {
  return new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

test('GET /api/health should return status healthy', async () => {
  const res = await fetch(`http://localhost:${port}/api/health`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'healthy');
  assert.strictEqual(data.brand, 'CHANDHANA SHOE MART');
});

test('GET /api/products should return seeded products list with pagination', async () => {
  const res = await fetch(`http://localhost:${port}/api/products`);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert(json.data.products.length > 0);
  assert(json.data.pagination.total > 0);
});

test('GET /api/categories should return all seeded categories', async () => {
  const res = await fetch(`http://localhost:${port}/api/categories`);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert(json.data.length >= 10);
});

test('GET /api/pincode/560001 should return valid delivery estimation', async () => {
  const res = await fetch(`http://localhost:${port}/api/pincode/560001`);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert.strictEqual(json.data.serviceable, true);
  assert.strictEqual(json.data.codAvailable, true);
});

test('POST /api/auth/login should authenticate seeded customer', async () => {
  const res = await fetch(`http://localhost:${port}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'rahul.sharma@example.com',
      password: 'Customer@12345',
    }),
  });
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert(json.data.token);
  assert.strictEqual(json.data.user.role, 'CUSTOMER');
});

test('POST /api/auth/login should authenticate admin', async () => {
  const res = await fetch(`http://localhost:${port}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@chandhanashoemart.com',
      password: 'Admin@12345',
    }),
  });
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert(json.data.token);
  assert.strictEqual(json.data.user.role, 'ADMIN');
});

test('POST /api/checkout/validate should calculate subtotal and validate coupon', async () => {
  // Fetch a product first
  const prodRes = await fetch(`http://localhost:${port}/api/products`);
  const prodJson = await prodRes.json();
  const firstProduct = prodJson.data.products[0];

  const res = await fetch(`http://localhost:${port}/api/checkout/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productId: firstProduct.id, quantity: 1 }],
      couponCode: 'WELCOME10',
    }),
  });
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert(json.data.subtotal > 0);
  assert(json.data.coupon.valid === true);
  assert(json.data.discountAmount > 0);
});
