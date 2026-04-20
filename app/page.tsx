import Image from "next/image";
import { ConverterCard } from "@/components/converter-card";
import { SupportedFormats } from "@/components/supported-formats";
import { Zap, Shield, Laptop } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b-2 border-border bg-card">
                <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-15 h-15 flex items-center justify-center">
                            <Image
                                src="/icon.png"
                                alt="Convertzoo"
                                width={70}
                                height={70}
                                className="w-full h-full  object-cover"
                            />
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tight">
                            Convertzoo
                        </span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <a
                            href="#converter"
                            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                        >
                            Convert
                        </a>
                        <a
                            href="#formats"
                            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                        >
                            Formats
                        </a>
                        <a
                            href="#features"
                            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                        >
                            Features
                        </a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
                        Convert images
                        <br />
                        <span className="text-accent">instantly</span>
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

            {/* Footer */}
            <footer className="border-t-2 border-border">
                <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
                    <p>
                        &copy; 2026 Convertzoo. All rights reserved. Built with
                        privacy in mind.
                    </p>
                </div>
            </footer>
        </div>
    );
}
