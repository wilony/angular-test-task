import { Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.html',
  styleUrl: './image-preview.scss',
})
export class ImagePreview {
  readonly file = input.required<File>();
  protected readonly url = signal('');

  constructor() {
    effect((onCleanup) => {
      const objectUrl = URL.createObjectURL(this.file());
      this.url.set(objectUrl);
      onCleanup(() => URL.revokeObjectURL(objectUrl));
    });
  }
}
