import { Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { LoginPage } from './auth/view/pages/login/login.page';

export const mainRoutes: Routes = [
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.module').then((m) => m.ProductsModule),
  },

  { path: 'login', component: LoginPage },

  { path: '', pathMatch: 'full', redirectTo: 'products' },
];
