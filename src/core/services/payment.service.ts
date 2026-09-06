import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONSTANTS } from '../constants/api.constants';
import { CreateOrderRequest } from '../interfaces/payment/create-order-request.interface';
import { PaymentOrder } from '../interfaces/payment/payment-order.interface';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);

  createOrder(payload: CreateOrderRequest) {
    return this.http.post<PaymentOrder>(
      `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.PAYMENT.CREATE_ORDER}`,
      payload,
      { withCredentials: true },
    );
  }
}
