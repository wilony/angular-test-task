import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { OcrService } from './ocr.service';

describe('OcrService', () => {
  let service: OcrService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(OcrService);
    http = TestBed.inject(HttpTestingController);
  });

  it('posts the image and joins the recognized text', () => {
    let result = '';
    const image = new Blob(['x'], { type: 'image/png' });
    service.extractText(image).subscribe((t) => (result = t));

    const req = http.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(image);
    expect(req.request.headers.get('Content-Type')).toBe('image/png');
    req.flush([{ text: 'Hello' }, { text: 'world' }]);

    expect(result).toBe('Hello world');
  });

  it('maps HTTP errors to a friendly message', () => {
    let message = '';
    service.extractText(new Blob(['x'])).subscribe({ error: (e: Error) => (message = e.message) });

    http.expectOne(environment.apiUrl).flush({}, { status: 429, statusText: 'Too Many' });

    expect(message).toContain('Rate limit');
  });
});
