import Link from "next/link";
import { Timer, Sparkles, Volume2, Users, ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import { getPublishedPosts } from "@/lib/notion";

export default async function LandingPage() {
  const posts = await getPublishedPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      {/* HORNÍ LIŠTA */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 bg-clip-text text-transparent">
              ADHDen
            </span>
            <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">cz</span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-6">
            <Link href="/blog" className="text-xs sm:text-sm text-slate-300 hover:text-amber-400 font-semibold transition flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" /> Magazín & Tipy
            </Link>
            <Link
              href="/app"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5 active:scale-95"
            >
              Spustit aplikaci zdarma <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SEKCE (Široká, úderná) */}
      <section className="w-full max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full mb-6">
          <Heart className="w-3.5 h-3.5" /> Laskavý systém pro neurodivergentní mozek
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
          Zkroťte chaos, časovou slepotu a paralýzu <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">bez pocitu viny.</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10 font-normal">
          ADHDen spojuje vizuální ubývání času, zklidňující hnědý šum, AI rozpad paralyzujících úkolů a společného parťáka pro dospělé i rodiny s dětmi.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <Link
            href="/app"
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-base transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95"
          >
            Otevřít aplikaci v prohlížeči <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-6 py-4 rounded-2xl text-base transition flex items-center justify-center active:scale-95"
          >
            Číst magazín
          </Link>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 mt-8">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zdarma bez registrace</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Žádné výčitky a tresty</span>
        </div>
      </section>

      {/* 4 PILÍŘE (Na desktopu 4 sloupce vedle sebe) */}
      <section className="w-full max-w-6xl px-4 sm:px-6 py-12">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Nástroje navržené přímo pro ADHD dynamiku
          </h2>
          <p className="text-sm text-slate-400">Proč běžné úkolovníky a minutky selhávají a jak vám pomůže ADHDen.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 p-6 rounded-3xl transition space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Timer className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Vizuální Time Timer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ADHD mozek nevnímá čísla. Ubývající koláčový disk dává času jasný fyzický tvar bez nutnosti počítání minut.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-amber-400 pt-2">Vizuální kotva času →</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 p-6 rounded-3xl transition space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Hnědý šum</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generovaný přímo v prohlížeči. Ztiší vnitřní dialog, uklidní nervový systém a vytvoří sluchovou bariéru vůči okolí.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 pt-2">Okamžité zklidnění →</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 hover:border-sky-500/40 p-6 rounded-3xl transition space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">AI Kouskovač</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Máte před sebou nepřekonatelný úkol? AI jej rozpadne na 3 primitivní fyzické kroky, u kterých mozek necítí odpor začít.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-sky-400 pt-2">Konec paralýzy →</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 p-6 rounded-3xl transition space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Body Doubling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Čištění zubů, skládání prádla nebo úklid stolu. Spusťte průvodce a dělejte monotónní činnost společně s parťákem.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-purple-400 pt-2">Parťák do akce →</span>
          </div>
        </div>
      </section>

      {/* MAGAZÍN NA DESKTOPU (3 sloupce) */}
      <section className="w-full max-w-6xl px-4 sm:px-6 py-16 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Magazín & Průvodce</h2>
            <p className="text-sm text-slate-400">Vědecky podložené tipy a postupy pro fungování s ADHD.</p>
          </div>
          <Link href="/blog" className="text-xs sm:text-sm text-amber-400 hover:underline font-bold">
            Všechny články magazínu →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="p-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {post.perex}
                </p>
              </div>
              <span className="text-xs text-amber-400 font-semibold mt-6 flex items-center gap-1">
                Přečíst článek →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PATIČKA */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-10 text-center text-xs text-slate-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} ADHDen.cz – Vytvořeno s laskavostí pro klidnější dny.</div>
          <div className="flex gap-4 text-slate-500">
            <Link href="/app" className="hover:text-slate-300">Aplikace</Link>
            <Link href="/blog" className="hover:text-slate-300">Magazín</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
