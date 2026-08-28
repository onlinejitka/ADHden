"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Timer, Sparkles, Volume2, Users, ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Heart } from "lucide-react";

export default function LandingPage() {
  const [lang, setLang] = useState<"cs" | "en">("cs");

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#121214] text-zinc-100 font-sans leading-relaxed">
      {/* HORNÍ LIŠTA */}
      <header className="w-full border-b border-zinc-800/80 bg-[#121214]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src={lang === "en" ? "/ADHden-logo-en.jpg" : "/ADHden%20logo.jpg"}
              alt="ADHDen logo"
              className="h-9 w-auto rounded-lg object-contain"
            />
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* PŘEPÍNAČ JAZYKŮ */}
            <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setLang("cs")}
                className={`px-2 py-1 rounded-lg transition ${lang === "cs" ? "bg-amber-400 text-zinc-950 shadow" : "text-zinc-400 hover:text-white"}`}
              >
                CZ
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-lg transition ${lang === "en" ? "bg-amber-400 text-zinc-950 shadow" : "text-zinc-400 hover:text-white"}`}
              >
                EN
              </button>
            </div>

            <Link href="/blog" className="text-xs sm:text-sm text-zinc-300 hover:text-amber-300 font-semibold transition flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" /> {lang === "cs" ? "Magazín" : "Magazine"}
            </Link>

            <Link
              href="/app"
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-md active:scale-95 flex items-center gap-1.5"
            >
              {lang === "cs" ? "Spustit aplikaci" : "Launch App"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SEKCE */}
      <section className="w-full max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-amber-300 font-bold bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full mb-6">
          <Heart className="w-3.5 h-3.5" /> {lang === "cs" ? "Laskavý systém pro neurodivergentní mozek" : "A gentle daily OS for the neurodivergent brain"}
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mb-6">
          {lang === "cs" ? (
            <>
              Zkrotit chaos, časovou slepotu a paralýzu <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">bez pocitu viny.</span>
            </>
          ) : (
            <>
              Tame chaos, time blindness, and paralysis <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">without the guilt.</span>
            </>
          )}
        </h1>

        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10 font-normal">
          {lang === "cs"
            ? "ADHDen spojuje vizuální ubývání času, zklidňující hnědý šum, AI rozpad paralyzujících úkolů a tichého parťáka pro dospělé i rodiny s dětmi."
            : "ADHDen combines visual time tracking, calming brown noise, AI task micro-breakdowns, and quiet body doubling for adults and families with ADHD."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <Link
            href="/app"
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-zinc-950 font-extrabold px-8 py-4 rounded-2xl text-base transition shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 active:scale-95"
          >
            {lang === "cs" ? "Otevřít aplikaci v prohlížeči" : "Open Web App in Browser"} <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold px-6 py-4 rounded-2xl text-base transition flex items-center justify-center active:scale-95"
          >
            {lang === "cs" ? "Číst magazín" : "Read Guides"}
          </Link>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-400 mt-8">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-400" /> {lang === "cs" ? "Zdarma bez registrace" : "Free without sign-up"}</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-teal-400" /> {lang === "cs" ? "Žádné výčitky a tresty" : "No shame, no streaks"}</span>
        </div>
      </section>

      {/* 4 PILÍŘE */}
      <section className="w-full max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-zinc-900/70 border border-zinc-800 hover:border-amber-400/40 p-6 rounded-3xl transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-4">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{lang === "cs" ? "Vizuální Time Timer" : "Visual Pie Timer"}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {lang === "cs"
                ? "ADHD mozek nevnímá čísla. Ubývající koláčový disk dává času jasný fyzický tvar bez nutnosti počítání minut."
                : "The ADHD brain struggles with abstract digital numbers. Our disappearing color disc makes time physically visible."}
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 hover:border-teal-400/40 p-6 rounded-3xl transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-400/15 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-4">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{lang === "cs" ? "Hnědý šum" : "Browser Brown Noise"}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {lang === "cs"
                ? "Generovaný přímo v prohlížeči. Ztiší vnitřní dialog a vytvoří okamžitou sluchovou bariéru vůči distrakcím."
                : "Zero data streaming required. Muffles internal mind chatter and creates an instant auditory bubble against distractions."}
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 hover:border-purple-400/40 p-6 rounded-3xl transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-400/15 border border-purple-400/30 flex items-center justify-center text-purple-300 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{lang === "cs" ? "AI Kouskovač" : "AI Task Chunker"}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {lang === "cs"
                ? "Máte před sebou nepřekonatelný úkol? AI jej rozpadne na 3 primitivní fyzické kroky bez odporu."
                : "Stuck in executive paralysis? Our low-friction AI breaks overwhelming tasks into 3 physical micro-steps."}
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 hover:border-teal-400/40 p-6 rounded-3xl transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-400/15 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{lang === "cs" ? "Tichý parťák" : "Quiet Body Doubling"}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {lang === "cs"
                ? "Čištění zubů, reset stolu nebo úklid. Spusťte průvodce a dělejte monotónní činnost společně."
                : "Brush teeth, reset your desk, or fold laundry together. A comforting virtual presence to overcome resistance."}
            </p>
          </div>
        </div>
      </section>

      {/* PATIČKA S LÉKAŘSKÝM DISCLAIMEREM, INICIÁLAMI A COPYRIGHTEM */}
      <footer className="w-full border-t border-zinc-800/80 bg-[#121214] py-12 px-4 sm:px-6 mt-12 text-zinc-400 text-xs">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          {/* Lékařský disclaimer */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl text-[11px] leading-relaxed text-zinc-400 max-w-3xl mx-auto">
            <strong className="text-zinc-300 block mb-1">
              {lang === "cs" ? "⚠️ Upozornění (Disclaimer):" : "⚠️ Medical Disclaimer:"}
            </strong>
            {lang === "cs"
              ? "Obsah magazínu a nástroje v aplikaci ADHDen.cz slouží výhradně pro osobní organizaci, sebepoznání a podporu soustředění. Nepředstavují lékařskou, psychiatrickou ani psychologickou diagnostiku, péči či poradenství. V případě zdravotních či psychických obtíží vždy vyhledejte kvalifikovaného lékaře nebo terapeuta."
              : "The content and tools on ADHDen are designed exclusively for personal focus support, self-understanding, and daily organization. They do not constitute medical, psychiatric, or psychological advice, diagnosis, or treatment. Always consult a qualified healthcare professional regarding any medical condition."}
          </div>

          {/* Iniciály autora, odkazy a copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-zinc-900 gap-3 text-xs">
            <div>
              © {new Date().getFullYear()} <b>ADHDen</b> • {lang === "cs" ? "Vytvořila" : "Created by"}{" "}
              <a
                href="https://jitkap.cz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:underline font-semibold"
              >
                Jitka Pekárková (JP)
              </a>
            </div>

            <div className="flex gap-4 text-zinc-400">
              <Link href="/app" className="hover:text-zinc-200">{lang === "cs" ? "Aplikace" : "App"}</Link>
              <Link href="/blog" className="hover:text-zinc-200">{lang === "cs" ? "Magazín" : "Magazine"}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
