import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth.routes';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../0common/material.module';
import { MaterialForms } from '../../0common/MaterialForms.module';
import { LoginPage } from './view/pages/login/login.page';
import { RegisterPage } from './view/pages/register/register.page';
import AuthService from './domain/AuthService';
import AuthApiDao from './data/AuthApiDao';

@NgModule({
  declarations: [ LoginPage, RegisterPage ],
  imports: [CommonModule, AuthRoutingModule, MaterialModule, MaterialForms],
  exports: [RouterModule],
  providers: [AuthService, AuthApiDao],
})
export class AuthModule {}
