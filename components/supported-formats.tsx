import { IMAGE_FORMATS, type ImageFormat } from "@/lib/image-converter"
import { Check, ArrowRight } from "lucide-react"

const CONVERSION_MATRIX: Record<ImageFormat, ImageFormat[]> = {
  png: ["jpg", "jpeg", "webp", "gif", "bmp", "avif"],
  jpg: ["png", "webp", "gif", "bmp", "avif"],
  jpeg: ["png", "webp", "gif", "bmp", "avif"],
  webp: ["png", "jpg", "jpeg", "gif", "bmp", "avif"],
  gif: ["png", "jpg", "jpeg", "webp", "bmp", "avif"],
  bmp: ["png", "jpg", "jpeg", "webp", "gif", "avif"],
  ico: ["png", "jpg", "jpeg", "webp", "gif", "bmp"],
  avif: ["png", "jpg", "jpeg", "webp", "gif", "bmp"],
}

export function SupportedFormats() {
  const formats = Object.entries(IMAGE_FORMATS) as [ImageFormat, typeof IMAGE_FORMATS[ImageFormat]][]
  
  return (
    <section id="formats" className="py-20 border-t-2 border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Supported Image Formats
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert between any of these popular image formats directly in your browser. 
            No file uploads to external servers.
          </p>
        </div>
        
        {/* Format Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
          {formats.map(([key, format]) => (
            <div 
              key={key}
              className="bg-card border-2 border-border rounded-xl p-5 hover:border-accent transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-md uppercase">
                  .{key}
                </span>
              </div>
              <h3 className="font-bold text-foreground mb-1">{format.label}</h3>
              <p className="text-sm text-muted-foreground">{format.description}</p>
            </div>
          ))}
        </div>
        
        {/* Conversion Matrix */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-foreground text-center mb-8">
            Conversion Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left text-sm font-bold text-foreground border-2 border-border bg-muted">
                    From / To
                  </th>
                  {formats.slice(0, 6).map(([key]) => (
                    <th key={key} className="p-3 text-center text-sm font-bold text-foreground uppercase border-2 border-border bg-muted">
                      .{key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {formats.slice(0, 6).map(([fromKey]) => (
                  <tr key={fromKey}>
                    <td className="p-3 text-sm font-bold text-foreground uppercase border-2 border-border bg-muted">
                      .{fromKey}
                    </td>
                    {formats.slice(0, 6).map(([toKey]) => (
                      <td key={toKey} className="p-3 text-center border-2 border-border">
                        {fromKey === toKey ? (
                          <span className="text-muted-foreground">—</span>
                        ) : CONVERSION_MATRIX[fromKey]?.includes(toKey) ? (
                          <Check className="w-5 h-5 text-accent mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Popular Conversions */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-foreground text-center mb-8">
            Popular Conversions
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { from: "PNG", to: "JPG", desc: "Reduce file size for web" },
              { from: "WEBP", to: "PNG", desc: "Convert modern format for compatibility" },
              { from: "JPG", to: "PNG", desc: "Add transparency support" },
              { from: "BMP", to: "WEBP", desc: "Compress uncompressed images" },
              { from: "GIF", to: "PNG", desc: "Higher quality static image" },
              { from: "PNG", to: "WEBP", desc: "Best compression for web" },
            ].map((conv, i) => (
              <div 
                key={i}
                className="flex items-center gap-4 p-4 bg-card border-2 border-border rounded-lg hover:border-accent transition-colors"
              >
                <span className="px-2 py-1 bg-muted text-foreground text-xs font-bold rounded uppercase">
                  {conv.from}
                </span>
                <ArrowRight className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded uppercase">
                  {conv.to}
                </span>
                <span className="text-sm text-muted-foreground ml-auto">
                  {conv.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
