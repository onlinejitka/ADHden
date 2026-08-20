"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Info,
  Zap,
  Sparkles,
  BookOpen,
  CheckCircle2
} from "lucide-react";

export default function AdhdLedovecPage() {
  const pdfUrl = "https://8djza3oduj7elsmo.public.blob.vercel-storage.com/ADHD%20ledovec%20-%20No%C4%8Dn%C3%AD%20Knihovna.pdf";
  const previewImgUrl = "https://8djza3oduj7elsmo.public.blob.vercel-storage.com/ADHD%20ledovec%20-%20No%C4%8Dn%C3%AD%20Knihovna%20-%20n%C3%A1hled.jpg";

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-300 font-sans leading-relaxed selection:bg-amber-400/20 selection:text-amber-300 flex flex-col justify-between">
      
      <div>
        {/* Záhlaví */}
<header className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between border-b border-zinc-800/60">
  <Link href="/" className="flex items-center gap-2 group">
    <span className="text-lg font-semibold tracking-wider text-amber-300 group-hover:text-amber-200 transition">
      ADHDen
    </span>
    <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
      cz
    </span>
  </Link>

  <div className="flex items-center gap-3 sm:gap-5">
    <Link
      href="/adhd-ledovec"
      className="text-xs text-zinc-400 hover:text-amber-300 transition flex items-center gap-1.5"
    >
      <FileText className="w-3.5 h-3.5 text-amber-300/80" strokeWidth={1.5} />
      <span>ADHD Ledovec</span>
    </Link>

    <Link
      href="/magazin"
      className="text-xs text-zinc-400 hover:text-zinc-200 transition flex items-center gap-1.5"
    >
      <BookOpen className="w-3.5 h-3.5 text-amber-300/80" strokeWidth={1.5} />
      <span>Magazín</span>
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
        <main className="max-w-4xl mx-auto px-6 pt-10 pb-20 space-y-12">
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span>Zpět na úvod</span>
          </Link>

          {/* Hero sekce s náhledem e-booku a přímým stažením */}
          <div className="p-8 sm:p-10 bg-zinc-800/30 border border-zinc-800 rounded-3xl space-y-8 text-center sm:text-left shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              <div className="space-y-5 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[11px] text-amber-300">
                  <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Neurodivergentní průvodce zdarma</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
                  ADHD <span className="text-amber-300">LEDOVEC</span>
                </h1>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Ucelený vizuální průvodce podstatou ADHD mozku. Zjistěte, co se skrývá pod hladinou viditelných projevů a jak pracovat s vlastní neurologií bez pocitů viny.
                </p>

                <div className="pt-2">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider transition active:scale-95 shadow-lg shadow-amber-400/10"
                  >
                    <Download className="w-4 h-4" strokeWidth={2} />
                    <span>Stáhnout e-book zdarma (PDF)</span>
                  </a>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-4 text-[11px] text-zinc-500 pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Bez registrace
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Okamžité stažení
                  </span>
                </div>
              </div>

              {/* Obrázek náhledu */}
              <div className="flex-shrink-0 max-w-xs sm:max-w-sm">
                <img
                  src={previewImgUrl}
                  alt="ADHD Ledovec náhled e-booku"
                  className="rounded-2xl border border-zinc-700/60 shadow-2xl hover:scale-102 transition duration-300"
                />
              </div>

            </div>
          </div>

          {/* PODROBNÝ OBSAH E-BOOKU */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-zinc-100 text-center sm:text-left">
              Co se v průvodci dozvíte?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Karta 1 */}
              <div className="p-6 bg-zinc-800/30 border border-zinc-800/80 rounded-2xl space-y-3">
                <h3 className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                  Co je a NENÍ ADHD?
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  ADHD je celoživotní neurovývojové onemocnění spojené s odlišnou hladinou dopaminu a noradrenalinu v prefrontální kůře.
                </p>
                <ul className="text-xs space-y-2 text-zinc-300 pt-1">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>NENÍ to selhání výchovy ani nedostatku vůle.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>NENÍ to způsobeno sladkostmi ani displeji.</span>
                  </li>
                  <li className="flex items-start gap-2">
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
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Okolí vidí prokrastinaci a neklid. Uvnitř však probíhá:
                </p>
                <ul className="text-xs space-y-2 text-zinc-300 pt-1">
                  <li>
                    <b className="text-zinc-100">Dopaminový deficit:</b> Chemické ticho při nudných úkolech.
                  </li>
                  <li>
                    <b className="text-zinc-100">Exekutivní paralýza:</b> Fyzická nemožnost začít pracovat.
                  </li>
                  <li>
                    <b className="text-zinc-100">Skotom času:</b> Vnímání času pouze jako "TEĎ" nebo "NĚKDY JINDY".
                  </li>
                </ul>
              </div>
            </div>

            {/* Karta 3 */}
            <div className="p-6 bg-zinc-800/30 border border-zinc-800/80 rounded-2xl space-y-4">
              <h3 className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                Jak překonat exekutivní paralýzu v praxi?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    1. Pravidlo 2 minut
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Zadejte si pouze mikro-krok (např. odnést 1 skleničku). První dopamin nastartuje další akce.
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    2. Tělesné dvojče
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Pracujte v přítomnosti další osoby (Body Doubling). Zvyšuje to noradrenalin a usnadňuje fokus.
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    3. Hnědý šum
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Poslech hnědého šumu (Brown Noise) pomáhá vypnout vnitřní monolog a zklidnit smysly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Spodní tlačítko ke stažení */}
          <div className="text-center pt-6">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition active:scale-95 shadow-xl shadow-amber-400/10"
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              <span>Stáhnout e-book zdarma (PDF)</span>
            </a>
          </div>

        </main>
      </div>

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
