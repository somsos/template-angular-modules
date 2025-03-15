import { Routes } from '@angular/router';
import { LoginPage } from './auth/internals/view/pages/login/login.page';

export const mainRoutes: Routes = [
  {
    path: 'users',
    loadChildren: () =>
      import('./users').then((m) => m.UsersModule),
  },

  { path: 'login', component: LoginPage },

  { path: '', pathMatch: 'full', redirectTo: 'users' },
];
