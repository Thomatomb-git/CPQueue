import imageCompression from "browser-image-compression";

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface CompressionResult {
  file: File;
  error?: string;
}

export async function compressAvatarImage(file: File): Promise<CompressionResult> {
  // 1. Validasi tipe file
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      file,
      error: "Format gambar tidak didukung! Gunakan format .jpg, .png, atau .webp.",
    };
  }

  // 2. Validasi ukuran awal (maks 2MB sebelum kompresi atau setelah)
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > MAX_FILE_SIZEMB) {
    return {
      file,
      error: "Ukuran file terlalu besar! Maksimal 2 MB.",
    };
  }

  // 3. Kompresi gambar
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
    console.warn("Gagal mengompresi gambar, menggunakan file asli:", err);
    return { file };
  }
}
