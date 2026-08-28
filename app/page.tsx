import Link from "next/link";
import { Timer, Sparkles, Volume2, Users, ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import { getPublishedPosts } from "@/lib/notion";

export default async function LandingPage() {
  const posts = await getPublishedPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#121214] text-zinc-100">
      {/* HEADER */}
      <header className="w-full border-b border-zinc-800/80 bg-[#121214]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/ADHden%20logo.jpg"
              alt="ADHDen logo"
              className="h-9 w-auto rounded-lg object-contain"
            />
          </Link>

          <nav className="flex items-center gap-3 sm:gap-6">
            <Link href="/blog" className="text-xs sm:text-sm text-zinc-300 hover:text-amber-300 font-semibold transition flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" /> Magazine & Guides
            </Link>
            <Link
              href="/app"
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-lg shadow-amber-400/15 flex items-center gap-1.5 active:scale-95"
            >
              Launch App Free <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="w-full max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-amber-300 font-bold bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full mb-6">
          <Heart className="w-3.5 h-3.5" /> A gentle daily OS for the neurodivergent brain
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
          Tame chaos, time blindness, and paralysis <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">without the guilt.</span>
        </h1>

        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10 font-normal">
          ADHDen combines visual time tracking, calming brown noise, AI task micro-breakdowns, and quiet body doubling for adults and neurodivergent families.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <Link
            href="/app"
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-zinc-950 font-extrabold px-8 py-4 rounded-2xl text-base transition shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 active:scale-95"
          >
            Open Web App in Browser <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold px-6 py-4 rounded-2xl text-base transition flex items-center justify-center active:scale-95"
          >
            Read Guides
          </Link>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-400 mt-8">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Free with zero friction</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-teal-400" /> No shame, no streaks</span>
        </div>
      </section>

      {/* 4 CORE PILLARS */}
      <section className="w-full max-w-6xl px-4 sm:px-6 py-12">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Designed specifically for ADHD cognitive dynamics
          </h2>
          <p className="text-sm text-zinc-400">Why generic to-do lists fail and how ADHDen creates effortless momentum.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-zinc-900/70 border border-zinc-800 hover:border-amber-400/40 p-6 rounded-3xl transition space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-4">
                <Timer className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Visual Pie Timer</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The ADHD brain struggles with abstract digital numbers. Our disappearing color disc makes time physically visible.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-amber-300 pt-2">Visual grounding →</span>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 hover:border-teal-400/40 p-6 rounded-3xl transition space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-400/15 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-4">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Browser Brown Noise</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Zero data streaming required. Muffles internal mind chatter and creates an instant auditory bubble against distractions.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-teal-300 pt-2">Sensory calm →</span>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 hover:border-purple-400/40 p-6 rounded-3xl transition space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-400/15 border border-purple-400/30 flex items-center justify-center text-purple-300 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">AI Task Chunker</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Stuck in executive paralysis? Our low-friction AI breaks overwhelming mountains into 3 physical, actionable micro-steps.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-purple-300 pt-2">Unfreeze instantly →</span>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 hover:border-teal-400/40 p-6 rounded-3xl transition space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-400/15 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Quiet Body Doubling</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Brush teeth, reset your desk, or fold laundry together. A comforting virtual presence to overcome task initiation resistance.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-teal-300 pt-2">Parallel focus →</span>
          </div>
        </div>
      </section>

      {/* MAGAZINE SECTION */}
      <section className="w-full max-w-6xl px-4 sm:px-6 py-16 border-t border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Magazine & Guides</h2>
            <p className="text-sm text-zinc-400">Science-backed insights and compassionate strategies for everyday life.</p>
          </div>
          <Link href="/blog" className="text-xs sm:text-sm text-amber-300 hover:underline font-bold">
            All Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="p-6 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-400/40 rounded-3xl transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                  {post.perex}
                </p>
              </div>
              <span className="text-xs text-amber-300 font-semibold mt-6 flex items-center gap-1">
                Read Article →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-zinc-900 bg-[#121214] py-10 text-center text-xs text-zinc-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} ADHDen – Created with compassion for quieter minds.</div>
          <div className="flex gap-4 text-zinc-500">
            <Link href="/app" className="hover:text-zinc-300">Web App</Link>
            <Link href="/blog" className="hover:text-zinc-300">Magazine</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
