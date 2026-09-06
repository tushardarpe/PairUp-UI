export interface PaymentOrder {
  keyId: string;
  _id?: string;
  orderId: string;
  status: string;
  userId: string;
  amount: number;
  currency: string;
  receipt: string;
  notes: PaymentNotes;
}

export interface PaymentNotes {
  firstName?: string;
  lastName?: string;
  emailId?: string;
  membershipType: string;
  duration: 'monthly' | 'yearly';
}
