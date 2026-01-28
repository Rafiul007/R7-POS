// Input field configurations for CartPayment form
export const CUSTOMER_TYPE_OPTIONS = [
  { value: 'walk-in', label: 'Walk-in Customer' },
  { value: 'registered', label: 'Registered Customer' },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'digital', label: 'Digital Payment' },
];

export const RECEIPT_OPTIONS = [
  { value: 'print', label: 'Print Receipt' },
  { value: 'email', label: 'Email Receipt' },
  { value: 'sms', label: 'SMS Receipt' },
];

// Form field configuration for easy mapping
export const CUSTOMER_FORM_FIELDS = [
  {
    name: 'name',
    label: 'Customer Name',
    type: 'text',
    placeholder: 'Enter customer name',
    required: true,
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'Enter phone number',
    required: true,
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter email address',
    required: false,
  },
  {
    name: 'type',
    label: 'Customer Type',
    type: 'select',
    options: CUSTOMER_TYPE_OPTIONS,
    required: true,
  },
];

export const PAYMENT_FORM_FIELDS = [
  {
    name: 'method',
    label: 'Payment Method',
    type: 'select',
    options: PAYMENT_METHOD_OPTIONS,
    required: true,
  },
  {
    name: 'amount',
    label: 'Amount',
    type: 'number',
    placeholder: 'Enter amount',
    required: true,
  },
  {
    name: 'cardNumber',
    label: 'Card Number',
    type: 'text',
    placeholder: 'Enter card number',
    required: false,
    condition: (method: string) => method === 'card',
  },
  {
    name: 'expiryDate',
    label: 'Expiry Date',
    type: 'text',
    placeholder: 'MM/YY',
    required: false,
    condition: (method: string) => method === 'card',
  },
  {
    name: 'cvv',
    label: 'CVV',
    type: 'text',
    placeholder: 'Enter CVV',
    required: false,
    condition: (method: string) => method === 'card',
  },
  {
    name: 'reference',
    label: 'Transaction Reference',
    type: 'text',
    placeholder: 'Enter reference number',
    required: false,
    condition: (method: string) => method === 'digital',
  },
];

export const COUPON_FORM_FIELDS = [
  {
    name: 'couponCode',
    label: 'Coupon Code',
    type: 'text',
    placeholder: 'Enter coupon code',
    required: false,
  },
];

export const ORDER_NOTES_FIELDS = [
  {
    name: 'orderNotes',
    label: 'Order Notes',
    type: 'textarea',
    placeholder: 'Add any special notes for this order',
    required: false,
    multiline: true,
    rows: 3,
  },
];
