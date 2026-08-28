import Link from "next/link";
import React from "react";
import { ArrowLeft, ArrowRight, Calendar, Tag, BookOpen, FileText, ShieldCheck } from "lucide-react";
import { getPostBySlug } from "@/lib/notion";

export const revalidate = 60;

function getYouTubeEmbedUrl(url?: string) {
  if (!url) return null;
  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
  } else if (url.includes("embed/")) {
    videoId = url.split("embed/")[1]?.split("?")[0] || "";
  } else {
    videoId = url.trim();
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function getSpotifyEmbedUrl(url?: string) {
  if (!url) return null;
  let cleanUrl = url.trim();
  if (!cleanUrl.includes("spotify.com")) return null;
  
  if (!cleanUrl.includes("/embed/")) {
    cleanUrl = cleanUrl.replace("open.spotify.com/", "open.spotify.com/embed/");
  }
  return cleanUrl;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#121214] text-zinc-300 flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-semibold text-zinc-100">Článek nebyl nalezen / Article not found</h1>
          <p className="text-xs text-zinc-500">Zkontrolujte adresu nebo se vraťte do magazínu.</p>
          <Link
            href="/magazin"
            className="inline-flex items-center gap-2 text-xs text-amber-300 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Zpět do magazínu
          </Link>
        </div>
      </div>
    );
  }

  const isEn = post.lang === "EN";
  const youtubeEmbedUrl = getYouTubeEmbedUrl(post.youtube);
  const spotifyEmbedUrl = getSpotifyEmbedUrl(post.spotify);

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-300 font-sans leading-relaxed selection:bg-amber-400/20 selection:text-amber-300 flex flex-col justify-between">
      <div>
        {/* Záhlaví (s dynamickým logem a odkazy dle jazyka článku) */}
        <header className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-zinc-800/60 gap-2">
          <Link href={isEn ? "/?lang=en" : "/"} className="flex items-center flex-shrink-0 group">
            <img
              src={isEn ? "/ADHday%20logo%20EN.jpg" : "/ADHden%20logo.jpg"}
              alt="ADHDen logo"
              className="h-8 sm:h-9 w-auto rounded-lg object-contain group-hover:opacity-90 transition"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href={isEn ? "/adhd-ledovec?lang=en" : "/adhd-ledovec"}
              className="text-[11px] sm:text-xs text-zinc-400 hover:text-amber-300 transition flex items-center gap-1 sm:gap-1.5 flex-shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300/80" strokeWidth={1.5} />
              <span>{isEn ? "ADHD Iceberg" : "ADHD Ledovec"}</span>
            </Link>

            <Link
              href={isEn ? "/magazin?lang=en" : "/magazin"}
              className="text-[11px] sm:text-xs text-zinc-400 hover:text-zinc-200 transition flex items-center gap-1 sm:gap-1.5 flex-shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300/80" strokeWidth={1.5} />
              <span>{isEn ? "Magazine" : "Magazín"}</span>
            </Link>

            <Link
              href={isEn ? "/app?lang=en" : "/app"}
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-medium px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs flex items-center gap-1 sm:gap-1.5 transition flex-shrink-0"
            >
              <span>{isEn ? "Launch app" : "Spustit aplikaci"}</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </header>

        {/* Hlavní obsah článku */}
        <main className="max-w-3xl mx-auto px-6 pt-10 pb-20 space-y-8">
          <Link
            href={isEn ? "/magazin?lang=en" : "/magazin"}
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span>{isEn ? "Back to all articles" : "Zpět na všechny články"}</span>
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              {post.category && (
                <span className="text-amber-300/90 font-medium flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" strokeWidth={1.5} /> {post.category}
                </span>
              )}
              {post.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} /> {post.date}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100 leading-snug">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-amber-400/40 pl-4 py-0.5">
                {post.description}
              </p>
            )}
          </div>

          {/* HLAVNÍ OBRÁZEK Z NOTIONU */}
          {post.coverImage && (
            <div className="my-6 w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-auto object-cover max-h-[450px]" 
              />
            </div>
          )}

          {/* SPOTIFY PŘEHRÁVAČ */}
          {spotifyEmbedUrl && (
            <div className="my-6 w-full rounded-2xl overflow-hidden border border-zinc-800/80 shadow-lg bg-[#121214]">
              <iframe
                src={spotifyEmbedUrl}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-2xl"
              />
            </div>
          )}

          {/* HLAVNÍ TEXT ČLÁNKU */}
          {post.contentHtml && (
            <div
              className="pt-4 border-t border-zinc-800/60"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          )}

          {/* YOUTUBE EMBED VIDEO */}
          {youtubeEmbedUrl && (
            <div className="mt-10 mb-6 aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
              <iframe
                src={youtubeEmbedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* PROMO BOX APLIKACE (PŘELOŽENO DLE JAZYKA ČLÁNKU) */}
          <div className="p-6 bg-zinc-800/30 border border-zinc-800 rounded-2xl text-center space-y-3 mt-12">
            <h3 className="text-sm font-semibold text-zinc-200">
              {isEn
                ? "Want to try these techniques in practice?"
                : "Chcete si tyto techniky vyzkoušet v praxi?"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isEn
                ? "Launch the ADHDen app for free directly in your browser."
                : "Spusťte si aplikaci ADHDen zdarma přímo v prohlížeči."}
            </p>
            <Link
              href={isEn ? "/app?lang=en" : "/app"}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold px-5 py-2.5 rounded-xl text-xs transition"
            >
              <span>{isEn ? "Launch ADHDen App" : "Spustit aplikaci ADHDen"}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </Link>
          </div>
        </main>
      </div>

      {/* ZÁPATÍ (S DOLOŽKOU O LÉKAŘSKÉ PÉČI, STRIPE A INFORMACEMI O PROVOZOVATELI) */}
      <footer className="border-t border-zinc-800/80 bg-[#0e0e10] pt-10 pb-8 mt-12 text-xs text-zinc-400">
        <div className="max-w-4xl mx-auto px-6 space-y-6 text-center sm:text-left">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <p className="font-semibold text-zinc-300">
              © {new Date().getFullYear()} ADHden - {isEn ? "All rights reserved." : "Všechna práva vyhrazena."}
            </p>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-relaxed">
              {isEn
                ? "Important Disclaimer: The content on this website and app is strictly for informational, educational, and self-growth purposes. The author is not a doctor, psychiatrist, or psychotherapist. All information and apps do not replace professional medical or psychological care. Use of these tools is at the user's own responsibility."
                : "Důležité upozornění: Obsah tohoto webu a aplikace má pouze informativní, vzdělávací a seberozvojový charakter. Autorka není lékař, psychiatr ani psychoterapeut. Veškeré informace a aplikace nenahrazují odbornou lékařskou či psychologickou péči. Použití nástrojů je na vlastní zodpovědnost uživatele."}
            </p>
          </div>

          <div className="border-t border-zinc-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="font-bold text-zinc-200">
                {isEn ? "Operator: Jitka Pekárková" : "Provozovatel: Jitka Pekárková"}
              </p>
              <p className="text-[11px] text-zinc-500">
                {isEn
                  ? "Registered address: Primátorská 38, Prague 8, Czech Republic • ID (IČO): 87458021"
                  : "Sídlo: Primátorská 38, Praha 8 • IČO: 87458021"}
              </p>
              <p className="text-[11px] text-zinc-500">
                {isEn
                  ? "Sole proprietor registered in the Trade Licensing Register."
                  : "Fyzická osoba zapsaná v živnostenském rejstříku."}
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-800/40 px-3 py-1 rounded-lg border border-zinc-800">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>
                  {isEn ? (
                    <>
                      Secure payments powered by <b>Stripe</b>
                    </>
                  ) : (
                    <>
                      Bezpečné platby zajišťuje <b>Stripe</b>
                    </>
                  )}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
                <a
                  href="https://jitkap.cz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:underline"
                >
                  {isEn ? "About author" : "O autorce"}
                </a>
                <span className="text-zinc-700">•</span>
                <a
                  href="https://navigator40k.cz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-300 hover:underline"
                >
                  Navigátor 40k
                </a>
                <span className="text-zinc-700">•</span>
                <Link href="/obchodni-podminky" className="text-zinc-300 hover:text-zinc-100">
                  {isEn ? "Terms & Conditions" : "Obchodní podmínky"}
                </Link>
                <span className="text-zinc-700">•</span>
                <Link href="/gdpr" className="text-zinc-300 hover:text-zinc-100">
                  GDPR
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
