import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag, ArrowRight, Play } from "lucide-react";
import { getPostBySlug, getPublishedPosts } from "@/lib/notion";

export const revalidate = 60;

// Pomocná funkce pro extrakci ID YouTube videa
function getYouTubeEmbedUrl(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

// Pomocná funkce pro Spotify Embed URL
function getSpotifyEmbedUrl(url: string) {
  // Převede např. https://open.spotify.com/track/XYZ na https://open.spotify.com/embed/track/XYZ
  return url.replace("open.spotify.com/", "open.spotify.com/embed/");
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const ytEmbed = post.youtubeUrl ? getYouTubeEmbedUrl(post.youtubeUrl) : null;
  const spotifyEmbed = post.spotifyUrl ? getSpotifyEmbedUrl(post.spotifyUrl) : null;

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-10 px-4">
      <article className="w-full max-w-2xl space-y-6">
        {/* Navigace zpět */}
        <Link href="/blog" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Zpět na všechny články
        </Link>

        {/* Hlavička článku */}
        <div className="space-y-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Tag className="w-3 h-3" /> {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {post.date}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>
          <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
            {post.perex}
          </p>
        </div>

        {/* YOUTUBE EMBED (pokud je zadáno v Notion) */}
        {ytEmbed && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-black my-4">
            <iframe
              src={ytEmbed}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* SPOTIFY EMBED (pokud je zadáno v Notion) */}
        {spotifyEmbed && (
          <div className="w-full rounded-2xl overflow-hidden my-4 border border-slate-800 bg-slate-900/40 p-1">
            <iframe
              src={spotifyEmbed}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl"
            />
          </div>
        )}

        {/* Textový obsah článku */}
        <div className="space-y-4 text-sm text-slate-200 leading-relaxed pt-2">
          {post.content?.map((paragraph, idx) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={idx} className="text-lg font-bold text-amber-300 pt-4 pb-1">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>

        {/* Výzva k akci (CTA Box pro přechod do aplikace) */}
        <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-500/30 rounded-2xl my-8 space-y-3 text-center">
          <h3 className="text-base font-bold text-white">Chcete si tyto techniky vyzkoušet v praxi?</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Spusťte si webovou aplikaci ADHDen zdarma přímo v prohlížeči – bez instalace a bez tlaku.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
          >
            Spustit aplikaci ADHDen <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </div>
  );
}
