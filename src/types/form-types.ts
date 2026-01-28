// Form types for CartPayment
export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  type: 'walk-in' | 'registered';
}

export interface PaymentMethod {
  id: string;
  method: 'cash' | 'card' | 'digital';
  amount: number;
  saved?: boolean;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  reference?: string;
}

export interface ReceiptOptions {
  print: boolean;
  email: boolean;
  sms: boolean;
}

export interface CartPaymentFormData {
  customerInfo: CustomerInfo;
  payments: PaymentMethod[];
  couponCode: string;
  orderNotes: string;
  receiptOptions: ReceiptOptions;
}
