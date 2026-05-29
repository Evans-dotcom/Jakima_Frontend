import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="file-upload-container">
      <input
        type="file"
        #fileInput
        style="display: none"
        (change)="onFileSelected($event)"
      />
      <button mat-raised-button color="accent" (click)="fileInput.click()">
        <mat-icon>upload_file</mat-icon>
        Upload Attachment
      </button>
    </div>
  `
})
export class FileUploadComponent {
  @Output() fileUploaded = new EventEmitter<File>();

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileUploaded.emit(file);
      // Reset input so the same file can be uploaded again if needed
      event.target.value = '';
    }
  }
}