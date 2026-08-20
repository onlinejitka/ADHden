import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADHDen.cz – Laskavý systém pro klidnější hlavu",
  description: "Vizuální Time Timer, hnědý šum, AI rozpad paralyzujících úkolů a rutiny pro neurodivergentní mozek.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
