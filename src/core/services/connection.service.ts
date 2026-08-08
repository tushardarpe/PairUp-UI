import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_CONSTANTS } from '../constants/api.constants';
import { User } from '../interfaces/user/user.interface';

export interface ConnectionRequest {
  _id: string;
  status: string;
  fromUserId: User;
  toUserId?: User;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private http = inject(HttpClient);

  getConnections(): Observable<User[]> {
    return this.http
      .get<ApiResponse<User[]>>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.USER.CONNECTIONS}`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.data));
  }

  getReceivedRequests(): Observable<ConnectionRequest[]> {
    return this.http
      .get<ApiResponse<ConnectionRequest[]>>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.USER.REQUESTS_RECEIVED}`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.data));
  }

  respondToRequest(requestId: string, status: 'accepted' | 'rejected') {
    return this.http.post(
      `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.REQUEST.REVIEW}/${status}/${requestId}`,
      {},
      {
        withCredentials: true,
      },
    );
  }
}
