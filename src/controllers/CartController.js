'use strict';

const CartService = require('../services/CartService');

async function handleRequest(req, res) {
  const cart = req?.body?.cart;
  if (!cart || typeof cart !== 'object' || !cart.order) {
    return res.status(400).json({
      error: 'INVALID_CART',
      message: 'Cart or order is missing or not initialized.',
    });
  }
  const status = CartService.getCartStatus(cart);
  return res.status(200).json({ status });
}

module.exports = { handleRequest };
