import Link from "next/link";
import { BookOpen, ArrowLeft, Calendar, Tag, ArrowRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/notion";

export const revalidate = 60; // Automatické obnovení obsahu z Notion každých 60 sekund

export default async function MagazinIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-300 font-sans leading-relaxed selection:bg-amber-400/20 selection:text-amber-300">
      
      {/* Hlavička */}
      <header className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between border-b border-zinc-800/60">
        <Link
          href="/"
          className="text-xs text-zinc-400 hover:text-zinc-200 transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Zpět na ADHDen.cz</span>
        </Link>

        <Link
          href="/app"
          className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-medium px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
        >
          <span>Spustit aplikaci</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
        </Link>
      </header>

      {/* Obsah */}
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-20 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-[11px] text-amber-300">
            <BookOpen className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Magazín & Průvodce</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100">
            Praktické rady, psychologie pozornosti a postupy pro život s ADHD
          </h1>
        </div>

        {/* Seznam článků z Notion */}
        {posts.length === 0 ? (
          <div className="p-8 bg-zinc-800/20 border border-zinc-800 rounded-2xl text-center text-xs text-zinc-400">
            Zatím nebyly načteny žádné publikované články z Notionu.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/magazin/${post.slug}`}
                className="group p-6 bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    {post.category && (
                      <span className="text-amber-300/90 font-medium flex items-center gap-1">
                        <Tag className="w-3 h-3" strokeWidth={1.5} /> {post.category}
                      </span>
                    )}
                    {post.date && (
                      <span className="flex items-center gap-1 ml-auto">
                        <Calendar className="w-3 h-3" strokeWidth={1.5} /> {post.date}
                      </span>
                    )}
                  </div>

                  <h2 className="text-sm font-semibold text-zinc-100 group-hover:text-amber-300 transition leading-snug">
                    {post.title}
                  </h2>

                  {post.description && (
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 text-[11px] text-amber-300/80 group-hover:text-amber-300 font-medium flex items-center justify-end gap-1 border-t border-zinc-800/40">
                  <span>Číst článek</span>
                  <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

  {/* ZÁPATÍ (FOOTER) */}
      <footer className="border-t border-zinc-800/80 bg-[#0e0e10] pt-10 pb-8 mt-12 text-xs text-zinc-400">
        <div className="max-w-4xl mx-auto px-6 space-y-6 text-center sm:text-left">
          
          <div className="space-y-1.5 text-center text-zinc-400 max-w-2xl mx-auto">
            <p className="font-semibold text-zinc-300">
              © 2026 ADHDen. Všechna práva vyhrazena.
            </p>
          </div>

          <div className="border-t border-zinc-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="font-bold text-zinc-200">
                Provozovatel: Jitka Pekárková
              </p>
              <p className="text-[11px] text-zinc-500">
                Sídlo: Primátorská 38, Praha 8 • IČO: 87458021
              </p>
              <p className="text-[11px] text-zinc-500">
                Fyzická osoba zapsaná v živnostenském rejstříku.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
  <a
    href="https://jitkap.cz/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-amber-300 hover:underline"
  >
    O autorce
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
    Obchodní podmínky
  </Link>
  <span className="text-zinc-700">•</span>
  <Link href="/gdpr" className="text-zinc-300 hover:text-zinc-100">
    GDPR
  </Link>
</div>

          </div>
        </div>
      </footer>

    </div>
  );
}

