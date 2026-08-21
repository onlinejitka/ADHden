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
    default: "ADHDen.cz | Laskavý systém pro neurodivergentní mozek",
    template: "%s | ADHDen.cz",
  },
  description:
    "Webové nástroje navržené pro ADHD dynamiku – vizuální Time Timer, hnědý šum, AI rozkouskování úkolů a tichý parťák pro zklidnění paralýzy.",
  keywords: [
    "ADHD",
    "ADHD nástroje",
    "Time Timer",
    "Hnědý šum",
    "Exekutivní paralýza",
    "Body Doubling",
    "ADHD ledovec",
    "Časová slepota",
  ],
  authors: [{ name: "Jitka Pekárková" }],
  icons: {
    icon: "/ADHden%20favikon.png",
    shortcut: "/ADHden%20favikon.png",
    apple: "/ADHden%20favikon.png",
  },
  openGraph: {
    title: "ADHDen.cz | Laskavý systém pro neurodivergentní mozek",
    description:
      "Nástroje navržené přímo pro ADHD – bez tlaku, výčitek a bez nutnosti registrace.",
    url: "https://www.adhden.cz",
    siteName: "ADHDen",
    locale: "cs_CZ",
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
      "Aplikace a průvodce pro zvládání ADHD, exekutivní paralýzy a časové slepoty.",
    author: {
      "@type": "Person",
      name: "Jitka Pekárková",
      url: "https://jitkap.cz/",
    },
  };

  return (
    <html lang="cs" className={lexend.variable}>
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
