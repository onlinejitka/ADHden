import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.adhden.cz"),
  title: {
    default: "ADHDen | Gentle Focus & Daily OS for the ADHD Brain",
    template: "%s | ADHDen",
  },
  description:
    "Web-based tools designed for ADHD dynamics – visual Time Timer, browser brown noise, AI task micro-chunking, and quiet body doubling to unfreeze executive paralysis.",
  keywords: [
    "ADHD",
    "ADHD tools",
    "Visual Timer",
    "Time Timer",
    "Brown Noise",
    "Executive Dysfunction",
    "Task Paralysis",
    "Body Doubling",
    "Time Blindness",
    "Neurodivergent OS",
  ],
  authors: [{ name: "Jitka Pekárková" }],
  icons: {
    icon: "/ADHden%20favikon.png",
    shortcut: "/ADHden%20favikon.png",
    apple: "/ADHden%20favikon.png",
  },
  openGraph: {
    title: "ADHDen | Gentle Daily Tools for ADHD & Neurodivergence",
    description:
      "Tools designed specifically for ADHD – zero pressure, no guilt, and no sign-up required.",
    url: "https://www.adhden.cz",
    siteName: "ADHDen",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ADHDen",
    url: "https://www.adhden.cz",
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    description:
      "Web application and compassionate guides for navigating ADHD, executive dysfunction, and time blindness.",
    author: {
      "@type": "Person",
      name: "Jitka Pekárková",
      url: "https://jitkap.cz/",
    },
  };

  return (
    <html lang="en" className={lexend.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#121214] text-zinc-200 font-sans antialiased min-h-screen selection:bg-amber-400/20 selection:text-amber-300">
        {/* Google Analytics skripty umístěné správně na začátku <body> */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ECKT5B013D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ECKT5B013D');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
