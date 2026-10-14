export interface StorageUploadValidation {
  valid: boolean;
  error?: string;
}

export const STORAGE_LIMITS = {
  avatars: {
    maxSizeBytes: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  community: {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  marketplace: {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
} as const;

export type StorageBucket = keyof typeof STORAGE_LIMITS;

export function validateImageUpload(
  bucket: StorageBucket,
  fileSize: number,
  mimeType: string
): StorageUploadValidation {
  const config = STORAGE_LIMITS[bucket];
  if (!config) {
    return { valid: false, error: "अवैध स्टोरेज बकेट (Invalid storage bucket)" };
  }

  if (fileSize > config.maxSizeBytes) {
    const mbLimit = config.maxSizeBytes / (1024 * 1024);
    return {
      valid: false,
      error: `फाइल आकार कमाल ${mbLimit} MB पेक्षा कमी असावा (File size exceeds ${mbLimit}MB limit)`,
    };
  }

  if (!config.allowedMimeTypes.includes(mimeType as any)) {
    return {
      valid: false,
      error: "केवळ JPG, PNG किंवा WebP फॉरमॅटमधील फोटो स्वीकारले जातात (Only JPG, PNG, and WebP images allowed)",
    };
  }

  return { valid: true };
}
