'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const CartService = require('../src/services/CartService');
const { handleRequest } = require('../src/controllers/CartController');

function mockRes() {
  const res = { statusCode: undefined, body: undefined };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  return res;
}

function spyOnService(t) {
  const calls = [];
  const original = CartService.getCartStatus;
  CartService.getCartStatus = (...args) => {
    calls.push(args);
    return original(...args);
  };
  t.after(() => {
    CartService.getCartStatus = original;
  });
  return calls;
}

test('C1 returns 200 with the status for a valid cart', async (t) => {
  const calls = spyOnService(t);
  const res = mockRes();
  await handleRequest({ body: { cart: { order: { status: 'PAID' } } } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { status: 'PAID' });
  assert.equal(calls.length, 1);
});

const invalidBodies = [
  ['C2 missing cart', {}],
  ['C3 null cart', { cart: null }],
  ['C4 cart without order', { cart: {} }],
  ['C5 cart of the wrong type', { cart: 'abc' }],
  ['C6 undefined body', undefined],
];

for (const [name, body] of invalidBodies) {
  test(`${name} returns 400 INVALID_CART without calling the service`, async (t) => {
    const calls = spyOnService(t);
    const res = mockRes();
    await handleRequest({ body }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.error, 'INVALID_CART');
    assert.equal(calls.length, 0);
  });
}

test('C7 ticket repro: an uninitialized cart at checkout does not throw or return 500', async () => {
  const res = mockRes();
  await assert.doesNotReject(() => handleRequest({ body: { cart: { order: undefined } } }, res));
  assert.notEqual(res.statusCode, 500);
  assert.equal(res.statusCode, 400);
});
