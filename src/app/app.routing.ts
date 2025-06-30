import { Routes } from '@angular/router';
import { LoginPage } from './auth/internals/view/pages/login/login.page';
import { RoleUserGuard } from './0common/auth/RoleUserGuard';

export const mainRoutes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./users').then((m) => m.UsersModule),
    canActivate: [ RoleUserGuard ],
    data: {acceptedRoles: ['users']}
  },

  {
    path: 'login',
    component: LoginPage,
  },

  {
    path: 'home',
    loadComponent: () => import('./main').then((m) => m.HomePage),
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];
