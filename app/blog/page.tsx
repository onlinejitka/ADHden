import Link from "next/link";
import { BookOpen, ArrowLeft, Calendar, Tag } from "lucide-react";
import { getPublishedPosts } from "@/lib/notion";

export const revalidate = 60; // Automatické obnovení obsahu z Notion každých 60 sekund

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Hlavička blogu */}
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Zpět na úvod ADHDen.cz
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-amber-400" /> Magazín & Průvodce
          </h1>
          <p className="text-sm text-slate-400">
            Praktické rady, psychologie pozornosti a postupy pro život a rodinu s ADHD.
          </p>
        </div>

        {/* Seznam článků */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block p-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl transition group"
            >
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" /> {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {post.date}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition mb-2">
                {post.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{post.perex}</p>
              <span className="text-xs text-amber-400 font-semibold">Číst celý článek →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
