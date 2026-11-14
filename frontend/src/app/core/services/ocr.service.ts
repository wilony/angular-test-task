import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OcrItem } from '../models/ocr.models';

@Injectable({ providedIn: 'root' })
export class OcrService {
  private readonly http = inject(HttpClient);

  extractText(image: Blob): Observable<string> {
    // raw image bytes as the body
    return this.http.post<OcrItem[]>(environment.apiUrl, image, { headers: { 'Content-Type': image.type } })
      .pipe(
        map((items) => items
          .map((i) => i.text)
          .join(' ')
          .trim()
        ),
        catchError((err: HttpErrorResponse) => throwError(() => new Error(toMessage(err)))
      ),
    );
  }
}

const NETWORK_ERROR_MESSAGE = 'Unable to connect to the server';

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Failed to process the image',
  413: 'The image is too large',
  429: 'Rate limit exceeded, try again later',
};

const DEFAULT_ERROR_MESSAGE = 'Server error, try again';

function toMessage(err: HttpErrorResponse): string {
  if (err.status === 0) {
    return NETWORK_ERROR_MESSAGE;
  }

  return ERROR_MESSAGES[err.status] ?? DEFAULT_ERROR_MESSAGE;
}
