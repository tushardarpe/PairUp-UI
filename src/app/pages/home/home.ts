import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HOME_CONSTANTS } from '../../../core/constants/home.constants';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { ROUTES } from '../../../core/constants/routes.constants';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly homeConstants = HOME_CONSTANTS;
  readonly appConstants = APP_CONSTANTS;
  readonly routes = ROUTES;

  private authService = inject(AuthService);

  private router = inject(Router);

  constructor() {
    // effect(() => {
    //   const isLoggedIn = this.authService.isLoggedIn();

    //   if (isLoggedIn) {
    //     this.router.navigate([ROUTES.FEED]);
    //   }
    // });
  }
}
