import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { User } from '../interfaces/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private http = inject(HttpClient);

  getFeed(limit: number): Observable<User[]> {
    return this.http.get<User[]>(
      `http://localhost:7777/api/user/feed?limit=${limit}`,

      {
        withCredentials: true,
      },
    );
  }

  sendRequest(status: string, userId: string) {
    return this.http.post(
      `http://localhost:7777/api/request/send/${status}/${userId}`,

      {},

      {
        withCredentials: true,
      },
    );
  }
}
