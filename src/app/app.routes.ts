import { Routes } from '@angular/router';
import { ROUTES } from '../core/constants/routes.constants';

export const routes: Routes = [
  {
    path: ROUTES.HOME,
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },

  {
    path: ROUTES.LOGIN,
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },

  {
    path: ROUTES.SIGNUP,
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
  },

  {
    path: ROUTES.FEED,
    loadComponent: () => import('./pages/feed/feed').then((m) => m.Feed),
  },

  {
    path: '**',
    redirectTo: ROUTES.HOME,
  },
];
