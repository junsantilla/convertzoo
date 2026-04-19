"use client"

import { useCallback, useState } from "react"
import { Upload, X, FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileDropZoneProps {
  onFileSelect: (file: File) => void
  file: File | null
  onClear: () => void
}

export function FileDropZone({ onFileSelect, file, onClear }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        onFileSelect(droppedFile)
      }
    },
    [onFileSelect]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        onFileSelect(selectedFile)
      }
    },
    [onFileSelect]
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE"
  }

  if (file) {
    return (
      <div className="relative border-2 border-border bg-card p-6 rounded-lg">
        <button
          onClick={onClear}
          className="absolute top-3 right-3 p-1 hover:bg-muted rounded-full transition-colors"
          aria-label="Remove file"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-14 h-14 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">
              {getFileExtension(file.name)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-medium truncate">{file.name}</p>
            <p className="text-muted-foreground text-sm">{formatFileSize(file.size)}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed border-border rounded-lg p-12 transition-all cursor-pointer hover:border-accent",
        isDragging && "border-accent bg-accent/5"
      )}
    >
      <input
        type="file"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Upload file"
      />
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Upload className="w-8 h-8 text-foreground" />
        </div>
        <div>
          <p className="text-foreground font-semibold text-lg">
            Drag & Drop a file here
          </p>
          <p className="text-muted-foreground mt-1">
            or click to browse from your computer
          </p>
        </div>
      </div>
    </div>
  )
}
