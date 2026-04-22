"use client";

import { useState } from "react";
import {
    Download,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Zap,
    Eye,
    EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileDropZone } from "@/components/file-drop-zone";
import { Slider } from "@/components/ui/slider";
import {
    compressImage,
    isImageFile,
    formatFileSize,
    calculateCompressionPercentage,
} from "@/lib/image-converter";

interface CompressionResult {
    file: File;
    blob: Blob | null;
    error: string | null;
    isCompressing: boolean;
}

export function ImageCompressor() {
    const [files, setFiles] = useState<File[]>([]);
    const [quality, setQuality] = useState<number>(80);
    const [compressions, setCompressions] = useState<
        Map<string, CompressionResult>
    >(new Map());
    const [isCompressingAll, setIsCompressingAll] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [preview, setPreview] = useState<{
        file: File;
        originalBlob: Blob | null;
    }>({ file: null as any, originalBlob: null });
    const [showPreview, setShowPreview] = useState(false);

    const getFileKey = (file: File, index: number) => `${file.name}-${index}`;

    const handlePreview = (file: File, blob: Blob | null) => {
        setPreview({ file, originalBlob: blob });
        setShowPreview(true);
    };

    const handleCompressAll = async () => {
        if (files.length === 0) return;

        setGlobalError(null);
        setIsCompressingAll(true);

        // Initialize compression status for all files
        const newCompressions = new Map<string, CompressionResult>();
        files.forEach((file, index) => {
            newCompressions.set(getFileKey(file, index), {
                file,
                blob: null,
                error: null,
                isCompressing: true,
            });
        });
        setCompressions(newCompressions);

        // Compress each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const key = getFileKey(file, i);

            try {
                if (!isImageFile(file)) {
                    throw new Error("Invalid image file");
                }

                const blob = await compressImage(file, quality / 100);
                newCompressions.set(key, {
                    file,
                    blob,
                    error: null,
                    isCompressing: false,
                });
            } catch (err) {
                const errorMsg =
                    err instanceof Error ? err.message : "Compression failed";
                newCompressions.set(key, {
                    file,
                    blob: null,
                    error: errorMsg,
                    isCompressing: false,
                });
            }
        }

        setCompressions(newCompressions);
        setIsCompressingAll(false);
    };

    const handleDownloadFile = (file: File, blob: Blob, index: number) => {
        const originalName =
            file.name.split(".").slice(0, -1).join(".") || "compressed";
        const ext = file.name.split(".").pop() || "jpg";
        const downloadName = `${originalName}-compressed.${ext}`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadAll = () => {
        compressions.forEach((result) => {
            if (result.blob) {
                const originalName =
                    result.file.name.split(".").slice(0, -1).join(".") ||
                    "compressed";
                const ext = result.file.name.split(".").pop() || "jpg";
                const downloadName = `${originalName}-compressed.${ext}`;

                const url = URL.createObjectURL(result.blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = downloadName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        });
    };

    const handleClearAll = () => {
        setFiles([]);
        setCompressions(new Map());
        setGlobalError(null);
        setShowPreview(false);
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);

        // Clear compression for this file
        const key = getFileKey(files[index], index);
        compressions.delete(key);
        setCompressions(new Map(compressions));

        // Reset if no files left
        if (newFiles.length === 0) {
            setCompressions(new Map());
            setGlobalError(null);
            setShowPreview(false);
        }
    };

    const handleFileSelect = (selectedFiles: File[]) => {
        const validFiles = selectedFiles.filter((file) => {
            if (!isImageFile(file)) {
                setGlobalError(`${file.name} is not a valid image file`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setFiles(validFiles);
            setCompressions(new Map());
            setGlobalError(null);
        }
    };

    const isCompressed =
        compressions.size > 0 &&
        Array.from(compressions.values()).every((c) => !c.isCompressing);
    const successCount = Array.from(compressions.values()).filter(
        (c) => c.blob !== null,
    ).length;
    const errorCount = Array.from(compressions.values()).filter(
        (c) => c.error !== null,
    ).length;

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-card border-2 border-border rounded-xl p-8 space-y-8">
                {/* Step 1: Upload Files */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            1
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                            Select Images
                        </h2>
                    </div>
                    <FileDropZone
                        onFileSelect={handleFileSelect}
                        files={files}
                        onRemoveFile={handleRemoveFile}
                        onClearAll={handleClearAll}
                    />
                </div>

                {/* Step 2: Quality Settings */}
                {files.length > 0 && (
                    <div className="space-y-4 border-t-2 border-border pt-8">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                2
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Compression Quality
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="quality"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Quality Level
                                    </label>
                                    <span className="text-sm font-bold text-primary">
                                        {quality}%
                                    </span>
                                </div>
                                <Slider
                                    id="quality"
                                    min={10}
                                    max={100}
                                    step={1}
                                    value={[quality]}
                                    onValueChange={(value) =>
                                        setQuality(value[0])
                                    }
                                    className="w-full"
                                />
                            </div>

                            <div className="bg-muted rounded-lg p-4 space-y-2">
                                <p className="text-xs text-muted-foreground font-medium">
                                    QUALITY GUIDE:
                                </p>
                                <ul className="text-xs space-y-1 text-muted-foreground">
                                    <li>
                                        •{" "}
                                        <span className="font-medium">
                                            90-100%:
                                        </span>{" "}
                                        Nearly lossless, largest file size
                                    </li>
                                    <li>
                                        •{" "}
                                        <span className="font-medium">
                                            70-89%:
                                        </span>{" "}
                                        High quality, good compression
                                    </li>
                                    <li>
                                        •{" "}
                                        <span className="font-medium">
                                            50-69%:
                                        </span>{" "}
                                        Medium quality, more compression
                                    </li>
                                    <li>
                                        •{" "}
                                        <span className="font-medium">
                                            &lt;50%:
                                        </span>{" "}
                                        Low quality, maximum compression
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Compress */}
                {files.length > 0 && !isCompressed && (
                    <div className="flex gap-3 border-t-2 border-border pt-8">
                        <Button
                            onClick={handleCompressAll}
                            disabled={isCompressingAll}
                            size="lg"
                            className="flex-1"
                        >
                            {isCompressingAll ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Compressing...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4 mr-2" />
                                    Compress All
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {/* Error Message */}
                {globalError && (
                    <div className="flex gap-3 rounded-lg bg-destructive/10 border-2 border-destructive/30 p-4">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-destructive">
                                {globalError}
                            </p>
                        </div>
                    </div>
                )}

                {/* Results */}
                {isCompressed && (
                    <div className="space-y-4 border-t-2 border-border pt-8">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                3
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Compression Results
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-xs text-muted-foreground mb-1">
                                    Success
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {successCount}/{files.length}
                                </p>
                            </div>
                            {errorCount > 0 && (
                                <div className="bg-destructive/10 rounded-lg p-4">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Errors
                                    </p>
                                    <p className="text-2xl font-bold text-destructive">
                                        {errorCount}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            {files.map((file, index) => {
                                const key = getFileKey(file, index);
                                const result = compressions.get(key);
                                if (!result) return null;

                                const compressionPercent = result.blob
                                    ? calculateCompressionPercentage(
                                          file.size,
                                          result.blob.size,
                                      )
                                    : 0;

                                return (
                                    <div
                                        key={key}
                                        className="border-2 border-border bg-card rounded-lg p-4 space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <p className="font-medium text-foreground truncate">
                                                        {file.name}
                                                    </p>
                                                    {result.blob && (
                                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                    )}
                                                    {result.error && (
                                                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                                                    )}
                                                </div>

                                                {result.blob ? (
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            <p className="text-muted-foreground">
                                                                Original Size
                                                            </p>
                                                            <p className="font-semibold text-foreground">
                                                                {formatFileSize(
                                                                    file.size,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">
                                                                Compressed Size
                                                            </p>
                                                            <p className="font-semibold text-foreground">
                                                                {formatFileSize(
                                                                    result.blob
                                                                        .size,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <p className="text-muted-foreground">
                                                                Reduction
                                                            </p>
                                                            <p className="font-semibold text-green-600">
                                                                {
                                                                    compressionPercent
                                                                }
                                                                % smaller
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-destructive">
                                                        {result.error}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-2 flex-shrink-0">
                                                {result.blob && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handlePreview(
                                                                    file,
                                                                    result.blob,
                                                                )
                                                            }
                                                            title="Preview"
                                                        >
                                                            {showPreview &&
                                                            preview.file ===
                                                                file ? (
                                                                <EyeOff className="w-4 h-4" />
                                                            ) : (
                                                                <Eye className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDownloadFile(
                                                                    file,
                                                                    result.blob!,
                                                                    index,
                                                                )
                                                            }
                                                            title="Download"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <Button
                            onClick={handleDownloadAll}
                            disabled={successCount === 0}
                            size="lg"
                            className="w-full"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download All Compressed Images
                        </Button>

                        <Button
                            onClick={handleClearAll}
                            variant="outline"
                            size="lg"
                            className="w-full"
                        >
                            Compress More Images
                        </Button>
                    </div>
                )}

                {/* Preview Modal */}
                {showPreview && preview.originalBlob && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-background rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-foreground">
                                    {preview.file.name}
                                </h3>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">
                                        Compressed Preview
                                    </p>
                                    <img
                                        src={URL.createObjectURL(
                                            preview.originalBlob,
                                        )}
                                        alt="Compressed preview"
                                        className="w-full rounded-lg border-2 border-border"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">
                                            Original Size
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {formatFileSize(preview.file.size)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">
                                            Compressed Size
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {formatFileSize(
                                                preview.originalBlob.size,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
