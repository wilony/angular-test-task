import { TestBed } from '@angular/core/testing';
import { TextResult } from './text-result';

describe('TextResult', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('copies the text to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    const fixture = TestBed.createComponent(TextResult);
    fixture.componentRef.setInput('text', 'Hello');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    expect(writeText).toHaveBeenCalledWith('Hello');
  });

  it('shows a message when there is no text', () => {
    const fixture = TestBed.createComponent(TextResult);
    fixture.componentRef.setInput('text', '');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No text detected');
  });
});
