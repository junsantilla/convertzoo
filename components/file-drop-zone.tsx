"use client"

import { useCallback, useState } from "react"
import { Upload, X, FileIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileDropZoneProps {
  onFileSelect: (files: File[]) => void
  files: File[]
  onRemoveFile: (index: number) => void
  onClearAll: () => void
}

export function FileDropZone({ onFileSelect, files, onRemoveFile, onClearAll }: FileDropZoneProps) {
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
      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        onFileSelect([...files, ...droppedFiles])
      }
    },
    [files, onFileSelect]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      if (selectedFiles.length > 0) {
        onFileSelect([...files, ...selectedFiles])
      }
      // Reset input so the same file can be selected again
      e.target.value = ""
    },
    [files, onFileSelect]
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

  if (files.length > 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-foreground">{files.length} file(s) selected</p>
          <button
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear All
          </button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative border-2 border-border bg-card p-4 rounded-lg hover:border-accent transition-colors">
              <button
                onClick={() => onRemoveFile(index)}
                className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="flex items-center gap-3 pr-8">
                <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-bold">
                    {getFileExtension(file.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium truncate text-sm">{file.name}</p>
                  <p className="text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            aria-label="Add more files"
          />
          <Plus className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">Add more files</span>
        </label>
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
        multiple
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Upload files"
      />
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Upload className="w-8 h-8 text-foreground" />
        </div>
        <div>
          <p className="text-foreground font-semibold text-lg">
            Drag & Drop files here
          </p>
          <p className="text-muted-foreground mt-1">
            or click to browse from your computer. Select multiple files to convert them all at once.
          </p>
        </div>
      </div>
    </div>
  )
}
