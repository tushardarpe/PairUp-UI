import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SignupRequest } from '../../../core/interfaces/auth/signup-request.interface';
import { ROUTES } from '../../../core/constants/routes.constants';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  readonly routes = ROUTES;
  readonly appConstants = APP_CONSTANTS;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  signupForm = this.fb.group({
    firstName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    lastName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
    gender: this.fb.nonNullable.control('male', [Validators.required]),
    age: this.fb.nonNullable.control(18, [Validators.required, Validators.min(13)]),
    photoUrl: this.fb.nonNullable.control('', [Validators.required]),
    about: this.fb.nonNullable.control('', [Validators.maxLength(300)]),
    skills: this.fb.nonNullable.control('', []),
  });

  get form() {
    return this.signupForm.controls;
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formValue = this.signupForm.getRawValue();
    const payload: SignupRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      emailId: formValue.email,
      password: formValue.password,
      gender: formValue.gender,
      age: formValue.age,
      photoUrl: formValue.photoUrl,
      about: formValue.about,
      skills: formValue.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill),
    };

    this.authService.signup(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Signup successful! Redirecting to login...');
        setTimeout(() => {
          this.router.navigate([this.routes.LOGIN]);
        }, 800);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Unable to sign up. Please try again.');
      },
    });
  }
}
