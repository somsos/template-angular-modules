import { Routes } from '@angular/router';

export const mainRoutes: Routes = [
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.module').then((m) => m.ProductsModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  { path: '', pathMatch: 'full', redirectTo: 'products' },
];
