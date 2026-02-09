export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Signed in successfully.',
    LOGOUT_SUCCESS: 'Signed out successfully.',
  },
  CART: {
    COUPON_INVALID: 'Invalid coupon code.',
    ADDED: (name: string) => `Added ${name} to cart.`,
  },
  PAYMENT: {
    MISSING_CUSTOMER: 'Please fill in customer name and phone number.',
    MISSING_PHONE: 'Please fill in customer phone number.',
    AMOUNT_LESS: (paid: string, total: string) =>
      `Payment amount ($${paid}) is less than total ($${total}).`,
    AMOUNT_MORE: (paid: string, total: string) =>
      `Payment amount ($${paid}) exceeds total ($${total}).`,
    CARD_DETAILS_REQUIRED: 'Please fill in all card details for card payments.',
    SUCCESS: (total: string, reference: string) =>
      `Payment processed successfully. Total: $${total}. Ref: ${reference}.`,
  },
  BARCODE: {
    NOT_FOUND: (code: string) => `Barcode not found: ${code}`,
    OUT_OF_STOCK: (name: string) => `${name} is out of stock.`,
    ADDED: (name: string) => `Added ${name} to cart.`,
  },
  DRAWER: {
    SHIFT_OPENED: 'Shift opened successfully.',
    SHIFT_CLOSED: 'Shift closed successfully.',
    CASH_IN_RECORDED: 'Cash in recorded.',
    CASH_OUT_RECORDED: 'Cash out recorded.',
    SHIFT_REQUIRED: 'Open a shift before adding items to cart.',
  },
  BULK_UPLOAD: {
    MISSING_HEADERS: (headers: string) =>
      `Missing required headers: ${headers}.`,
    PARSED: (count: number) => `Parsed ${count} rows from CSV.`,
    IMPORTED: (count: number) => `Imported ${count} products.`,
    INVALID_ROWS: (count: number) =>
      `${count} row${count === 1 ? '' : 's'} need fixes before import.`,
    SEND_STARTED: (count: number) => `Sending ${count} products to backend...`,
    SEND_SUCCESS: (count: number) =>
      `Bulk upload queued for ${count} products.`,
    RESET: 'Bulk upload cleared.',
  },
};
