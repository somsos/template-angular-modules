import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth.routes';
import { RouterModule } from '@angular/router';
import AuthService from './domain/AuthService';
import AuthApiDao from './data/AuthApiDao';

@NgModule({
  imports: [CommonModule, AuthRoutingModule],
  exports: [RouterModule],
  providers: [AuthService, AuthApiDao],
})
export class AuthModule {}
