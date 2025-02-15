import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.scss',
})
export class InputFileComponent {

  file: File | null = null;

  @Output()
  fileChange = new EventEmitter<File | null>();

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList) {
    const file = event && event.item(0);
    this.fileChange.emit(file);
  }

}
