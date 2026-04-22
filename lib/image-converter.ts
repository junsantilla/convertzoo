export const IMAGE_FORMATS = {
    png: {
        mimeType: "image/png",
        label: "PNG",
        description: "Lossless compression, supports transparency",
    },
    jpg: {
        mimeType: "image/jpeg",
        label: "JPG",
        description: "Best for photos, smaller file size",
    },
    jpeg: {
        mimeType: "image/jpeg",
        label: "JPEG",
        description: "Best for photos, smaller file size",
    },
    webp: {
        mimeType: "image/webp",
        label: "WebP",
        description: "Modern format, excellent compression",
    },
    gif: {
        mimeType: "image/gif",
        label: "GIF",
        description: "Supports animation, limited colors",
    },
    bmp: {
        mimeType: "image/bmp",
        label: "BMP",
        description: "Uncompressed bitmap format",
    },
    ico: {
        mimeType: "image/x-icon",
        label: "ICO",
        description: "Icon format for Windows",
    },
    avif: {
        mimeType: "image/avif",
        label: "AVIF",
        description: "Next-gen format, best compression",
    },
} as const;

export type ImageFormat = keyof typeof IMAGE_FORMATS;

export function isImageFile(file: File): boolean {
    return file.type.startsWith("image/");
}

export function getImageFormat(filename: string): ImageFormat | null {
    const ext = filename.split(".").pop()?.toLowerCase() as ImageFormat;
    return ext && ext in IMAGE_FORMATS ? ext : null;
}

export async function convertImage(
    file: File,
    outputFormat: ImageFormat,
    quality: number = 0.92,
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            // For formats that don't support transparency, fill with white background
            const formatInfo = IMAGE_FORMATS[outputFormat];
            if (
                formatInfo.mimeType === "image/jpeg" ||
                formatInfo.mimeType === "image/bmp"
            ) {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error("Failed to convert image"));
                    }
                },
                formatInfo.mimeType,
                quality,
            );
        };

        img.onerror = () => {
            reject(new Error("Failed to load image"));
        };

        img.src = URL.createObjectURL(file);
    });
}

export async function compressImage(
    file: File,
    quality: number = 0.8,
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            ctx.drawImage(img, 0, 0);

            // Determine the format - for JPEG files use JPEG, otherwise PNG
            const format =
                file.type === "image/jpeg" ? "image/jpeg" : "image/png";

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error("Failed to compress image"));
                    }
                },
                format,
                quality,
            );
        };

        img.onerror = () => {
            reject(new Error("Failed to load image"));
        };

        img.src = URL.createObjectURL(file);
    });
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function calculateCompressionPercentage(
    originalSize: number,
    compressedSize: number,
): number {
    if (originalSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}
