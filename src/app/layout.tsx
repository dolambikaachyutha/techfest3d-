import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Techfest 2027 — The Future Unfolds | IIT Bombay",
  description:
    "Asia's largest science and technology festival. A navigable digital universe through six technological futures.",
  keywords: [
    "Techfest",
    "IIT Bombay",
    "science festival",
    "technology",
    "AI",
    "robotics",
    "space",
    "quantum computing",
    "sustainability",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#05060A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Fontshare: Clash Display + Satoshi */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-void text-ice font-body">
        {children}
      </body>
    </html>
  );
}
