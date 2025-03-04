import { Component, inject, Input, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IUserDto } from '../../../commons/IUserDto';
import { AppError, StringUtils } from '../../../../../0common';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UsersImagesStore } from '../../../data/mock/UsersImagesStore';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {

  private formBuilder = inject(FormBuilder);

  @Input()
  type!: string;

  @Input()
  user!: IUserDto;

  @Input()
  btnSubmitLabel!: String;

  private _file: File | null = null;

  public roles = [
    { id: 1, label: 'Users', selected: false },
    { id: 2, label: 'Products', selected: false },
  ];

  @Output()
  readonly userSubmit = new EventEmitter<IUserDto>();

  uForm = this.formBuilder.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    active: [false, Validators.required],
    //rolesForm: this.formBuilder.array([ ])
  });

  ngOnInit() {
    this._fillUpdateOrViewForm();
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
    this._extractUser();
    this.userSubmit.emit(this.user);
  }

  private _extractUser(): void {
    const onForm = this.uForm.value as IUserDto;
    onForm.id = this.user.id;
    const rolesSelected = this.roles
      .filter(o => o.selected)
      .map(o => ({ id: o.id, authority: '', }) as any)
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
    return UsersImagesStore.getUrlByUser(userId);
  }

}

