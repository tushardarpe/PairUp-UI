import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserCard } from '../../shared/components/user-card/user-card';
import { AuthService } from '../../../core/services/auth.service';
import { ROUTES } from '../../../core/constants/routes.constants';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserCard],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss',
})
export class EditProfile {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly routes = ROUTES;

  user = computed(() => this.authService.currentUser());
  saving = signal(false);
  showDiscardModal = signal(false);
  toastMessage = signal('');
  showToast = signal(false);
  toastType = signal<'success' | 'error'>('success');

  editProfileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', Validators.required],
    age: [0, [Validators.required, Validators.min(18)]],
    gender: ['', Validators.required],
    photoUrl: ['', Validators.required],
    about: ['', [Validators.maxLength(300)]],
  });

  // Live preview signal that updates whenever the form, skills or current user changes
  // Initialize with a safe default User to satisfy child component required input
  preview = signal<import('../../../core/interfaces/user/user.interface').User>({
    _id: 'preview',
    firstName: '',
    lastName: '',
    emailId: '',
    age: 0,
    photoUrl: '',
    gender: '',
    about: '',
    skills: [],
    createdAt: '',
    updatedAt: '',
  });

  skills = signal<string[]>([]);
  newSkill = signal('');

  constructor() {
    effect(() => {
      const user = this.user();
      if (!user) {
        return;
      }

      this.editProfileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        gender: user.gender,
        photoUrl: user.photoUrl,
        about: user.about,
      });

      this.skills.set(user.skills ?? []);
    });

    // Keep preview in sync with form values and current user data
    effect(() => {
      const user = this.user();
      const form = this.editProfileForm.getRawValue();
      const skills = this.skills();

      const p = {
        _id: user?._id ?? 'preview',
        firstName: form.firstName ?? user?.firstName ?? '',
        lastName: form.lastName ?? user?.lastName ?? '',
        emailId: user?.emailId ?? '',
        photoUrl: form.photoUrl ?? user?.photoUrl ?? '',
        about: form.about ?? user?.about ?? '',
        skills: skills,
        age: form.age ?? user?.age ?? 0,
        gender: form.gender ?? user?.gender ?? '',
        createdAt: user?.createdAt ?? '',
        updatedAt: user?.updatedAt ?? '',
      } as import('../../../core/interfaces/user/user.interface').User;

      this.preview.set(p);
    });

    // Also update preview live as form values change (fires on each keystroke)
    this.editProfileForm.valueChanges.subscribe((formValues) => {
      const user = this.user();
      const skills = this.skills();

      const p = {
        _id: user?._id ?? 'preview',
        firstName: formValues.firstName ?? user?.firstName ?? '',
        lastName: formValues.lastName ?? user?.lastName ?? '',
        emailId: user?.emailId ?? '',
        photoUrl: formValues.photoUrl ?? user?.photoUrl ?? '',
        about: formValues.about ?? user?.about ?? '',
        skills: skills,
        age: formValues.age ?? user?.age ?? 0,
        gender: formValues.gender ?? user?.gender ?? '',
        createdAt: user?.createdAt ?? '',
        updatedAt: user?.updatedAt ?? '',
      } as import('../../../core/interfaces/user/user.interface').User;

      this.preview.set(p);
    });
  }

  addSkill() {
    const skill = this.newSkill().trim();

    if (!skill) {
      return;
    }

    this.skills.update((skills) => [...skills, skill]);

    this.newSkill.set('');
  }

  removeSkill(skill: string) {
    this.skills.update((skills) => skills.filter((item) => item !== skill));
  }

  confirmCancel() {
    this.showDiscardModal.set(true);
  }

  discardChanges() {
    this.showDiscardModal.set(false);
    this.router.navigate([this.routes.FEED]).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }

  stayOnPage() {
    this.showDiscardModal.set(false);
  }

  private showToastMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
      this.toastMessage.set('');
    }, 3000);
  }

  saveProfile() {
    console.log('saveProfile called', this.editProfileForm.invalid, this.editProfileForm.value);
    if (this.editProfileForm.invalid) {
      this.editProfileForm.markAllAsTouched();

      return;
    }

    const formValue = this.editProfileForm.getRawValue();
    const profileData = {
      ...formValue,
      skills: this.skills(),
    } as Partial<import('../../../core/interfaces/user/user.interface').User>;

    console.log('updateProfile payload', profileData);
    this.saving.set(true);

    this.authService.updateProfile(profileData).subscribe({
      next: (user) => {
        this.saving.set(false);
        // authoritative server-side user
        this.authService.currentUser.set(user);
        this.preview.set(user);
        this.editProfileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          gender: user.gender,
          photoUrl: user.photoUrl,
          about: user.about,
        });
        this.showToastMessage('Profile saved successfully', 'success');
      },
      error: (err) => {
        this.saving.set(false);
        const msg = err?.error?.message ?? 'Unable to save profile. Please try again.';
        this.showToastMessage(msg, 'error');
      },
    });
  }
}
