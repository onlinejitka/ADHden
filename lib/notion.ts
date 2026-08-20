const NOTION_API_KEY = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Převod bohatého textu z Notion (tučné, kurzíva, odkazy) do HTML
function richTextToHtml(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return "";
  return richText
    .map((t) => {
      let text = t.plain_text || t.text?.content || "";
      if (!text) return "";

      // Ošetření speciálních HTML znaků
      text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      if (t.annotations?.bold) text = `<strong class="font-bold text-zinc-100">${text}</strong>`;
      if (t.annotations?.italic) text = `<em class="italic text-zinc-300">${text}</em>`;
      if (t.annotations?.code)
        text = `<code class="bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono">${text}</code>`;
      if (t.href || t.link?.url) {
        const url = t.href || t.link?.url;
        text = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-amber-300 underline underline-offset-2 hover:text-amber-200 font-medium">${text}</a>`;
      }
      return text;
    })
    .join("");
}

// Převod Notion bloků (odstavce, odrážky, nadpisy) do HTML
function blocksToHtml(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  let html = "";
  let inBulletedList = false;
  let inNumberedList = false;

  for (const block of blocks) {
    const type = block.type;
    if (!type) continue;

    const data = block[type];
    const content = data?.rich_text ? richTextToHtml(data.rich_text) : "";

    // Zpracování odrážkového seznamu
    if (type === "bulleted_list_item") {
      if (!inBulletedList) {
        if (inNumberedList) {
          html += "</ol>";
          inNumberedList = false;
        }
        html += '<ul class="space-y-3 my-4 pl-2">';
        inBulletedList = true;
      }
      html += `<li class="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed"><span class="text-amber-400 font-bold text-base leading-none mt-0.5">•</span><div class="flex-1">${content}</div></li>`;
      continue;
    } else if (inBulletedList) {
      html += "</ul>";
      inBulletedList = false;
    }

    // Zpracování číslovaného seznamu
    if (type === "numbered_list_item") {
      if (!inNumberedList) {
        if (inBulletedList) {
          html += "</ul>";
          inBulletedList = false;
        }
        html += '<ol class="space-y-3 my-4 pl-2">';
        inNumberedList = true;
      }
      html += `<li class="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed"><span class="text-amber-400 font-bold text-xs mt-0.5">1.</span><div class="flex-1">${content}</div></li>`;
      continue;
    } else if (inNumberedList) {
      html += "</ol>";
      inNumberedList = false;
    }

    // Ostatní typy bloků
    if (type === "paragraph") {
      if (content.trim()) {
        html += `<p class="mb-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">${content}</p>`;
      }
    } else if (type === "heading_1") {
      html += `<h1 class="text-xl font-bold text-zinc-100 mt-8 mb-3">${content}</h1>`;
    } else if (type === "heading_2") {
      html += `<h2 class="text-lg font-bold text-zinc-100 mt-8 mb-3">${content}</h2>`;
    } else if (type === "heading_3") {
      html += `<h3 class="text-base font-semibold text-amber-300 mt-6 mb-2">${content}</h3>`;
    } else if (type === "quote") {
      html += `<blockquote class="border-l-2 border-amber-400 pl-4 italic text-zinc-400 my-6">${content}</blockquote>`;
    } else if (type === "callout") {
      html += `<div class="p-4 bg-zinc-800/40 border border-zinc-700/60 rounded-xl my-6 text-xs sm:text-sm text-zinc-200">${content}</div>`;
    }
  }

  if (inBulletedList) html += "</ul>";
  if (inNumberedList) html += "</ol>";

  return html;
}

// Načtení seznamu publikovaných článků
export async function getPublishedPosts() {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) return [];

  try {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();

    return data.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title:
          props.Title?.title[0]?.plain_text ||
          props.Název?.title[0]?.plain_text ||
          "Bez názvu",
        slug:
          props.Slug?.rich_text[0]?.plain_text ||
          props.Slug?.title[0]?.plain_text ||
          page.id,
        description:
          props.Perex?.rich_text[0]?.plain_text ||
          props.Perex?.title[0]?.plain_text ||
          "",
        category: props.Category?.select?.name || "ADHD & Čas",
        date: props.Date?.date?.start
          ? new Date(props.Date.date.start).toLocaleDateString("cs-CZ", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "",
        youtube:
          props.YouTube?.url ||
          props.YouTube?.rich_text[0]?.plain_text ||
          "",
      };
    });
  } catch (error) {
    console.error("Chyba getPublishedPosts:", error);
    return [];
  }
}

// Načtení konkrétního článku včetně těla stránky (bloků)
export async function getPostBySlug(slug: string) {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID || !slug) return null;

  try {
    // 1. Vyhledání stránky podle Slug
    const queryRes = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
        }),
        next: { revalidate: 60 },
      }
    );

    if (!queryRes.ok) return null;
    const queryData = await queryRes.json();
    const page = queryData.results[0];

    if (!page) return null;

    const props = page.properties;

    // 2. Načtení bloků (těla) stránky
    const blocksRes = await fetch(
      `https://api.notion.com/v1/blocks/${page.id}/children?page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
        },
        next: { revalidate: 60 },
      }
    );

    let contentHtml = "";
    if (blocksRes.ok) {
      const blocksData = await blocksRes.json();
      contentHtml = blocksToHtml(blocksData.results);
    }

    return {
      id: page.id,
      title:
        props.Title?.title[0]?.plain_text ||
        props.Název?.title[0]?.plain_text ||
        "Bez názvu",
      description:
        props.Perex?.rich_text[0]?.plain_text ||
        props.Perex?.title[0]?.plain_text ||
        "",
      category: props.Category?.select?.name || "ADHD & Čas",
      date: props.Date?.date?.start
        ? new Date(props.Date.date.start).toLocaleDateString("cs-CZ", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "",
      youtube:
        props.YouTube?.url ||
        props.YouTube?.rich_text[0]?.plain_text ||
        "",
      contentHtml,
    };
  } catch (error) {
    console.error("Chyba getPostBySlug:", error);
    return null;
  }
}
