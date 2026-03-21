import type { Metadata, Viewport } from "next";
import { Geist_Mono, Noto_Serif_TC, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Handcraft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        notoSerifTC.variable,
        geistMono.variable,
        playfairDisplay.variable,
      )}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.vash.network/fontawesome/6.6.0/css/all.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
