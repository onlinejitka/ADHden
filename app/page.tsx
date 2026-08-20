import Link from "next/link";
import { Timer, Sparkles, Volume2, Users, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";
import { getPublishedPosts } from "@/lib/notion";

export default async function LandingPage() {
  const posts = await getPublishedPosts();
  const recentPosts = posts.slice(0, 2);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      {/* Horní navigační lišta */}
      <header className="w-full max-w-4xl flex items-center justify-between p-6 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 bg-clip-text text-transparent">
            ADHDen
          </span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">cz</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/blog" className="text-sm text-slate-300 hover:text-white font-medium flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-amber-400" /> Magazín & Tipy
          </Link>
          <Link
            href="/app"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
          >
            Spustit aplikaci zdarma <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </nav>
      </header>

      {/* Hero sekce */}
      <section className="w-full max-w-3xl px-6 pt-16 pb-12 text-center flex flex-col items-center">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full mb-4">
          Laskavý systém pro neurodivergentní mozek
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
          Zkroťte chaos, časovou slepotu a paralýzu bez pocitu viny.
        </h1>
        <p className="text-base text-slate-300 max-w-xl leading-relaxed mb-8">
          ADHDen spojuje vizuální ubývání času, zklidňující hnědý šum, AI rozpad paralyzujících úkolů a společného parťáka pro dospělé i rodiny s dětmi.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
          <Link
            href="/app"
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-3.5 rounded-2xl text-sm transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
          >
            Otevřít aplikaci v prohlížeči <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-2xl text-sm transition flex items-center justify-center"
          >
            Číst blog & průvodce
          </Link>
        </div>
      </section>

      {/* 4 pilíře aplikace */}
      <section className="w-full max-w-4xl px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Timer className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Vizuální koláčový Time Timer</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            ADHD mozek nevnímá čísla. Náš ubývající barevný disk dává času jasný fyzický tvar, takže přesně vidíte, kolik prostoru zbývá.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Volume2 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Senzorický hnědý šum</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generovaný přímo ve vašem mobilu bez stahování gigabajtů dat. Ztiší vnitřní dialog a vytvoří okamžitou sluchovou bariéru vůči distrakcím.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">AI Kouskovač paralýzy</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Máte před sebou nepřekonatelný úkol? AI z něj okamžitě vytvoří 3 fyzicky snadné kroky, u kterých mozek necítí odpor začít.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Virtuální Body Doubling</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Společné čištění zubů, reset stolu nebo úklid. Pusťte si průvodce a dělejte nudnou činnost společně s parťákem.
          </p>
        </div>
      </section>

      {/* Ukázka z blogu */}
      <section className="w-full max-w-4xl px-6 py-12 border-t border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Nejnovější články z magazínu</h2>
            <p className="text-xs text-slate-400">Tipy, vědecké poznatky a návody pro klidný den</p>
          </div>
          <Link href="/blog" className="text-xs text-amber-400 hover:underline font-semibold">
            Všechny články →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="p-5 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {post.category}
                </span>
                <h3 className="text-sm font-bold text-white leading-snug">{post.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{post.perex}</p>
              </div>
              <span className="text-[11px] text-amber-400 font-medium mt-4 flex items-center gap-1">
                Přečíst článek →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Patička */}
      <footer className="w-full max-w-4xl p-6 border-t border-slate-900 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} ADHDen.cz – Vytvořeno s laskavostí pro klidnější hlavu.
      </footer>
    </div>
  );
}
