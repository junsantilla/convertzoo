"use client"

import { useState } from "react"
import { ArrowRight, Download, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileDropZone } from "@/components/file-drop-zone"
import { FormatSelector } from "@/components/format-selector"
import { convertImage, isImageFile, formatFileSize, type ImageFormat } from "@/lib/image-converter"

export function ConverterCard() {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState<string>("")
  const [isConverting, setIsConverting] = useState(false)
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || ""
  }

  const handleConvert = async () => {
    if (!file || !outputFormat) return
    
    setError(null)
    setIsConverting(true)
    
    try {
      if (!isImageFile(file)) {
        throw new Error("Please select a valid image file")
      }
      
      const blob = await convertImage(file, outputFormat as ImageFormat)
      setConvertedBlob(blob)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed")
      setConvertedBlob(null)
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!convertedBlob || !file) return
    
    const originalName = file.name.split(".").slice(0, -1).join(".") || "converted"
    const downloadName = `${originalName}.${outputFormat}`
    
    const url = URL.createObjectURL(convertedBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = downloadName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    setFile(null)
    setOutputFormat("")
    setConvertedBlob(null)
    setError(null)
  }

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setConvertedBlob(null)
    setError(null)
    
    if (!isImageFile(selectedFile)) {
      setError("Please select an image file (PNG, JPG, WebP, GIF, BMP, or AVIF)")
    }
  }

  const inputFormat = file ? getFileExtension(file.name) : null
  const isConverted = convertedBlob !== null

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border-2 border-border rounded-xl p-8 space-y-8">
        {/* Step 1: Upload File */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
              1
            </span>
            <h2 className="text-xl font-bold text-foreground uppercase tracking-wide">
              Upload Image
            </h2>
          </div>
          <FileDropZone file={file} onFileSelect={handleFileSelect} onClear={handleClear} />
        </div>

        {/* Step 2: Select Output Format */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
              2
            </span>
            <h2 className="text-xl font-bold text-foreground uppercase tracking-wide">
              Select Output Format
            </h2>
          </div>
          <FormatSelector
            value={outputFormat}
            onValueChange={setOutputFormat}
            inputFormat={inputFormat}
          />
        </div>

        {/* Conversion Info */}
        {file && outputFormat && !error && (
          <div className="flex items-center justify-center gap-4 py-4 bg-muted rounded-lg">
            <div className="px-4 py-2 bg-card border-2 border-border rounded-lg">
              <span className="font-bold text-foreground uppercase">
                .{inputFormat}
              </span>
            </div>
            <ArrowRight className="w-6 h-6 text-accent" />
            <div className="px-4 py-2 bg-accent text-accent-foreground rounded-lg">
              <span className="font-bold uppercase">.{outputFormat}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border-2 border-destructive/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <span className="text-destructive font-medium">{error}</span>
          </div>
        )}

        {/* Success Info */}
        {isConverted && (
          <div className="flex items-center justify-between p-4 bg-accent/10 border-2 border-accent/20 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-foreground font-medium">Conversion complete!</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{formatFileSize(file?.size || 0)}</span>
              <ArrowRight className="w-4 h-4 inline mx-2" />
              <span className="font-medium text-accent">{formatFileSize(convertedBlob.size)}</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4">
          {!isConverted ? (
            <Button
              onClick={handleConvert}
              disabled={!file || !outputFormat || isConverting || !!error}
              className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Convert Image
                </>
              )}
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="h-14 px-6 text-lg font-bold border-2"
              >
                Convert Another
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
