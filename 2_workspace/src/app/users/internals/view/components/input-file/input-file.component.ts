/*
import { Component, EventEmitter, HostListener, Output } from '@angular/core';

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
*/

import { Component, signal, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-upload',
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.scss',
})
export class InputFileComponent {
  imageName = signal('');
  fileSize = signal(0);
  uploadProgress = signal(0);
  imagePreview = signal('');
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;

  @Output()
  fileChange = new EventEmitter<File | null>();

  constructor(private snackBar: MatSnackBar) {}

  // Handler for file input change
  onFileChange(event: any): void {
    const file = event.target.files[0] as File | null;
    this.uploadFile(file); //Original
    this.fileChange.emit(file); //New
  }

  // Handler for file drop
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0] as File | null;
    this.uploadFile(file);
  }

  // Prevent default dragover behavior
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Method to handle file upload
  uploadFile(file: File | null): void {
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.fileSize.set(Math.round(file.size / 1024)); // Set file size in KB

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string); // Set image preview URL
      };
      reader.readAsDataURL(file);

      this.uploadSuccess = true;
      this.uploadError = false;
      this.imageName.set(file.name); // Set image name
    } else {
      this.uploadSuccess = false;
      this.uploadError = true;
      this.snackBar.open('Only image files are supported!', 'Close', {
        duration: 3000,
        panelClass: 'error',
      });
    }
  }

  // Method to remove the uploaded image
  removeImage(): void {
    this.selectedFile = null;
    this.imageName.set('');
    this.fileSize.set(0);
    this.imagePreview.set('');
    this.uploadSuccess = false;
    this.uploadError = false;
    this.uploadProgress.set(0);
  }
}
