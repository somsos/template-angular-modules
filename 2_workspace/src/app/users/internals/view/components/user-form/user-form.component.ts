import { Component, inject, Input, OnInit, Output, EventEmitter, ViewEncapsulation, DestroyRef } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { IUserDto } from '../../../commons/IUserDto';
import { AppError, StringUtils } from '../../../../../0common';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UsersImagesStore } from '../../../../../../mockBackend/UsersImagesStore';
import { environment } from '../../../../../../environments/environment';
import { UserDtoUtils } from '../../../commons/UserDtoUtils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, startWith } from 'rxjs';

const commonValidators = [Validators.required, Validators.minLength(3), Validators.maxLength(36)];
const updateValidators = [Validators.minLength(3), Validators.maxLength(16)];

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {

  private formBuilder = inject(FormBuilder);

  @Input()
  type!: 'update' | "add" | "view";

  @Input()
  user!: IUserDto;

  @Input()
  btnSubmitLabel!: String;

  private _file: File | null = null;

  public roles = [
    { id: -55, label: 'Users', selected: false },
    { id: -56, label: 'Products', selected: false },
  ];

  @Output()
  readonly userSubmit = new EventEmitter<IUserDto>();

  uForm = this.formBuilder.group({
    username:           ['', [ ...commonValidators ] ],
    email:              ['', [ ...commonValidators, Validators.email ] ],
    password:           ['', [ ...commonValidators ] ],
    confirmPassword:    ['', [ ...commonValidators ] ],
    oldPassword:        ['', [ ...commonValidators ] ],
    changePassEnabled:  [ false ],

  });

  private readonly _destroyRef = inject(DestroyRef);

  ngOnInit() {
    this._fillUpdateOrViewForm();
    if(this.type === "update") {
      this.uForm.controls.password.setValidators(updateValidators);
      this.uForm.controls.confirmPassword.setValidators(updateValidators);
      this.uForm.controls.oldPassword.setValidators(updateValidators);
      this.uForm.controls.changePassEnabled.valueChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter(v => v != undefined),
        startWith(false),
      )
      .subscribe((v)=>{
        if(v) {
          this.uForm.controls.password.enable();
          this.uForm.controls.confirmPassword.enable();
          this.uForm.controls.oldPassword.enable();
        } else {
          this.uForm.controls.password.disable();
          this.uForm.controls.confirmPassword.disable();
          this.uForm.controls.oldPassword.disable();
        }

      });
    }
  }

  private _fillUpdateOrViewForm() {
    if (this.type === 'update' || this.type === 'view') {
      if (this.user == undefined) {
        throw new AppError('User is required');
      }
      this.uForm.patchValue(this.user);
      this._showRolesUserFound();
    }
  }

  private _showRolesUserFound(): void {
    const newFormRolesState = this.roles.map(formRole => {
      let isSelected = false;
      for (let i = 0; i < this.user.roles.length; i++) {
        const idUser = this.user.roles[i].id;
        const idForm = formRole.id;
        if(idUser == idForm) {
          isSelected = true;
          break;
        }
      }
      formRole.selected = isSelected;
      return formRole;
    });
    console.log("newFormRolesState", newFormRolesState);
    this.roles = newFormRolesState;
  }

  onFileChange($event: File | null) {
    this._file = $event;
  }

  submit() {
    this.uForm.updateValueAndValidity();
    if(this.uForm.invalid) {
      return ;
    }
    this._extractUser();
    console.debug("user submitted", this.user);
    this.userSubmit.emit(this.user);
  }

  private _extractUser(): void {
    const onForm = this.uForm.value as IUserDto;
    onForm.id = this.user.id;
    const rolesSelected = this.roles
      .filter(o => o.selected)
      .map(o => ({ id: o.id, authority: o.label, }) as any)
    onForm.roles = rolesSelected;

    this.user = onForm;
    this.user.pictureFile = this._file;
  }

  onRoleChanged($event: MatCheckboxChange): void {
    const idChanged = StringUtils.toNumber($event.source.value);
    const indexChanged = this.roles.findIndex(o => o.id == idChanged);
    if(indexChanged === -1) {
      return ;
    }
    this.roles[indexChanged].selected = $event.checked;
  }

  getUrlPicture(userId: number): string {
    if(environment.backend.mock) {
      return UsersImagesStore.getUrlByUser(userId);
    } else {
      return UserDtoUtils.getUrlPicture(userId);
    }

  }

  checkConfirmPassword($event: any): void {
    const passConfirm = $event.target.value;
    if(!passConfirm) {
      return ;
    }
    const pass = this.uForm.controls.password.getRawValue();

    const cpErr = this.uForm.controls.confirmPassword;

    if(passConfirm !== pass) {
      cpErr.setErrors({ confirmPassword: true });
    } else {
      cpErr.setErrors(null);
    }
  }

  checkForErrorsIn(formControl: AbstractControl): string {
    if (formControl.hasError('required')) {
      return 'Min value is required'
    }

    if (formControl.hasError('min') || formControl.hasError('max')) {
      return 'Value must be between 1980 and 2020';
    }

    if (formControl.hasError('minlength')) {
      return 'Se requieren mas caracteres'
    }

    if (formControl.hasError('email')) {
      return 'Formato de email incorrecto'
    }

    if (formControl.hasError('maxlength')) {
      return 'se requieren menos caracteres'
    }

    if (formControl.hasError('confirmPassword')) {
      return 'contraseñas no coinciden'
    }



    return ''
  }

}

