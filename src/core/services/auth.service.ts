import { computed, inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { API_CONSTANTS } from '../constants/api.constants';
import { User } from '../interfaces/user/user.interface';
import { LoginRequest } from '../interfaces/auth/login-request.interface';
import { LoginResponse } from '../interfaces/auth/login-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  currentUser = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.currentUser());

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.AUTH.LOGIN}`,
      payload,
      {
        withCredentials: true,
      },
    );
  }

  getProfile() {
    return this.http.get<User>(
      `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.PROFILE.VIEW}`,

      {
        withCredentials: true,
      },
    );
  }

  logout() {
    return this.http.post(
      `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.AUTH.LOGOUT}`,

      {},

      {
        withCredentials: true,
      },
    );
  }
}
