import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ProductDto } from '../../../commons/ProductDto';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'products-form',
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss',
})
export class ProductsFormComponent implements OnInit {
  @Input()
  p!: ProductDto;

  @Output()
  readonly onSubmit = new EventEmitter<ProductDto>();

  private formBuilder = inject(FormBuilder);

  pForm = this.formBuilder.group({
    id: [0, Validators.required],
    name: [''],
    price: [0],
    description: [''],
  });

  ngOnInit(): void {
    this.pForm.controls.id.disable();
    this._syncForm();
  }

  private _syncForm() {
    this.pForm.controls.id.setValue(this.p.id);
    this.pForm.controls.name.setValue(this.p.name);
    this.pForm.controls.price.setValue(this.p.price);
    this.pForm.controls.description.setValue(this.p.description);
  }

  fnOnSubmit($event: Event) {
    $event.preventDefault();
    const newInfo = this.pForm.value as ProductDto;
    newInfo.id = this.p.id; // don't know why but with the disable it's set to undefined
    this.onSubmit.emit(newInfo);
  }
}
