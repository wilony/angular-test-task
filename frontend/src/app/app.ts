import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { compressForOcr } from './core/utils/image-compressor';
import { Status } from './core/models/ocr.models';
import { OcrService } from './core/services/ocr.service';
import { ImagePreview } from './features/image-preview/image-preview';
import { ImageUpload } from './features/image-upload/image-upload';
import { TextResult } from './features/text-result/text-result';

@Component({
  selector: 'app-root',
  imports: [MatButton, MatCard, MatCardContent, MatProgressSpinner, ImageUpload, ImagePreview, TextResult],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly ocr = inject(OcrService);

  protected readonly file = signal<File | null>(null);
  protected readonly status = signal<Status>('idle');
  protected readonly text = signal('');
  protected readonly error = signal('');

  protected onFileSelected(file: File): void {
    this.file.set(file);
    this.status.set('idle');
    this.text.set('');
    this.error.set('');
  }

  protected async recognize(): Promise<void> {
    const file = this.file();
    if (!file || this.status() === 'loading') {
      return;
    }

    this.status.set('loading');

    try {
      const image = await compressForOcr(file);

      this.ocr
        .extractText(image)
        .subscribe({
          next: (text) => {
            this.text.set(text);
            this.status.set('success');
          },
          error: (e: Error) => this.fail(e.message),
        });
    } catch {
      this.fail('Failed to prepare the image');
    }
  }

  private fail(message: string): void {
    this.error.set(message);
    this.status.set('error');
  }
}
