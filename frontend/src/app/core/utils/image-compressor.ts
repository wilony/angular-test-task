import imageCompression from 'browser-image-compression';

export const API_MAX_BYTES = 200 * 1024;
export const API_MAX_SIZE_MB = API_MAX_BYTES / (1024 * 1024);

export async function compressForOcr(file: File): Promise<File> {
  if (file.size <= API_MAX_BYTES) {
    return file;
  }

  return imageCompression(file, {
    maxSizeMB: API_MAX_SIZE_MB,
    maxWidthOrHeight: 2048,
    fileType: 'image/jpeg',
  });
}
