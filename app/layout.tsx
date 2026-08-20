import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADHD Flow & Focus",
  description: "Laskavý pomocník pro ADHD a neurodivergentní rodiny",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ADHD Flow",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="dark">
      <body className="bg-slate-900 text-slate-100 min-h-screen antialiased flex flex-col items-center">
        <main className="w-full max-w-md min-h-screen flex flex-col bg-slate-900 border-x border-slate-800/80 shadow-2xl relative pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
