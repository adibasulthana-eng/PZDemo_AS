'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { CartController } = require('../src/controllers/CartController');
const { CartService, CART_STATUS_UNINITIALIZED } = require('../src/services/CartService');

const INVALID_CART = { error: 'INVALID_CART', message: 'Cart is missing or not initialized.' };

function spyController() {
  const service = new CartService();
  const calls = [];
  const original = service.getCartStatus.bind(service);
  service.getCartStatus = (...args) => {
    calls.push(args);
    return original(...args);
  };
  return { controller: new CartController(service), calls };
}

test('T1 checkout returns the current cart status', () => {
  const { controller, calls } = spyController();
  assert.deepEqual(controller.handleRequest({ cart: { status: 'ready' } }), { status: 'ready' });
  assert.equal(calls.length, 1);
});

test('T2 HF-2487: empty payload returns INVALID_CART instead of throwing', () => {
  const { controller, calls } = spyController();
  assert.doesNotThrow(() => controller.handleRequest({}));
  assert.deepEqual(controller.handleRequest({}), INVALID_CART);
  assert.equal(calls.length, 0);
});

for (const [name, payload] of [
  ['cart is null', { cart: null }],
  ['cart is explicitly undefined', { cart: undefined }],
  ['payload is undefined', undefined],
  ['payload is null', null],
  ['cart is a string', { cart: 'abc' }],
  ['cart is a number', { cart: 0 }],
  ['cart is false', { cart: false }],
]) {
  test(`T3 invalid input (${name}) returns INVALID_CART and skips the service`, () => {
    const { controller, calls } = spyController();
    assert.deepEqual(controller.handleRequest(payload), INVALID_CART);
    assert.equal(calls.length, 0);
  });
}

test('T4 cart object without status keeps existing behaviour', () => {
  const { controller } = spyController();
  assert.deepEqual(controller.handleRequest({ cart: {} }), { status: undefined });
});

test('T5 falsy but defined status values pass through unchanged', () => {
  const { controller } = spyController();
  assert.deepEqual(controller.handleRequest({ cart: { status: '' } }), { status: '' });
  assert.deepEqual(controller.handleRequest({ cart: { status: 0 } }), { status: 0 });
});

test('T6 service returns UNINITIALIZED for a missing cart', () => {
  const service = new CartService();
  assert.equal(service.getCartStatus(undefined), CART_STATUS_UNINITIALIZED);
  assert.equal(service.getCartStatus(null), CART_STATUS_UNINITIALIZED);
  assert.equal(service.getCartStatus(), CART_STATUS_UNINITIALIZED);
});

test('T7 service returns the status for a present cart', () => {
  const service = new CartService();
  assert.equal(service.getCartStatus({ status: 'paid' }), 'paid');
});
