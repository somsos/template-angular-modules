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
    path: 'blog/project-introduction',
    loadComponent: () => import('./main/internals/view/components/project-intruduction/project-introduction.component').then((m) => m.ProjectIntroductionComponent),
  },

  {
    path: 'blog/structured-data',
    loadComponent: () => import('./main/internals/view/components/structured-data/structured-data').then((m) => m.StructuredDataBlogComponent),
  },

  {
    path: 'blog/devops-importance',
    loadComponent: () => import('./main/internals/view/components/importancia-devops/importancia-devops').then((m) => m.ImportanciaDeDevops),
  },



  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },

];
