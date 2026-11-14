export const MAX_FILE_SIZE = 2 * 1024 * 1024; //2MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPEG or PNG';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Image size must be equal or less than 2MB';
  }

  return null;
}
