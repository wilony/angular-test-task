import { Component, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

const DURATION = 1500;

@Component({
  selector: 'app-text-result',
  imports: [MatButton, MatIcon],
  templateUrl: './text-result.html',
  styleUrl: './text-result.scss',
})
export class TextResult {
  readonly text = input.required<string>();
  private readonly snackBar = inject(MatSnackBar);

  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.text());
      this.snackBar.open('Copied', undefined, { duration: DURATION });
    } catch {
      this.snackBar.open('Failed to copy', undefined, { duration: DURATION });
    }
  }
}
