'use strict';

const CART_STATUS_UNINITIALIZED = 'UNINITIALIZED';

class CartService {
  getCartStatus(cart) {
    if (cart === undefined || cart === null) {
      return CART_STATUS_UNINITIALIZED;
    }
    return cart.status;
  }
}

module.exports = { CartService, CART_STATUS_UNINITIALIZED };
