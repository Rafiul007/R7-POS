import type { CartPaymentFormData } from '../types';

export const cartPaymentFormDefaultValues: CartPaymentFormData = {
  customerInfo: {
    name: '',
    phone: '',
    email: '',
    type: 'walk-in',
  },
  payments: [
    {
      id: '1',
      method: 'cash',
      amount: 0,
      saved: false,
    },
  ],
  couponCode: '',
  orderNotes: '',
  receiptOptions: {
    print: true,
    email: false,
    sms: false,
  },
};
