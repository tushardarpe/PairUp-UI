import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { User } from '../interfaces/user/user.interface';
import { API_CONSTANTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private http = inject(HttpClient);

  getFeed(limit: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${API_CONSTANTS.USER.FEED}?limit=${limit}`,

      {
        withCredentials: true,
      },
    );
  }

  sendRequest(status: string, userId: string) {
    return this.http.post(
      `${API_CONSTANTS.REQUEST.SEND}/${status}/${userId}`,

      {},

      {
        withCredentials: true,
      },
    );
  }
}
