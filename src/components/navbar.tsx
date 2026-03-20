import Link from "next/link";

interface NavbarProps {
  theme?: "default" | "transparent";
}

export function Navbar({ theme = "default" }: NavbarProps) {
  const isTransparent = theme === "transparent";

  return (
    <header
      className={[
        "top-0 z-50 w-full h-14",
        isTransparent
          ? "absolute left-0 right-0 bg-white/30 backdrop-blur-sm border-b border-white/20"
          : "sticky border-b border-border bg-background/80 backdrop-blur-sm",
      ].join(" ")}
    >
      <div className="max-w-4xl mx-auto px-4 h-full flex items-center">
        <Link
          href="/"
          className={[
            "font-semibold hover:opacity-70 transition-opacity",
            isTransparent ? "text-foreground" : "text-foreground",
          ].join(" ")}
        >
          Handcraft
        </Link>
      </div>
    </header>
  );
}
