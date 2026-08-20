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
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#121214] text-zinc-300 font-sans leading-relaxed selection:bg-amber-400/20 selection:text-amber-300">
      
      {/* Horní navigace */}
      <header className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-wider text-amber-300">
            ADHDen
          </span>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
            cz
          </span>
        </div>

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

      {/* Hero sekce s mírnější typografií */}
      <main className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center space-y-8">
        
        {/* Odznáček */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-[11px] text-amber-300/90">
          <span>♡ Laskavý systém pro neurodivergentní mozek</span>
        </div>

        {/* Hlavní nadpis - zmenšen a zjemněn proti přehlcení */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-zinc-100 max-w-2xl mx-auto leading-normal tracking-wide">
          Zkrotit chaos, časovou slepotu a paralýzu{" "}
          <span className="text-amber-300 font-normal">bez pocitu viny.</span>
        </h1>

        {/* Podnadpis */}
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          ADHDen spojuje vizuální ubývání času, zklidňující hnědý šum, AI rozpad paralyzujících úkolů a společného parťáka pro dospělé i rodiny s dětmi.
        </p>

        {/* Akční tlačítka */}
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

        {/* Drobné garance pod tlačítky */}
        <div className="flex items-center justify-center gap-6 text-[11px] text-zinc-500 pt-2">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.5} /> Zdarma bez registrace
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.5} /> Žádné výčitky a tresty
          </span>
        </div>

        {/* Sekce Nástrojů */}
        <section className="pt-16 space-y-6 text-left">
          <div className="text-center space-y-1.5">
            <h2 className="text-lg font-semibold text-zinc-200">
              Nástroje navržené přímo pro ADHD dynamiku
            </h2>
            <p className="text-xs text-zinc-400">
              Proč běžné úkolovníky a minutky selhávají a jak vám pomůže ADHDen.
            </p>
          </div>

          {/* Mřížka 4 dlaždic - nyní plně proklikávatelných */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            
            {/* Dlaždice 1: Time Timer */}
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

            {/* Dlaždice 2: Hnědý šum */}
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

            {/* Dlaždice 3: AI Kouskovač */}
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

            {/* Dlaždice 4: Body Doubling */}
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
      </main>
    </div>
  );
}
