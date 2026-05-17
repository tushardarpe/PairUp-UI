import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { APP_CONSTANTS } from '../../../../core/constants/app.constants';
import { ROUTES } from '../../../../core/constants/routes.constants';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly appConstants = APP_CONSTANTS;
  readonly routes = ROUTES;
  protected authService = inject(AuthService);
  private router = inject(Router);

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
