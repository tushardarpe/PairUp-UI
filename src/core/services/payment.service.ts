import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONSTANTS } from '../constants/api.constants';
import { CreateOrderRequest } from '../interfaces/payment/create-order-request.interface';
import { PaymentOrder } from '../interfaces/payment/payment-order.interface';

export interface PremiumVerificationResponse {
  isPremium: boolean;
  membership?: {
    type: string;
    duration: string | null;
  } | null;
  membershipType?: string | null;
  duration?: string | null;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);

  verifyPremiumUser() {
    return this.http.get<PremiumVerificationResponse>(
      `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.PAYMENT.VERIFY_PREMIUM}`,
      { withCredentials: true },
    );
  }

  createOrder(payload: CreateOrderRequest) {
    return this.http.post<PaymentOrder>(
      `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.PAYMENT.CREATE_ORDER}`,
      payload,
      { withCredentials: true },
    );
  }
}
