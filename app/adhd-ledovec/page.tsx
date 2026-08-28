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
  CheckCircle2,
  FileText,
  ShieldCheck
} from "lucide-react";

export const revalidate = 60;

export default async function AdhdLedovecPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const resolvedParams = await searchParams;
  const isEn = resolvedParams?.lang?.toLowerCase() === "en";

  // DYNAMICKÉ ODKAZY NA PDF A NÁHLEDOVÝ OBRÁZEK (CZ vs EN)
  const pdfUrl = isEn
    ? "https://8djza3oduj7elsmo.public.blob.vercel-storage.com/ADHD%20iceberg%20-%20ADHday.pdf"
    : "https://8djza3oduj7elsmo.public.blob.vercel-storage.com/ADHD%20ledovec%20-%20No%C4%8Dn%C3%AD%20Knihovna.pdf";

  const previewImgUrl = isEn
    ? "https://8djza3oduj7elsmo.public.blob.vercel-storage.com/ADHD%20iceberg%20-%20ADHday%20-%20free%20download.jpg"
    : "https://8djza3oduj7elsmo.public.blob.vercel-storage.com/ADHD%20ledovec%20-%20No%C4%8Dn%C3%AD%20Knihovna%20-%20n%C3%A1hled.jpg";

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-300 font-sans leading-relaxed selection:bg-amber-400/20 selection:text-amber-300 flex flex-col justify-between">
      <div>
        {/* Záhlaví */}
        <header className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-zinc-800/60 gap-2">
          {/* Logo v záhlaví (Podle jazyka + proklik na správný úvod) */}
          <Link href={isEn ? "/?lang=en" : "/"} className="flex items-center flex-shrink-0 group">
            <img
              src={isEn ? "/ADHday%20logo%20EN.jpg" : "/ADHden%20logo.jpg"}
              alt="ADHDen logo"
              className="h-8 sm:h-9 w-auto rounded-lg object-contain group-hover:opacity-90 transition"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* PŘEPÍNAČ JAZYKŮ CZ | EN */}
            <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-xl text-xs font-bold flex-shrink-0">
              <Link
                href="/adhd-ledovec?lang=cs"
                className={`px-2.5 py-1 rounded-lg transition ${
                  !isEn
                    ? "bg-amber-400 text-zinc-950 font-bold shadow"
                    : "text-zinc-400 hover:text-zinc-200 font-medium"
                }`}
              >
                CZ
              </Link>
              <Link
                href="/adhd-ledovec?lang=en"
                className={`px-2.5 py-1 rounded-lg transition ${
                  isEn
                    ? "bg-amber-400 text-zinc-950 font-bold shadow"
                    : "text-zinc-400 hover:text-zinc-200 font-medium"
                }`}
              >
                EN
              </Link>
            </div>

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

        {/* Hlavní obsah */}
        <main className="max-w-4xl mx-auto px-6 pt-10 pb-20 space-y-12">
          <Link
            href={isEn ? "/?lang=en" : "/"}
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span>{isEn ? "Back to home" : "Zpět na úvod"}</span>
          </Link>

          {/* Hero sekce s náhledem e-booku a přímým stažením */}
          <div className="p-8 sm:p-10 bg-zinc-800/30 border border-zinc-800 rounded-3xl space-y-8 text-center sm:text-left shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-5 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[11px] text-amber-300">
                  <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>{isEn ? "Free Neurodivergent Guide" : "Neurodivergentní průvodce zdarma"}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
                  ADHD <span className="text-amber-300">{isEn ? "ICEBERG" : "LEDOVEC"}</span>
                </h1>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {isEn
                    ? "A comprehensive visual guide to the nature of the ADHD brain. Discover what lies beneath the surface of visible behaviors and learn how to work with your neurology without guilt."
                    : "Ucelený vizuální průvodce podstatou ADHD mozku. Zjistěte, co se skrývá pod hladinou viditelných projevů a jak pracovat s vlastní neurologií bez pocitů viny."}
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
                    <span>{isEn ? "Download free e-book (PDF)" : "Stáhnout e-book zdarma (PDF)"}</span>
                  </a>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-4 text-[11px] text-zinc-500 pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> {isEn ? "No sign-up" : "Bez registrace"}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> {isEn ? "Instant download" : "Okamžité stažení"}
                  </span>
                </div>
              </div>

              {/* Obrázek náhledu */}
              <div className="flex-shrink-0 max-w-xs sm:max-w-sm">
                <img
                  src={previewImgUrl}
                  alt={isEn ? "ADHD Iceberg e-book preview" : "ADHD Ledovec náhled e-booku"}
                  className="rounded-2xl border border-zinc-700/60 shadow-2xl hover:scale-102 transition duration-300"
                />
              </div>
            </div>
          </div>

          {/* PODROBNÝ OBSAH E-BOOKU */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-zinc-100 text-center sm:text-left">
              {isEn ? "What you will discover in the guide:" : "Co se v průvodci dozvíte?"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Karta 1 */}
              <div className="p-6 bg-zinc-800/30 border border-zinc-800/80 rounded-2xl space-y-3">
                <h3 className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                  {isEn ? "What ADHD IS and IS NOT" : "Co je a NENÍ ADHD?"}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {isEn
                    ? "ADHD is a lifelong neurodevelopmental condition linked to dopamine and norepinephrine regulation in the prefrontal cortex."
                    : "ADHD je celoživotní neurovývojové onemocnění spojené s odlišnou hladinou dopaminu a noradrenalinu v prefrontální kůře."}
                </p>
                <ul className="text-xs space-y-2 text-zinc-300 pt-1">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>{isEn ? "It is NOT a moral failure or lack of willpower." : "NENÍ to selhání výchovy ani nedostatku vůle."}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>{isEn ? "It is NOT caused by sugar or screens." : "NENÍ to způsobeno sladkostmi ani displeji."}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>{isEn ? "It is an organic difference in brain chemical fuel." : "Je to organická porucha chemického paliva mozku."}</span>
                  </li>
                </ul>
              </div>

              {/* Karta 2 */}
              <div className="p-6 bg-zinc-800/30 border border-zinc-800/80 rounded-2xl space-y-3">
                <h3 className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                  {isEn ? "Beneath the Surface" : "Pod hladinou ledovce"}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {isEn
                    ? "Others only see procrastination and restlessness. What is actually happening inside:"
                    : "Okolí vidí prokrastinaci a neklid. Uvnitř však probíhá:"}
                </p>
                <ul className="text-xs space-y-2 text-zinc-300 pt-1">
                  <li>
                    <b className="text-zinc-100">{isEn ? "Dopamine Deficit:" : "Dopaminový deficit:"}</b>{" "}
                    {isEn ? "Chemical silence during understimulating tasks." : "Chemické ticho při nudných úkolech."}
                  </li>
                  <li>
                    <b className="text-zinc-100">{isEn ? "Executive Paralysis:" : "Exekutivní paralýza:"}</b>{" "}
                    {isEn ? "The physical inability to initiate action." : "Fyzická nemožnost začít pracovat."}
                  </li>
                  <li>
                    <b className="text-zinc-100">{isEn ? "Time Blindness:" : "Skotom času:"}</b>{" "}
                    {isEn ? "Perceiving time strictly as 'NOW' or 'NOT NOW'." : "Vnímání času pouze jako 'TEĎ' nebo 'NĚKDY JINDY'."}
                  </li>
                </ul>
              </div>
            </div>

            {/* Karta 3 */}
            <div className="p-6 bg-zinc-800/30 border border-zinc-800/80 rounded-2xl space-y-4">
              <h3 className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                {isEn ? "How to Overcome Executive Paralysis in Practice?" : "Jak překonat exekutivní paralýzu v praxi?"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    {isEn ? "1. The 2-Minute Rule" : "1. Pravidlo 2 minut"}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {isEn
                      ? "Set only one micro-step (e.g., wash 1 mug). That first dopamine hit jumpstarts the next action."
                      : "Zadejte si pouze mikro-krok (např. odnést 1 skleničku). První dopamin nastartuje další akce."}
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    {isEn ? "2. Body Doubling" : "2. Tělesné dvojče"}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {isEn
                      ? "Work in the quiet presence of another person (Body Doubling). It elevates focus and lowers friction."
                      : "Pracujte v přítomnosti další osoby (Body Doubling). Zvyšuje to noradrenalin a usnadňuje fokus."}
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    {isEn ? "3. Brown Noise" : "3. Hnědý šum"}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {isEn
                      ? "Listening to steady brown noise helps mute internal racing thoughts and calms sensory overload."
                      : "Poslech hnědého šumu (Brown Noise) pomáhá vypnout vnitřní monolog a zklidnit smysly."}
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
              <span>{isEn ? "Download free e-book (PDF)" : "Stáhnout e-book zdarma (PDF)"}</span>
            </a>
          </div>
        </main>
      </div>

      {/* ZÁPATÍ */}
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
