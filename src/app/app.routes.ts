import { Routes } from '@angular/router';
import { ROUTES } from '../core/constants/routes.constants';
import { authGuard } from '../core/guards/auth.guard';
import { guestGuard } from '../core/guards/guest.guard';

export const routes: Routes = [
  {
    path: ROUTES.HOME,
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    canActivate: [guestGuard],
  },

  {
    path: ROUTES.LOGIN,
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
  },

  {
    path: ROUTES.SIGNUP,
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
    canActivate: [guestGuard],
  },

  {
    path: ROUTES.FEED,
    loadComponent: () => import('./pages/feed/feed').then((m) => m.Feed),
    canActivate: [authGuard],
  },

  {
    path: ROUTES.CONNECTIONS,
    loadComponent: () => import('./pages/connections/connections').then((m) => m.Connections),
    canActivate: [authGuard],
  },

  {
    path: ROUTES.REQUESTS,
    loadComponent: () => import('./pages/connection-requests/connection-requests').then((m) => m.ConnectionRequests),
    canActivate: [authGuard],
  },

  {
    path: ROUTES.PROFILE,
    loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },
  {
    path: 'profile/edit',
    loadComponent: () => import('./pages/edit-profile/edit-profile').then((m) => m.EditProfile),
    canActivate: [authGuard],
  },

  {
    path: '**',
    redirectTo: ROUTES.HOME,
  },
];
