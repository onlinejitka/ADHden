"use client";

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
  Info,
  ShoppingBag,
  Zap
} from "lucide-react";

export default function LandingPage() {
  const articles = [
    {
      id: "1",
      title: "Co je to časová slepota a jak ji obelstít bez stresu",
      perex: "Proč pro ADHD mozek existují jen dvě časová pásma – TEĎ a NIKDY – a jak pomáhají vizuální kotvy.",
      category: "ADHD & Čas",
      readTime: "4 min čtení",
      date: "14. srpna",
    },
    {
      id: "2",
      title: "Proč právě hnědý šum tak dobře zklidňuje přetížený mozek?",
      perex: "Srovnání bílého, růžového a hnědého šumu. Jak hluboké frekvence maskují vnitřní i vnější ruch.",
      category: "Senzorika",
      readTime: "3 min čtení",
      date: "10. srpna",
    },
    {
      id: "3",
      title: "Jak přimět děti k ranním rutinám bez neustálého křiku",
      perex: "Osvědčené vizuální kartičky a princip Body Doubling pro klidnější odchody do školy a školky.",
      category: "Pro rodiče",
      readTime: "5 min čtení",
      date: "5. srpna",
    }
  ];

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-300 font-sans leading-relaxed selection:bg-amber-400/20 selection:text-amber-300 flex flex-col justify-between">
      
      <div>
        {/* Horní navigace */}
        <header className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between border-b border-zinc-800/60">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg font-semibold tracking-wider text-amber-300 group-hover:text-amber-200 transition">
              ADHDen
            </span>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
              cz
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/magazin"
              className="text-xs text-zinc-400 hover:text-zinc-200 transition flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300/80" strokeWidth={1.5} />
              <span>Magazín & Tipy</span>
            </Link>
            
            <Link
              href="/app"
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-medium px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <span>Spustit aplikaci</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </header>

        {/* Hlavní obsah */}
        <main className="max-w-4xl mx-auto px-6 pt-14 pb-16 space-y-16">
          
          {/* Hero sekce */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-[11px] text-amber-300/90">
              <span>♡ Laskavý systém pro neurodivergentní mozek</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-zinc-100 max-w-2xl mx-auto leading-normal tracking-wide">
              Zkrotit chaos, časovou slepotu a paralýzu{" "}
              <span className="text-amber-300 font-normal">bez pocitu viny.</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              ADHDen spojuje vizuální ubývání času, zklidňující hnědý šum, AI rozpad paralyzujících úkolů a společného parťáka pro dospělé i rodiny s dětmi.
            </p>

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

            <div className="flex items-center justify-center gap-6 text-[11px] text-zinc-500 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.5} /> Zdarma bez registrace
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.5} /> Žádné výčitky a tresty
              </span>
            </div>
          </div>

          {/* Sekce Nástrojů */}
          <section className="space-y-6 text-left">
            <div className="text-center space-y-1.5">
              <h2 className="text-lg font-semibold text-zinc-200">
                Nástroje navržené přímo pro ADHD dynamiku
              </h2>
              <p className="text-xs text-zinc-400">
                Proč běžné úkolovníky a minutky selhávají a jak vám pomůže ADHDen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <Link
                href="/app"
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
                href="/app"
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
                href="/app"
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
                href="/app"
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

          {/* SEKCE: ADHD LEDOVEC (Průvodce zdarma) */}
          <section className="space-y-6 pt-6">
            <div className="p-8 bg-zinc-800/40 border border-zinc-800 rounded-3xl text-center space-y-6 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[11px] text-amber-300">
                <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Neurodivergentní průvodce zdarma</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                ADHD <span className="text-amber-300">LEDOVEC</span>
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Ucelený vizuální průvodce podstatou ADHD mozku. Zjistěte, co se skrývá pod hladinou viditelných projevů a jak pracovat s vlastní neurologií bez pocitů viny.
              </p>

              <div>
                <a
                  href="https://eshop.adhden.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition active:scale-95 shadow-lg shadow-amber-400/10"
                >
                  <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
                  <span>Získat zdarma v e-shopu: ADHD Ledovec</span>
                </a>
              </div>
            </div>

            {/* KARTY LEDOVCE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Karta 1 */}
              <div className="p-6 bg-zinc-800/30 border border-zinc-800/80 rounded-2xl space-y-3">
                <h3 className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                  Co je a NENÍ ADHD?
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  ADHD je celoživotní neurovývojové onemocnění spojené s odlišnou hladinou dopaminu a noradrenalinu v prefrontální kůře.
                </p>
                <ul className="text-[11px] space-y-1.5 text-zinc-300 pt-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>NENÍ to selhání výchovy ani nedostatku vůle.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>NENÍ to způsobeno sladkostmi ani displeji.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>Je to organická porucha chemického paliva mozku.</span>
                  </li>
                </ul>
              </div>

              {/* Karta 2 */}
              <div className="p-6 bg-zinc-800/30 border border-zinc-800/80 rounded-2xl space-y-3">
                <h3 className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                  Pod hladinou ledovce
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Okolí vidí prokrastinaci a neklid. Uvnitř však probíhá:
                </p>
                <ul className="text-[11px] space-y-2 text-zinc-300 pt-1">
                  <li>
                    <b className="text-zinc-200">Dopaminový deficit:</b> Chemické ticho při nudných úkolech.
                  </li>
                  <li>
                    <b className="text-zinc-200">Exekutivní paralýza:</b> Fyzická nemožnost začít pracovat.
                  </li>
                  <li>
                    <b className="text-zinc-200">Skotom času:</b> Vnímání času pouze jako "TEĎ" nebo "NĚKDY JINDY".
                  </li>
                </ul>
              </div>
            </div>

            {/* Karta 3: Překonání paralýzy */}
            <div className="p-6 bg-zinc-800/30 border border-zinc-800/80 rounded-2xl space-y-4">
              <h3 className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                Jak překonat exekutivní paralýzu?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                    1. Pravidlo 2 minut
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Zadejte si pouze mikro-krok (např. odnést 1 skleničku). První dopamin nastartuje další akce.
                  </p>
                </div>

                <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                    2. Tělesné dvojče
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Pracujte v přítomnosti další osoby. Zvyšuje to noradrenalin a usnadňuje fokus.
                  </p>
                </div>

                <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                    3. Hnědý šum
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Poslech hnědého šumu (Brown Noise) pomáhá vypnout vnitřní monolog a zklidnit smysly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Sekce Magazínu */}
          <section className="space-y-6 border-t border-zinc-800/60 pt-12">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {articles.map((art) => (
                <Link
                  key={art.id}
                  href="/magazin"
                  className="group p-5 bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span className="text-amber-300/90 font-medium">
                        {art.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" strokeWidth={1.5} /> {art.readTime}
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-amber-300 transition leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                      {art.perex}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] text-zinc-500 group-hover:text-zinc-300 flex items-center justify-between transition">
                    <span>{art.date}</span>
                    <span className="text-amber-300/80 group-hover:text-amber-300 flex items-center gap-0.5">
                      Číst <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </main>
      </div>

      {/* ZÁPATÍ (FOOTER) PODLE VZORU */}
      <footer className="border-t border-zinc-800/80 bg-[#0e0e10] pt-10 pb-8 mt-12 text-xs text-zinc-400">
        <div className="max-w-4xl mx-auto px-6 space-y-6 text-center sm:text-left">
          
          {/* Autorské prohlášení */}
          <div className="space-y-1.5 text-center text-zinc-400 max-w-2xl mx-auto">
            <p className="font-semibold text-zinc-300">
              © 2026 Noční Knihovna. Všechna práva vyhrazená.
            </p>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Veškeré nahrávky pro Vás zaznamenávám svým vlastním hlasem. Ilustrace jsou spoluvytvářené s pomocí AI a mnou ručně graficky upravené.
            </p>
          </div>

          <div className="border-t border-zinc-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Provozovatel */}
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

            {/* Odkazy */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
              <Link href="/o-autorce" className="text-amber-300 hover:underline">
                O autorce
              </Link>
              <span className="text-zinc-700">•</span>
              <Link href="/navigator" className="text-teal-300 hover:underline">
                Navigátor 40k
              </Link>
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
