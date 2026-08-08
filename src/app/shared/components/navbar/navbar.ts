import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { APP_CONSTANTS } from '../../../../core/constants/app.constants';
import { ROUTES } from '../../../../core/constants/routes.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { NAVBAR_CONSTANTS } from '../../../../core/constants/navbar.constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly appConstants = APP_CONSTANTS;
  readonly routes = ROUTES;
  protected authService = inject(AuthService);
  private router = inject(Router);
  readonly navbarConstants = NAVBAR_CONSTANTS;
  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    target.blur();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Clear frontend auth state

        this.authService.currentUser.set(null);

        // Navigate to home

        this.router.navigate([this.routes.HOME]);
      },

      error: (error) => {
        console.log(error);
      },
    });
  }
}
