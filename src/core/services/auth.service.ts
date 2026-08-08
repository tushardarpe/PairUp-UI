import { computed, inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { API_CONSTANTS } from '../constants/api.constants';
import { User } from '../interfaces/user/user.interface';
import { LoginRequest } from '../interfaces/auth/login-request.interface';
import { LoginResponse } from '../interfaces/auth/login-response.interface';
import { SignupRequest } from '../interfaces/auth/signup-request.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  currentUser = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.currentUser());

  initializeUser() {
    return new Promise<void>((resolve) => {
      this.getProfile().subscribe({
        next: (user) => {
          this.currentUser.set(user);
          resolve();
        },
        error: () => {
          this.currentUser.set(null);
          resolve();
        },
      });
    });
  }

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.AUTH.LOGIN}`,
      payload,
      {
        withCredentials: true,
      },
    );
  }

  signup(payload: SignupRequest) {
    return this.http.post<string>(
      `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.AUTH.SIGNUP}`,
      payload,
      {
        withCredentials: true,
        responseType: 'text' as 'json',
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

  updateProfile(profile: Partial<User>) {
    return this.http
      .patch<any>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.PROFILE.EDIT}`, profile, {
        withCredentials: true,
      })
      .pipe(map((res) => (res && res.data ? res.data : res)));
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
