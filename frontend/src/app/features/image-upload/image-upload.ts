import { Component, output, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { validateImageFile } from '../../core/utils/file-validator';

@Component({
  selector: 'app-image-upload',
  imports: [MatButton, MatIcon],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss',
})
export class ImageUpload {
  readonly fileSelected = output<File>();
  protected readonly error = signal<string | null>(null);
  protected readonly dragging = signal(false);

  protected onPick(input: HTMLInputElement): void {
    const file = input.files?.[0];
    input.value = ''; // allow re-selecting the same file

    if (file) {
      this.handle(file);
    }
  }

  protected onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(true);
  }

  protected onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(false);

    const file = e.dataTransfer?.files?.[0];

    if (file) {
      this.handle(file);
    }
  }

  private handle(file: File): void {
    const error = validateImageFile(file);
    this.error.set(error);

    if (!error) {
      this.fileSelected.emit(file);
    }
  }
}
