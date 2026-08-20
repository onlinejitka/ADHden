import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Tag, BookOpen } from "lucide-react";
import { getPostBySlug } from "@/lib/notion";

export const revalidate = 60;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#121214] text-zinc-300 flex items-center justify-center p-6 font-sans">
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

  // Detekce obsahu (string HTML vs. pole bloků z Notionu)
  const rawContent =
    post.contentHtml ||
    post.content ||
    post.html ||
    post.markdown ||
    post.blocks ||
    post.body;

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-300 font-sans leading-relaxed selection:bg-amber-400/20 selection:text-amber-300">
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
            {post.title || "Bez názvu"}
          </h1>

          {post.description && (
            <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-amber-400/40 pl-4 py-0.5">
              {post.description}
            </p>
          )}
        </div>

        {/* Vykreslení obsahu podle typu (HTML string vs. Pole bloků) */}
        <div className="pt-4 border-t border-zinc-800/60">
          {typeof rawContent === "string" && rawContent.length > 0 ? (
            <div
              className="prose prose-invert prose-zinc max-w-none text-xs sm:text-sm leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: rawContent }}
            />
          ) : Array.isArray(rawContent) && rawContent.length > 0 ? (
            <div className="space-y-3">
              {rawContent.map((block: any, idx: number) => renderNotionBlock(block, idx))}
            </div>
          ) : (
            <div className="text-xs text-zinc-500 italic">
              Obsah článku se nepodařilo načíst z Notionu.
            </div>
          )}
        </div>

        {/* Výzva na konci článku */}
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

// Pomocná funkce pro převod a vykreslení Notion bloků (odstavce, nadpisy, videa)
function renderNotionBlock(block: any, index: number) {
  if (typeof block === "string") {
    return <p key={index} className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-3">{block}</p>;
  }

  const type = block?.type;
  if (!type) return null;

  const data = block[type];
  const text =
    data?.rich_text?.map((t: any) => t.plain_text).join("") ||
    data?.text ||
    "";

  switch (type) {
    case "heading_1":
      return <h1 key={index} className="text-xl font-bold text-zinc-100 mt-6 mb-3">{text}</h1>;
    case "heading_2":
      return <h2 key={index} className="text-lg font-semibold text-zinc-100 mt-5 mb-2">{text}</h2>;
    case "heading_3":
      return <h3 key={index} className="text-base font-semibold text-amber-300 mt-4 mb-2">{text}</h3>;
    case "paragraph":
      return <p key={index} className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-3">{text}</p>;
    case "bulleted_list_item":
      return <li key={index} className="text-xs sm:text-sm text-zinc-300 ml-4 list-disc mb-1">{text}</li>;
    case "numbered_list_item":
      return <li key={index} className="text-xs sm:text-sm text-zinc-300 ml-4 list-decimal mb-1">{text}</li>;
    case "quote":
      return <blockquote key={index} className="border-l-2 border-amber-400 pl-4 italic text-zinc-400 my-4">{text}</blockquote>;
    case "video":
    case "embed": {
      const url = data?.external?.url || data?.file?.url || data?.url;
      if (url && (url.includes("youtube") || url.includes("youtu.be"))) {
        const embedUrl = url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/");
        return (
          <div key={index} className="my-6 aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800">
            <iframe src={embedUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        );
      }
      return null;
    }
    case "image": {
      const imgUrl = data?.external?.url || data?.file?.url;
      return imgUrl ? <img key={index} src={imgUrl} alt="" className="rounded-2xl my-4 max-w-full" /> : null;
    }
    default:
      return text ? <p key={index} className="text-xs sm:text-sm text-zinc-300 mb-2">{text}</p> : null;
  }
}
