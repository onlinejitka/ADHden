import React from "react";
import Link from "next/link";
import {
  Timer,
  Volume2,
  Sparkles,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
  ShieldCheck
} from "lucide-react";
import { getPublishedPosts } from "@/lib/notion";

export const revalidate = 60;

export default async function LandingPage() {
  const allPosts = await getPublishedPosts();
  const articles = allPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-300 font-sans leading-relaxed selection:bg-amber-400/20 selection:text-amber-300 flex flex-col justify-between">
      
      <div>
        {/* Responzivní horní navigace (odladěná pro mobily) */}
        <header className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-zinc-800/60 gap-2">
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <img
              src="/ADHden%20logo.jpg"
              alt="ADHDen.cz logo"
              className="h-7 sm:h-9 w-auto rounded-lg object-contain group-hover:opacity-90 transition"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-5">
            <Link
              href="/adhd-ledovec"
              className="text-[11px] sm:text-xs text-zinc-400 hover:text-amber-300 transition flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300/80 flex-shrink-0" strokeWidth={1.5} />
              <span><span className="hidden sm:inline">ADHD </span>Ledovec</span>
            </Link>

            <Link
              href="/magazin"
              className="text-[11px] sm:text-xs text-zinc-400 hover:text-zinc-200 transition flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300/80 flex-shrink-0" strokeWidth={1.5} />
              <span>Magazín</span>
            </Link>
            
            <Link
              href="/app"
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-medium px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs flex items-center gap-1 transition flex-shrink-0"
            >
              <span>Aplikace</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </header>

        {/* Hlavní obsah */}
        <main className="max-w-4xl mx-auto px-6 pt-10 sm:pt-14 pb-16 space-y-12 sm:space-y-16">
          
          {/* Hero sekce */}
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-[11px] text-amber-300/90">
              <span>♡ Laskavý systém pro neurodivergentní mozek</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-zinc-100 max-w-2xl mx-auto leading-normal tracking-wide">
              Zkrotit chaos, časovou slepotu a paralýzu{" "}
              <span className="text-amber-300 font-normal">bez pocitu viny.</span>
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/app"
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <span>Otevřít aplikaci v prohlížeči</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </Link>

              <Link
                href="/magazin"
                className="w-full sm:w-auto bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 px-6 py-3 rounded-xl text-xs font-medium transition text-center"
              >
                Číst magazín
              </Link>
            </div>

            {/* Jasná informace o Free i rozšiřující PRO verzi */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[11px] text-zinc-400 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" strokeWidth={1.5} />
                Základní funkce zdarma a bez registrace
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" strokeWidth={1.5} />
                Žádné výčitky a tresty
              </span>
              <span className="flex items-center gap-1.5 text-amber-300/90 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" strokeWidth={1.5} />
                Rozšíření PRO s vyzkoušením na 7 dní zdarma
              </span>
            </div>
          </div>

          {/* Sekce Nástrojů */}
          <section className="space-y-6 text-left">
            <div className="text-center space-y-1.5">
              <h2 className="text-lg font-semibold text-zinc-200">
                Nástroje v aplikaci ADHDen navržené přímo pro ADHD dynamiku.
              </h2>
              <p className="text-xs text-zinc-400">
                Proč běžné úkolovníky a minutky selhávají a jak vám pomůže ADHDen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <Link
                href="/app?tab=timer"
                className="group p-5 bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-800 hover:border-amber-400/40 rounded-2xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
                    <Timer className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-amber-300 transition">
                    Vizuální Time Timer
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    ADHD mozek nevnímá čísla. Ubývající koláčový disk dává času jasný fyzický tvar bez nutnosti počítání minut.
                  </p>
                </div>
                <span className="text-[11px] font-medium text-amber-300/80 group-hover:text-amber-300 flex items-center gap-1">
                  Spustit timer <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </span>
              </Link>

              <Link
                href="/app?tab=klid"
                className="group p-5 bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-800 hover:border-teal-400/40 rounded-2xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-300">
                    <Volume2 className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-teal-300 transition">
                    Hnědý & Senzorický šum
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Ztiší vnitřní dialog, uklidní nervový systém a vytvoří zvukovou bariéru vůči rušivému okolí.
                  </p>
                </div>
                <span className="text-[11px] font-medium text-teal-300/80 group-hover:text-teal-300 flex items-center gap-1">
                  Okamžité zklidnění <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </span>
              </Link>

              <Link
                href="/app?tab=kouskovac"
                className="group p-5 bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-800 hover:border-purple-400/40 rounded-2xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-300">
                    <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-purple-300 transition">
                    AI Kouskovač
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Máte před sebou nepřekonatelný úkol? AI jej rozpadne na 3 primitivní kroky, u kterých mozek necítí odpor začít.
                  </p>
                </div>
                <span className="text-[11px] font-medium text-purple-300/80 group-hover:text-purple-300 flex items-center gap-1">
                  Konec paralýzy <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </span>
              </Link>

              <Link
                href="/app?tab=bodydoubling"
                className="group p-5 bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-800 hover:border-teal-400/40 rounded-2xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-300">
                    <Users className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-teal-300 transition">
                    Body Doubling
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Čištění zubů, skládání prádla nebo úklid stolu. Spusťte průvodce a dělejte činnost společně s tichým parťákem.
                  </p>
                </div>
                <span className="text-[11px] font-medium text-teal-300/80 group-hover:text-teal-300 flex items-center gap-1">
                  Parťák do akce <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </span>
              </Link>
            </div>
          </section>

          {/* Upoutávka na průvodce */}
          <section className="pt-2">
            <Link
              href="/adhd-ledovec"
              className="group block p-6 sm:p-8 bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-800 hover:border-amber-400/40 rounded-3xl transition-all"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-[11px] font-medium border border-amber-400/20">
                    <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Neurodivergentní průvodce zdarma</span>
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-100 group-hover:text-amber-300 transition">
                    ADHD LEDOVEC
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">
                    Ucelený vizuální e-book o podstatě ADHD mozku, dopaminovém deficitu a exekutivní paralýze. Stáhněte si ho bezplatně v PDF.
                  </p>
                </div>

                <div className="flex-shrink-0 bg-amber-400 group-hover:bg-amber-300 text-zinc-950 font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition">
                  <span>Prohlédnout & Stáhnout</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </div>
              </div>
            </Link>
          </section>

          {/* Sekce 3 nejnovějších článků z Notion s obrázky */}
          <section className="space-y-6 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-200">
                  Poslední články & Tipy
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Krátké návody a porozumění neurodivergentní mysli.
                </p>
              </div>
              
              <Link
                href="/magazin"
                className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Všechny články</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {articles.length === 0 ? (
              <div className="p-6 bg-zinc-800/20 border border-zinc-800 rounded-2xl text-center text-xs text-zinc-400">
                Zatím nebyly načteny žádné články z Notionu.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {articles.map((art: any) => (
                  <Link
                    key={art.id}
                    href={`/magazin/${art.slug}`}
                    className="group flex flex-col p-4 bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all"
                  >
                    {art.coverImage && (
                      <div className="w-full h-36 rounded-xl overflow-hidden mb-3.5 border border-zinc-800/60 bg-zinc-900">
                        <img 
                          src={art.coverImage} 
                          alt={art.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    )}

                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-zinc-500">
                          <span className="text-amber-300/90 font-medium">
                            {art.category}
                          </span>
                        </div>

                        <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-amber-300 transition leading-snug">
                          {art.title}
                        </h3>

                        {art.description && (
                          <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                            {art.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 mt-auto text-[11px] text-zinc-500 group-hover:text-zinc-300 flex items-center justify-between transition border-t border-zinc-800/40">
                        <span>{art.date}</span>
                        <span className="text-amber-300/80 group-hover:text-amber-300 flex items-center gap-0.5 font-medium">
                          Číst <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

        </main>
      </div>

      {/* Kompletní Zápatí s doložkou a Stripe */}
      <footer className="border-t border-zinc-800/80 bg-[#0e0e10] pt-10 pb-8 mt-12 text-xs text-zinc-400">
        <div className="max-w-4xl mx-auto px-6 space-y-6 text-center sm:text-left">
          
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <p className="font-semibold text-zinc-300">
              © 2026 ADHDen.cz — Všechna práva vyhrazená.
            </p>
            {/* Právní a lékařské upozornění */}
            <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-relaxed">
              Důležité upozornění: Obsah tohoto webu a aplikace má pouze informativní, vzdělávací a seberozvojový charakter. Autorka není lékař, psychiatr ani psychoterapeut. Veškeré informace a aplikace nenahrazují odbornou lékařskou či psychologickou péči. Použití nástrojů je na vlastní zodpovědnost uživatele.
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

            {/* Bezpečné platby přes Stripe + Odkazy */}
            <div className="flex flex-col items-center sm:items-end gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-800/40 px-3 py-1 rounded-lg border border-zinc-800">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Bezpečné platby zajišťuje <b>Stripe</b></span>
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
        </div>
      </footer>

    </div>
  );
}
