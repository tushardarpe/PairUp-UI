import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

import { ROUTES } from '../constants/routes.constants';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return router.createUrlTree([ROUTES.FEED]);
  }

  return true;
};
