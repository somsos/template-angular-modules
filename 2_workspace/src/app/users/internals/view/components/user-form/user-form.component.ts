import { Component, inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IUserDto } from '../../../commons/IUserDto';
import { AppError } from '../../../../../0common';

@Component({
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

  @Output()
  readonly userSubmit = new EventEmitter<IUserDto>();

  uForm = this.formBuilder.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    active: [false, Validators.required],
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
    }
  }

  onFileChange($event: File | null) {
    this._file = $event;
  }

  submit() {
    const onForm = this.uForm.value as IUserDto;
    onForm.pictureFile = this._file;
    onForm.id = this.user.id;
    this.userSubmit.emit(onForm);
  }

}

