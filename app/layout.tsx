import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "ADHDen",
  description: "Zkroťte chaos, časovou slepotu a paralýzu bez pocitu viny.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={lexend.variable}>
      <body className="bg-[#121214] text-zinc-200 font-sans antialiased min-h-screen selection:bg-amber-400/20 selection:text-amber-300">
        {children}
      </body>
    </html>
  );
}
