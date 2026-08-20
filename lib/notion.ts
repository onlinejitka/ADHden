const NOTION_API_KEY = (
  process.env.NOTION_API_KEY ||
  process.env.NOTION_TOKEN ||
  ""
).trim();

const NOTION_DATABASE_ID = (
  process.env.NOTION_DATABASE_ID ||
  ""
).trim();

// Převod bohatého textu z Notion (tučné, kurzíva, odkazy + Shift+Enter \n -> <br/>)
function richTextToHtml(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return "";
  return richText
    .map((t) => {
      let text = t.plain_text || t.text?.content || "";
      if (!text) return "";

      // Ošetření HTML a zachování Shift+Enter
      text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br />");

      if (t.annotations?.bold) {
        text = `<strong class="font-bold text-zinc-100">${text}</strong>`;
      }
      if (t.annotations?.italic) {
        text = `<em class="italic text-zinc-300">${text}</em>`;
      }
      if (t.annotations?.code) {
        text = `<code class="bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono">${text}</code>`;
      }
      if (t.annotations?.strikethrough) {
        text = `<s class="line-through text-zinc-500">${text}</s>`;
      }

      const linkUrl = t.href || t.link?.url || t.text?.link?.url;
      if (linkUrl) {
        text = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-amber-300 underline underline-offset-2 hover:text-amber-200 font-medium transition">${text}</a>`;
      }
      return text;
    })
    .join("");
}

// Převod bloků z Notion (odstavce, odrážky, nadpisy) do HTML s jasnými odstupovými mezerami
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

    // Odrážky s dostatečným horním i spodním odstupem (my-6)
    if (type === "bulleted_list_item") {
      if (!inBulletedList) {
        if (inNumberedList) {
          html += "</ol>";
          inNumberedList = false;
        }
        html += '<ul class="space-y-3 my-6 pl-1">';
        inBulletedList = true;
      }
      html += `<li class="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed"><span class="text-amber-400 font-bold text-base leading-none mt-0.5">•</span><div class="flex-1">${content}</div></li>`;
      continue;
    } else if (inBulletedList) {
      html += "</ul>";
      inBulletedList = false;
    }

    // Číslovaný seznam
    if (type === "numbered_list_item") {
      if (!inNumberedList) {
        if (inBulletedList) {
          html += "</ul>";
          inBulletedList = false;
        }
        html += '<ol class="space-y-3 my-6 pl-1">';
        inNumberedList = true;
      }
      html += `<li class="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed"><span class="text-amber-400 font-bold text-xs mt-0.5">1.</span><div class="flex-1">${content}</div></li>`;
      continue;
    } else if (inNumberedList) {
      html += "</ol>";
      inNumberedList = false;
    }

    // Odstavce a nadpisy s jasným řádkováním
    if (type === "paragraph") {
      if (content.trim()) {
        html += `<p class="mb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed">${content}</p>`;
      }
    } else if (type === "heading_1") {
      html += `<h1 class="text-xl sm:text-2xl font-bold text-zinc-100 mt-10 mb-4">${content}</h1>`;
    } else if (type === "heading_2") {
      html += `<h2 class="text-lg sm:text-xl font-bold text-zinc-100 mt-9 mb-3">${content}</h2>`;
    } else if (type === "heading_3") {
      html += `<h3 class="text-base sm:text-lg font-semibold text-amber-300 mt-7 mb-3">${content}</h3>`;
    } else if (type === "quote") {
      html += `<blockquote class="border-l-2 border-amber-400 pl-4 italic text-zinc-400 my-6 leading-relaxed">${content}</blockquote>`;
    } else if (type === "callout") {
      html += `<div class="p-4 bg-zinc-800/40 border border-zinc-700/60 rounded-xl my-6 text-xs sm:text-sm text-zinc-200 leading-relaxed">${content}</div>`;
    } else if (type === "image") {
      const imgUrl = data?.external?.url || data?.file?.url;
      if (imgUrl) {
        html += `<div class="my-6"><img src="${imgUrl}" alt="" class="rounded-2xl max-w-full border border-zinc-800" /></div>`;
      }
    }
  }

  if (inBulletedList) html += "</ul>";
  if (inNumberedList) html += "</ol>";

  return html;
}

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
        body: JSON.stringify({}),
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();

    return data.results.map((page: any) => {
      const props = page.properties;
      const getPropText = (prop: any) => {
        if (!prop) return "";
        if (prop.title && prop.title.length > 0) return prop.title[0].plain_text;
        if (prop.rich_text && prop.rich_text.length > 0) return prop.rich_text[0].plain_text;
        return "";
      };

      return {
        id: page.id,
        title: getPropText(props.Title) || getPropText(props.Název) || "Bez názvu",
        slug: getPropText(props.Slug) || page.id,
        description: getPropText(props.Perex) || getPropText(props.Popis) || "",
        category: props.Category?.select?.name || props.Kategorie?.select?.name || "ADHD & Čas",
        date: props.Date?.date?.start || props.Datum?.date?.start
          ? new Date(props.Date?.date?.start || props.Datum?.date?.start).toLocaleDateString("cs-CZ", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "",
        youtube: props.YouTube?.url || getPropText(props.YouTube) || "",
      };
    });
  } catch (error) {
    console.error("Chyba getPublishedPosts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID || !slug) return null;

  try {
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
    let page = queryData.results[0];

    if (!page) {
      const allPosts = await getPublishedPosts();
      page = allPosts.find((p: any) => p.slug === slug || p.id === slug);
      if (!page) return null;
    }

    const props = page.properties || {};
    const getPropText = (prop: any) => {
      if (!prop) return "";
      if (prop.title && prop.title.length > 0) return prop.title[0].plain_text;
      if (prop.rich_text && prop.rich_text.length > 0) return prop.rich_text[0].plain_text;
      return "";
    };

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
      title: getPropText(props.Title) || getPropText(props.Název) || "Bez názvu",
      description: getPropText(props.Perex) || getPropText(props.Popis) || "",
      category: props.Category?.select?.name || props.Kategorie?.select?.name || "ADHD & Čas",
      date: props.Date?.date?.start || props.Datum?.date?.start
        ? new Date(props.Date?.date?.start || props.Datum?.date?.start).toLocaleDateString("cs-CZ", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "",
      youtube: props.YouTube?.url || getPropText(props.YouTube) || "",
      contentHtml,
    };
  } catch (error) {
    console.error("Chyba getPostBySlug:", error);
    return null;
  }
}
