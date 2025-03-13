import { Component, DestroyRef, inject, signal } from '@angular/core';
import AuthService from '../../../domain/AuthService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, first, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthDto } from '../../../../0common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private _authSrv = inject(AuthService);
  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  public userAuth = this._observeLoginSuccess();
  public loginForm: FormGroup;
  public hidePassword = signal(true);

  constructor() {
    this.loginForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }

  onSubmit() {
    const toAuth = new AuthDto();
    toAuth.username = this.loginForm.controls['username'].getRawValue();
    toAuth.password = this.loginForm.controls['password'].getRawValue();
    this._authSrv.login(toAuth);
  }

  /*
  onSubmitMario1() {
    const toAuth = new AuthDto();
    toAuth.id = 1;
    toAuth.username = 'mario1';
    toAuth.password = 'mario1p';
    this._authSrv.login(toAuth);
  }

  onSubmitError() {
    const toAuth = new AuthDto();
    toAuth.id = 111;
    toAuth.username = 'marioError';
    toAuth.password = 'marioErrorp';

    this._authSrv.login(toAuth);
  }
    */

  private _observeLoginSuccess(): Observable<AuthDto> {
    const subs = this._authSrv.getUserLogged().pipe(
      filter((u) => u != undefined),
      first(),
      tap({
        complete: () => {
          this._router.navigateByUrl('users');
        },
      }),
      takeUntilDestroyed(this._destroyRef)
    );
    subs.subscribe();
    return subs;
  }
}
