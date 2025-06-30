import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './view/pages/login/login.page';
import { RegisterPage } from './view/pages/register/register.page';

const routes: Routes = [
  { path: '', component: LoginPage, },
  { path: 'register', component: RegisterPage, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
