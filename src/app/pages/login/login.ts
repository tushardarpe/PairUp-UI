import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LOGIN_CONSTANTS } from '../../../core/constants/login.constants';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { ROUTES } from '../../../core/constants/routes.constants';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/interfaces/auth/login-request.interface';

@Component({
  selector: 'app-login',
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
    email: this.fb.nonNullable.control('', [Validators.required]),
    password: this.fb.nonNullable.control('', [Validators.required]),
  });

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    console.log(this.loginForm);
    const formValue = this.loginForm.getRawValue();
    const payload: LoginRequest = {
      emailId: formValue.email,
      password: formValue.password,
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.authService.currentUser.set(response);

        console.log(response);

        this.router.navigate([this.routes.FEED]);
      },

      error: (error) => {
        console.log('Login Failed');

        console.log(error);
      },
    });
  }
}
