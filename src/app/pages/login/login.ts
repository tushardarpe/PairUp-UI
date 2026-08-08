import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LOGIN_CONSTANTS } from '../../../core/constants/login.constants';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { ROUTES } from '../../../core/constants/routes.constants';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/interfaces/auth/login-request.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly loginConstants = LOGIN_CONSTANTS;
  readonly appConstants = APP_CONSTANTS;
  readonly routes = ROUTES;
  private fb = inject(FormBuilder);
  loginForm = this.fb.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),

    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
  });

  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);

  errorMessage = signal('');

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    this.loading.set(true);

    this.errorMessage.set('');

    const formValue = this.loginForm.getRawValue();

    const payload: LoginRequest = {
      emailId: formValue.email,
      password: formValue.password,
    };

    this.authService.login(payload).subscribe({
      next: (user) => {
        this.loading.set(false);

        this.authService.currentUser.set(user);

        this.router.navigate([this.routes.FEED]);
      },

      error: (err) => {
        this.loading.set(false);

        this.loading.set(false);

        this.errorMessage.set(err.error.message);
      },
    });
  }
}
