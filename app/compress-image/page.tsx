import { ImageCompressor } from "@/components/image-compressor";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function CompressImagePage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                        Compress images
                        <span className="text-accent"> instantly</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                        Drop your image, choose your compression level, and
                        download the compressed file in seconds. 100% free, no
                        signup required.
                    </p>
                </div>

                {/* Compressor Card */}
                <div id="compressor">
                    <ImageCompressor />
                </div>

                {/* Features Section */}
                <div className="mt-20 space-y-8 max-w-3xl mx-auto">
                    <div className="bg-muted rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">
                            Why Compress Images?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">
                                    Faster Load Times
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Smaller file sizes mean faster downloads and
                                    better website performance
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">
                                    Reduced Storage
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Save storage space on your device and cloud
                                    services
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">
                                    Easy Sharing
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Share images faster via email, messaging,
                                    and social media
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">
                                    Quality Control
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Choose your desired compression level to
                                    balance quality and size
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Supported Formats */}
                    <div className="bg-muted rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">
                            Supported Formats
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                "JPEG",
                                "PNG",
                                "WebP",
                                "GIF",
                                "BMP",
                                "AVIF",
                                "ICO",
                            ].map((format) => (
                                <div
                                    key={format}
                                    className="bg-background border-2 border-border rounded-lg p-4 text-center"
                                >
                                    <p className="font-semibold text-foreground">
                                        {format}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="bg-muted rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">
                            Compression Tips
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <span className="text-primary font-bold flex-shrink-0">
                                    •
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    <strong>For Photos:</strong> JPEG format at
                                    70-85% quality offers the best balance
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary font-bold flex-shrink-0">
                                    •
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    <strong>For Graphics:</strong> PNG format at
                                    90%+ quality preserves sharp edges
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary font-bold flex-shrink-0">
                                    •
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    <strong>Modern Web:</strong> WebP format
                                    offers 25-35% better compression
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary font-bold flex-shrink-0">
                                    •
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    <strong>Test First:</strong> Always preview
                                    your compressed images to ensure quality
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
