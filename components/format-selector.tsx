"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IMAGE_FORMATS, type ImageFormat } from "@/lib/image-converter"

interface FormatSelectorProps {
  value: string
  onValueChange: (value: string) => void
  inputFormat: string | null
}

export function FormatSelector({ value, onValueChange, inputFormat }: FormatSelectorProps) {
  const formats = Object.entries(IMAGE_FORMATS) as [ImageFormat, typeof IMAGE_FORMATS[ImageFormat]][]
  
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
        Output Format:
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full h-14 border-2 border-border bg-card text-foreground text-lg font-medium">
          <SelectValue placeholder="Select output format" />
        </SelectTrigger>
        <SelectContent>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Image Formats
          </div>
          {formats.map(([key, format]) => (
            <SelectItem
              key={key}
              value={key}
              disabled={inputFormat?.toLowerCase() === key}
              className="text-base"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold">.{key.toUpperCase()}</span>
                <span className="text-muted-foreground text-sm">{format.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
