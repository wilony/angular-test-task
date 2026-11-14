import { MAX_FILE_SIZE, validateImageFile } from './file-validator';

function makeFile(type: string, size = 100): File {
  return new File([new Uint8Array(size)], 'x', { type });
}

describe('validateImageFile', () => {
  it('accepts JPEG and PNG', () => {
    expect(validateImageFile(makeFile('image/jpeg'))).toBeNull();
    expect(validateImageFile(makeFile('image/png'))).toBeNull();
  });

  it('rejects other types', () => {
    expect(validateImageFile(makeFile('image/gif'))).toContain('JPEG');
    expect(validateImageFile(makeFile('application/pdf'))).toContain('JPEG');
  });

  it('accepts exactly 2 MB and rejects larger', () => {
    expect(validateImageFile(makeFile('image/png', MAX_FILE_SIZE))).toBeNull();
    expect(validateImageFile(makeFile('image/png', MAX_FILE_SIZE + 1))).toContain('2MB');
  });
});
