'use strict';

const CART_STATUS_UNINITIALIZED = 'UNINITIALIZED';

function getCartStatus(cart) {
  const status = cart?.order?.status;
  if (status === undefined || status === null) {
    return CART_STATUS_UNINITIALIZED;
  }
  return status;
}

module.exports = { getCartStatus, CART_STATUS_UNINITIALIZED };
