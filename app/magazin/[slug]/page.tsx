import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Tag, BookOpen } from "lucide-react";
import { getPostBySlug } from "@/lib/notion";

export const revalidate = 60;

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#121214] text-zinc-300 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-semibold text-zinc-100">Článek nebyl nalezen</h1>
          <Link
            href="/magazin"
            className="inline-flex items-center gap-2 text-xs text-amber-300 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Zpět do magazínu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-300 font-sans leading-relaxed selection:bg-amber-400/20 selection:text-amber-300">
      {/* Jednotné záhlaví */}
      <header className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between border-b border-zinc-800/60">
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
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

      {/* Obsah článku */}
      <main className="max-w-3xl mx-auto px-6 pt-10 pb-20 space-y-8">
        <Link
          href="/magazin"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Zpět na všechny články</span>
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            {post.category && (
              <span className="text-amber-300/90 font-medium flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" strokeWidth={1.5} /> {post.category}
              </span>
            )}
            {post.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} /> {post.date}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100 leading-snug">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-amber-400/40 pl-4 py-0.5">
              {post.description}
            </p>
          )}
        </div>

        {/* Samotný text z Notion */}
        <div
          className="prose prose-invert prose-zinc max-w-none text-xs sm:text-sm leading-relaxed space-y-4 pt-4 border-t border-zinc-800/60"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Výzva k aplikaci na konci článku */}
        <div className="p-6 bg-zinc-800/30 border border-zinc-800 rounded-2xl text-center space-y-3 mt-12">
          <h3 className="text-sm font-semibold text-zinc-200">
            Chcete si tyto techniky vyzkoušet v praxi?
          </h3>
          <p className="text-xs text-zinc-400">
            Spusťte si aplikaci ADHDen zdarma přímo v prohlížeči.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold px-5 py-2.5 rounded-xl text-xs transition"
          >
            <span>Spustit aplikaci ADHDen</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </Link>
        </div>
      </main>
    </div>
  );
}
