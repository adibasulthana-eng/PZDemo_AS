'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { getCartStatus, CART_STATUS_UNINITIALIZED } = require('../src/services/CartService');

test('S1 returns the status of a valid cart', () => {
  assert.equal(getCartStatus({ order: { status: 'PENDING' } }), 'PENDING');
});

test('S2 returns UNINITIALIZED for an undefined cart', () => {
  assert.equal(getCartStatus(undefined), CART_STATUS_UNINITIALIZED);
});

test('S3 returns UNINITIALIZED for a null cart', () => {
  assert.equal(getCartStatus(null), CART_STATUS_UNINITIALIZED);
});

test('S4 returns UNINITIALIZED when the cart has no order', () => {
  assert.equal(getCartStatus({}), CART_STATUS_UNINITIALIZED);
});

test('S5 returns UNINITIALIZED when the order is null', () => {
  assert.equal(getCartStatus({ order: null }), CART_STATUS_UNINITIALIZED);
});

test('S6 returns UNINITIALIZED when the order has no status', () => {
  assert.equal(getCartStatus({ order: {} }), CART_STATUS_UNINITIALIZED);
});

test('S7 passes through a falsy but defined status', () => {
  assert.equal(getCartStatus({ order: { status: '' } }), '');
});

test('exports the UNINITIALIZED constant', () => {
  assert.equal(CART_STATUS_UNINITIALIZED, 'UNINITIALIZED');
});
