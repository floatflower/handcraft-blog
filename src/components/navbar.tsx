import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center">
        <Link href="/" className="font-semibold text-foreground hover:opacity-70 transition-opacity">
          Handcraft
        </Link>
      </div>
    </header>
  );
}
