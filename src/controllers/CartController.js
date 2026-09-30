'use strict';

class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  handleRequest(payload) {
    const cart = payload?.cart;
    if (cart === undefined || cart === null || typeof cart !== 'object') {
      return {
        error: 'INVALID_CART',
        message: 'Cart is missing or not initialized.',
      };
    }
    return {
      status: this.cartService.getCartStatus(cart),
    };
  }
}

module.exports = { CartController };
