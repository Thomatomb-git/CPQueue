import imageCompression from "browser-image-compression";

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface CompressionResult {
  file: File;
  error?: string;
}

export async function compressAvatarImage(file: File): Promise<CompressionResult> {
  // 1. Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      file,
      error: "Unsupported image format! Please use .jpg, .png, or .webp.",
    };
  }

  // 2. Validate initial size (max 2MB before or after compression)
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    return {
      file,
      error: "File size is too large! Maximum 2 MB.",
    };
  }

  // 3. Compress image
  const options = {
    maxSizeMB: 0.5, // Target kompresi di bawah 500KB untuk avatar yang cepat di-load
    maxWidthOrHeight: 512,
    useWebWorker: true,
    fileType: file.type as string,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const compressedFile = new File([compressedBlob], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });
    return { file: compressedFile };
  } catch (err) {
    console.warn("Failed to compress image, using original file:", err);
    return { file };
  }
}
