import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth.routes';
import { RouterModule } from '@angular/router';
import AuthService from './domain/AuthService';
import AuthApiDao from './data/AuthApiDao';
import { MaterialModule } from '../0common/material.module';
import { LoginPage } from './view/pages/login/login.page';

@NgModule({
  declarations: [ LoginPage ],
  imports: [CommonModule, AuthRoutingModule, MaterialModule],
  exports: [RouterModule],
  providers: [AuthService, AuthApiDao],
})
export class AuthModule {}
