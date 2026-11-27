"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const node_assert_1 = __importDefault(require("node:assert"));
const index_js_1 = __importDefault(require("../index.js"));
let server;
let port;
node_test_1.default.before(() => {
    return new Promise((resolve) => {
        server = index_js_1.default.listen(0, () => {
            const address = server.address();
            port = address.port;
            resolve();
        });
    });
});
node_test_1.default.after(() => {
    return new Promise((resolve) => {
        server.close(() => resolve());
    });
});
(0, node_test_1.default)('GET /api/health should return status healthy', async () => {
    const res = await fetch(`http://localhost:${port}/api/health`);
    node_assert_1.default.strictEqual(res.status, 200);
    const data = await res.json();
    node_assert_1.default.strictEqual(data.status, 'healthy');
    node_assert_1.default.strictEqual(data.brand, 'CHANDHANA SHOE MART');
});
(0, node_test_1.default)('GET /api/products should return seeded products list with pagination', async () => {
    const res = await fetch(`http://localhost:${port}/api/products`);
    node_assert_1.default.strictEqual(res.status, 200);
    const json = await res.json();
    node_assert_1.default.strictEqual(json.success, true);
    (0, node_assert_1.default)(json.data.products.length > 0);
    (0, node_assert_1.default)(json.data.pagination.total > 0);
});
(0, node_test_1.default)('GET /api/categories should return all seeded categories', async () => {
    const res = await fetch(`http://localhost:${port}/api/categories`);
    node_assert_1.default.strictEqual(res.status, 200);
    const json = await res.json();
    node_assert_1.default.strictEqual(json.success, true);
    (0, node_assert_1.default)(json.data.length >= 10);
});
(0, node_test_1.default)('GET /api/pincode/560001 should return valid delivery estimation', async () => {
    const res = await fetch(`http://localhost:${port}/api/pincode/560001`);
    node_assert_1.default.strictEqual(res.status, 200);
    const json = await res.json();
    node_assert_1.default.strictEqual(json.success, true);
    node_assert_1.default.strictEqual(json.data.serviceable, true);
    node_assert_1.default.strictEqual(json.data.codAvailable, true);
});
(0, node_test_1.default)('POST /api/auth/login should authenticate seeded customer', async () => {
    const res = await fetch(`http://localhost:${port}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'rahul.sharma@example.com',
            password: 'Customer@12345',
        }),
    });
    node_assert_1.default.strictEqual(res.status, 200);
    const json = await res.json();
    node_assert_1.default.strictEqual(json.success, true);
    (0, node_assert_1.default)(json.data.token);
    node_assert_1.default.strictEqual(json.data.user.role, 'CUSTOMER');
});
(0, node_test_1.default)('POST /api/auth/login should authenticate admin', async () => {
    const res = await fetch(`http://localhost:${port}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'admin@chandhanashoemart.com',
            password: 'Admin@12345',
        }),
    });
    node_assert_1.default.strictEqual(res.status, 200);
    const json = await res.json();
    node_assert_1.default.strictEqual(json.success, true);
    (0, node_assert_1.default)(json.data.token);
    node_assert_1.default.strictEqual(json.data.user.role, 'ADMIN');
});
(0, node_test_1.default)('POST /api/checkout/validate should calculate subtotal and validate coupon', async () => {
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
    node_assert_1.default.strictEqual(res.status, 200);
    const json = await res.json();
    node_assert_1.default.strictEqual(json.success, true);
    (0, node_assert_1.default)(json.data.subtotal > 0);
    (0, node_assert_1.default)(json.data.coupon.valid === true);
    (0, node_assert_1.default)(json.data.discountAmount > 0);
});
