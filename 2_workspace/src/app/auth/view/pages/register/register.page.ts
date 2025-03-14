import { Component, DestroyRef, Inject, inject, signal } from '@angular/core';
import AuthService from '../../../domain/AuthService';
//import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthDto, commonsNames, ErrorDto, ILayoutService } from '../../../../0common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'page-register',
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
})
export class RegisterPage {
  private _authSrv = inject(AuthService);
  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  public loginForm: FormGroup = this._formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    confirmPassword: ['', Validators.required],
  });
  public hidePassword = signal(true);

  constructor(
    @Inject(commonsNames.ILayoutService) private _layoutSrv: ILayoutService
  ) { }

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }

  onSubmit() {
    const toAuth = new AuthDto();
    toAuth.username = this.loginForm.controls['username'].getRawValue();
    toAuth.password = this.loginForm.controls['password'].getRawValue();
    toAuth.email = this.loginForm.controls['email'].getRawValue();
    const input = this.loginForm.controls['confirmPassword'];
    const confirmPassword = input.getRawValue();

    if(confirmPassword !== toAuth.password) {
      const err:ErrorDto = {  message:"Contraseñas no coinciden", cause:"", typeArg: 400 };
      this._layoutSrv.showError(err);
      input.setValue("");
      return ;
    }
    this._makeRequest(toAuth);
  }

  private _makeRequest(newAuth: AuthDto) {
    const reqRegister:Observable<AuthDto> = this._authSrv.register(newAuth);
    reqRegister
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe((_) => this._router.navigateByUrl('login') )

  }


}
