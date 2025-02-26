import { Routes } from '@angular/router';
import { LoginPage } from './auth/view/pages/login/login.page';

export const mainRoutes: Routes = [
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.module').then((m) => m.ProductsModule),
  },

  {
    path: 'users',
    loadChildren: () =>
      import('./users/externals/users.module').then((m) => m.UsersModule),
  },

  { path: 'login', component: LoginPage },

  { path: '', pathMatch: 'full', redirectTo: 'products' },
];
