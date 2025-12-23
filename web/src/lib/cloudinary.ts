// Cloudinary configuration for TalentHunt BD
// Uses folder structure: talenthunt/{avatars,portfolios,attachments}

export const CLOUDINARY_FOLDERS = {
  AVATARS: "talenthunt/avatars",
  PORTFOLIOS: "talenthunt/portfolios",
  ATTACHMENTS: "talenthunt/attachments",
} as const;

// Generate Cloudinary upload signature (server-side only)
export function generateUploadSignature(folder: string, timestamp: number): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!cloudName || !apiSecret) {
    throw new Error("Cloudinary credentials not configured");
  }
  
  // Create signature string
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  
  // Use Web Crypto API (works in Cloudflare Workers)
  return toSign; // Will be hashed in the upload endpoint
}

// Get Cloudinary upload URL
export function getUploadUrl(): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
}

// Get Cloudinary image URL with transformations
export function getImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "thumb";
    quality?: "auto" | number;
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
  }
): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const { width, height, crop = "fill", quality = "auto", format = "auto" } = options || {};
  
  const transformations: string[] = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  
  const transformString = transformations.length ? transformations.join(",") + "/" : "";
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${publicId}`;
}

// Avatar URL helper (200x200 thumbnail)
export function getAvatarUrl(publicId: string | null): string | null {
  if (!publicId) return null;
  return getImageUrl(publicId, { width: 200, height: 200, crop: "thumb" });
}

// Portfolio image URL helper (800px width, auto height)
export function getPortfolioUrl(publicId: string): string {
  return getImageUrl(publicId, { width: 800, crop: "scale" });
}
