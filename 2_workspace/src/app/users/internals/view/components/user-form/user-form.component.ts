import { Component, inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserAdd } from '../../../commons/UserAdd';
import { FormBuilder, Validators } from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {

  private formBuilder = inject(FormBuilder);

  @Input()
  type!: string;

  @Input()
  user!: UserAdd;

  @Output()
  readonly userChange = new EventEmitter<UserAdd>();

  uForm = this.formBuilder.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    active: [false, Validators.required],
  });

  onFileChange($event: File | null) {
    this.user.picture = $event;
  }

  submit() {
    const onForm = this.uForm.value as UserAdd;
    onForm.picture = this.user.picture;
    this.userChange.emit(onForm);
  }

}

