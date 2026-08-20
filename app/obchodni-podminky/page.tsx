"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";

export default function ObchodniPodminkyPage() {
  return (
    <div className="min-h-screen bg-[#121214] text-zinc-300 font-sans leading-relaxed selection:bg-amber-400/20 selection:text-amber-300 flex flex-col justify-between">
      <div>
        <header className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between border-b border-zinc-800/60">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg font-semibold tracking-wider text-amber-300 group-hover:text-amber-200 transition">
              ADHDen
            </span>
            <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
              cz
            </span>
          </Link>

          <div className="flex items-center gap-4">
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

        <main className="max-w-3xl mx-auto px-6 pt-10 pb-20 space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span>Zpět na úvod</span>
          </Link>

          <div className="space-y-3 border-b border-zinc-800/60 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-[11px] text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Právní informace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100">
              Všeobecné obchodní podmínky
            </h1>
            <p className="text-xs text-zinc-400">
              Platné od 1. ledna 2026 pro projekt ADHDen a Noční Knihovna.
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-zinc-100">1. Základní ustanovení</h2>
              <p>
                Tyto všeobecné obchodní podmínky upravují vztahy mezi provozovatelem:
              </p>
              <div className="p-4 bg-zinc-800/30 border border-zinc-800 rounded-xl space-y-1 text-xs">
                <p className="font-bold text-zinc-200">Jitka Pekárková</p>
                <p>Sídlo: Primátorská 38, Praha 8</p>
                <p>IČO: 87458021</p>
                <p>Fyzická osoba zapsaná v živnostenském rejstříku.</p>
              </div>
            </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-zinc-100">2. Poskytované služby a digitální obsah</h2>
              <p>
                Provozovatelka poskytuje bezplatné webové nástroje (Time Timer, Kouskovač úkolů, Senzorické audio) i placené nebo volně ke stažení dostupné digitální produkty (průvodce, audio nahrávky, e-booky).
              </p>
              <p>
                Veškerý digitální obsah je chráněn autorským právem.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-zinc-100">3. Dodání digitálního obsahu</h2>
              <p>
                Digitální produkty (PDF průvodci, audio soubory) jsou doručovány elektronicky stažením přímo z webu nebo zasláním odkazu na zadaný e-mail.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-zinc-100">4. Odstoupení od smlouvy</h2>
              <p>
                U digitálního obsahu dodávaného elektronicky s předchozím výslovným souhlasem kupujícího nelze po zpřístupnění obsahu odstoupit od smlouvy bez udání důvodu v 14denní lhůtě dle § 1837 písm. l) občanského zákoníku.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-zinc-100">5. Kontaktní údaje</h2>
              <p>
                Pro jakékoliv dotazy nebo reklamace můžete využit e-mailovou adresu: <a href="mailto:jitka@jitkap.cz" className="text-amber-300 underline">jitka@jitkap.cz</a>.
              </p>
            </section>
          </div>
        </main>
      </div>

      <footer className="border-t border-zinc-800/80 bg-[#0e0e10] py-8 text-xs text-zinc-400 text-center">
        <p>© 2026 Noční Knihovna / ADHDen.cz. Všechna práva vyhrazená.</p>
      </footer>
    </div>
  );
}
