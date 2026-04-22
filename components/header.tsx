import Image from "next/image";
import Link from "next/link";

export function Header() {
    return (
        <header className="border-b-2 border-border bg-card">
            <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <div className="w-15 h-15 flex items-center justify-center">
                        <Image
                            src="/icon.png"
                            alt="Convertzoo"
                            width={70}
                            height={70}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-xl font-bold text-foreground tracking-tight">
                        Convertzoo
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                        Convert
                    </Link>
                    <Link
                        href="/compress-image"
                        className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                        Compress
                    </Link>
                </nav>
            </div>
        </header>
    );
}
