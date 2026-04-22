import { ConverterCard } from "@/components/converter-card";
import { SupportedFormats } from "@/components/supported-formats";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Zap, Shield, Laptop } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl  font-bold text-foreground mb-4 text-balance">
                        Convert images
                        <span className="text-accent"> instantly</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                        Drop your image, choose your output format, and download
                        the converted file in seconds. 100% free, no signup
                        required.
                    </p>
                </div>

                {/* Converter */}
                <div id="converter">
                    <ConverterCard />
                </div>

                {/* Features */}
                <div
                    id="features"
                    className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                >
                    <div className="text-center p-6">
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-7 h-7 text-foreground" />
                        </div>
                        <h3 className="font-bold text-foreground mb-2">
                            Lightning Fast
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Convert images instantly using browser-native
                            processing
                        </p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-7 h-7 text-foreground" />
                        </div>
                        <h3 className="font-bold text-foreground mb-2">
                            100% Private
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Your files never leave your browser. No uploads to
                            any server.
                        </p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Laptop className="w-7 h-7 text-foreground" />
                        </div>
                        <h3 className="font-bold text-foreground mb-2">
                            Works Offline
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            All processing happens locally, works even without
                            internet
                        </p>
                    </div>
                </div>
            </main>

            {/* Supported Formats Section */}
            <SupportedFormats />

            <Footer />
        </div>
    );
}
