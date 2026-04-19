"use client"

import { useState } from "react"
import { ArrowRight, Download, Loader2, Sparkles, AlertCircle, CheckCircle2, DownloadCloud, FileType } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileDropZone } from "@/components/file-drop-zone"
import { FormatSelector } from "@/components/format-selector"
import { convertImage, isImageFile, formatFileSize, type ImageFormat } from "@/lib/image-converter"

interface ConversionResult {
  file: File
  blob: Blob | null
  error: string | null
  isConverting: boolean
}

export function ConverterCard() {
  const [files, setFiles] = useState<File[]>([])
  const [outputFormat, setOutputFormat] = useState<string>("")
  const [conversions, setConversions] = useState<Map<string, ConversionResult>>(new Map())
  const [isConvertingAll, setIsConvertingAll] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || ""
  }

  const getFileKey = (file: File, index: number) => `${file.name}-${index}`

  const handleConvertAll = async () => {
    if (files.length === 0 || !outputFormat) return
    
    setGlobalError(null)
    setIsConvertingAll(true)

    // Initialize conversion status for all files
    const newConversions = new Map<string, ConversionResult>()
    files.forEach((file, index) => {
      newConversions.set(getFileKey(file, index), {
        file,
        blob: null,
        error: null,
        isConverting: true,
      })
    })
    setConversions(newConversions)

    // Convert each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const key = getFileKey(file, i)
      
      try {
        if (!isImageFile(file)) {
          throw new Error("Invalid image file")
        }
        
        const blob = await convertImage(file, outputFormat as ImageFormat)
        newConversions.set(key, { file, blob, error: null, isConverting: false })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Conversion failed"
        newConversions.set(key, { file, blob: null, error: errorMsg, isConverting: false })
      }
    }
    
    setConversions(newConversions)
    setIsConvertingAll(false)
  }

  const handleDownloadFile = (file: File, blob: Blob, index: number) => {
    const originalName = file.name.split(".").slice(0, -1).join(".") || "converted"
    const downloadName = `${originalName}.${outputFormat}`
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = downloadName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadAll = () => {
    conversions.forEach((result) => {
      if (result.blob) {
        const originalName = result.file.name.split(".").slice(0, -1).join(".") || "converted"
        const downloadName = `${originalName}.${outputFormat}`
        
        const url = URL.createObjectURL(result.blob)
        const a = document.createElement("a")
        a.href = url
        a.download = downloadName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    })
  }

  const handleClearAll = () => {
    setFiles([])
    setOutputFormat("")
    setConversions(new Map())
    setGlobalError(null)
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    
    // Clear conversion for this file
    const key = getFileKey(files[index], index)
    conversions.delete(key)
    setConversions(new Map(conversions))

    // Reset if no files left
    if (newFiles.length === 0) {
      setConversions(new Map())
      setGlobalError(null)
    }
  }

  const handleFileSelect = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter((file) => {
      if (!isImageFile(file)) {
        setGlobalError(`${file.name} is not a valid image file`)
        return false
      }
      return true
    })
    
    if (validFiles.length > 0) {
      setFiles(validFiles)
      setConversions(new Map())
      setGlobalError(null)
    }
  }

  const isConverted = conversions.size > 0 && Array.from(conversions.values()).every(c => !c.isConverting)
  const successCount = Array.from(conversions.values()).filter(c => c.blob !== null).length
  const errorCount = Array.from(conversions.values()).filter(c => c.error !== null).length
  const inputFormats = files.length > 0 ? [...new Set(files.map(f => getFileExtension(f.name)))] : []

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-card border-2 border-border rounded-xl p-8 space-y-8">
        {/* Step 1: Upload Files */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
              1
            </span>
            <h2 className="text-xl font-bold text-foreground uppercase tracking-wide">
              Upload Images
            </h2>
          </div>
          <FileDropZone 
            files={files} 
            onFileSelect={handleFileSelect} 
            onRemoveFile={handleRemoveFile}
            onClearAll={handleClearAll}
          />
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
            inputFormat={inputFormats.length > 0 ? inputFormats[0] : null}
          />
        </div>

        {/* Conversion Info */}
        {files.length > 0 && outputFormat && !globalError && (
          <div className="flex items-center justify-center gap-4 py-4 bg-muted rounded-lg flex-wrap">
            {inputFormats.map((fmt, idx) => (
              <div key={fmt}>
                {idx > 0 && <span className="text-muted-foreground mx-1">•</span>}
                <div className="px-4 py-2 bg-card border-2 border-border rounded-lg inline-block">
                  <span className="font-bold text-foreground uppercase">
                    .{fmt}
                  </span>
                </div>
              </div>
            ))}
            <ArrowRight className="w-6 h-6 text-accent" />
            <div className="px-4 py-2 bg-accent text-accent-foreground rounded-lg">
              <span className="font-bold uppercase">.{outputFormat}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {globalError && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border-2 border-destructive/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <span className="text-destructive font-medium">{globalError}</span>
          </div>
        )}

        {/* Conversion Results */}
        {isConverted && conversions.size > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-500/10 border-2 border-green-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-700 font-medium">Conversions complete!</p>
                  <p className="text-sm text-green-600/70">{successCount} successful{errorCount > 0 ? `, ${errorCount} failed` : ""}</p>
                </div>
              </div>
            </div>

            {/* File Results List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {Array.from(conversions.entries()).map(([key, result]) => {
                const originalName = result.file.name.split(".").slice(0, -1).join(".") || "converted"
                const convertedName = `${originalName}.${outputFormat}`
                return (
                  <div 
                    key={key} 
                    className="flex items-center justify-between p-3 border-2 border-border rounded-lg hover:border-accent transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileType className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{convertedName}</p>
                        {result.blob && (
                          <p className="text-xs text-muted-foreground">{formatFileSize(result.file.size)} → {formatFileSize(result.blob.size)}</p>
                        )}
                        {result.error && (
                          <p className="text-xs text-destructive">{result.error}</p>
                        )}
                      </div>
                    </div>
                    {result.blob ? (
                      <button
                        onClick={() => handleDownloadFile(result.file, result.blob, 0)}
                        className="p-2 text-accent hover:bg-accent/10 rounded transition-colors flex-shrink-0"
                        aria-label="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    ) : (
                      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4">
          {isConverted && conversions.size > 0 ? (
            <div className="flex gap-3">
              {successCount > 0 && (
                <Button
                  onClick={handleDownloadAll}
                  className="flex-1 h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <DownloadCloud className="w-5 h-5 mr-2" />
                  Download All
                </Button>
              )}
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="flex-1 h-14 px-6 text-lg font-bold border-2"
              >
                Convert More
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleConvertAll}
              disabled={files.length === 0 || !outputFormat || isConvertingAll}
              className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
            >
              {isConvertingAll ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Converting {files.length} file{files.length !== 1 ? "s" : ""}...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Convert {files.length > 0 ? `${files.length} Image${files.length !== 1 ? "s" : ""}` : "Images"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
