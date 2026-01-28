import * as yup from 'yup';

// Customer Information Validation Schema
export const customerValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Customer name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{10,}$/, 'Phone number must be at least 10 digits'),
  email: yup
    .string()
    .email('Invalid email address')
    .nullable()
    .transform(v => (v === '' ? null : v)),
  type: yup
    .string()
    .required('Customer type is required')
    .oneOf(['walk-in', 'registered'], 'Invalid customer type'),
});

// Payment Information Validation Schema
export const paymentValidationSchema = yup.object().shape({
  method: yup
    .string()
    .required('Payment method is required')
    .oneOf(['cash', 'card', 'digital'], 'Invalid payment method'),
  amount: yup
    .number()
    .required('Payment amount is required')
    .positive('Amount must be greater than 0'),
  cardNumber: yup.string().when('method', {
    is: 'card',
    then: schema =>
      schema
        .required('Card number is required')
        .matches(/^\d{16}$/, 'Card number must be 16 digits'),
    otherwise: schema =>
      schema.nullable().transform(v => (v === '' ? null : v)),
  }),
  expiryDate: yup.string().when('method', {
    is: 'card',
    then: schema =>
      schema
        .required('Expiry date is required')
        .matches(/^\d{2}\/\d{2}$/, 'Expiry date must be in MM/YY format'),
    otherwise: schema =>
      schema.nullable().transform(v => (v === '' ? null : v)),
  }),
  cvv: yup.string().when('method', {
    is: 'card',
    then: schema =>
      schema
        .required('CVV is required')
        .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
    otherwise: schema =>
      schema.nullable().transform(v => (v === '' ? null : v)),
  }),
  reference: yup.string().when('method', {
    is: 'digital',
    then: schema => schema.required('Reference is required'),
    otherwise: schema =>
      schema.nullable().transform(v => (v === '' ? null : v)),
  }),
  saved: yup.boolean(),
});

// Coupon Information Validation Schema
export const couponValidationSchema = yup.object().shape({
  couponCode: yup
    .string()
    .nullable()
    .transform(v => (v === '' ? null : v))
    .min(3, 'Coupon code must be at least 3 characters'),
});

// Order Notes Validation Schema
export const orderNotesValidationSchema = yup.object().shape({
  orderNotes: yup
    .string()
    .nullable()
    .transform(v => (v === '' ? null : v))
    .max(500, 'Order notes must not exceed 500 characters'),
});

// Complete Cart Payment Form Validation Schema
export const cartPaymentValidationSchema = yup.object().shape({
  customerInfo: customerValidationSchema,
  payments: yup.array().of(paymentValidationSchema).required(),
  couponCode: yup.string().nullable(),
  orderNotes: yup.string().nullable(),
  receiptOptions: yup.object().shape({
    print: yup.boolean(),
    email: yup.boolean(),
    sms: yup.boolean(),
  }),
});
