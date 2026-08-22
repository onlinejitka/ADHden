const NOTION_API_KEY = (
  process.env.NOTION_API_KEY ||
  process.env.NOTION_TOKEN ||
  ""
).trim();

const NOTION_DATABASE_ID = (
  process.env.NOTION_DATABASE_ID ||
  ""
).trim();

function richTextToHtml(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return "";
  return richText
    .map((t) => {
      let text = t.plain_text || t.text?.content || "";
      if (!text) return "";

      text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, '<br style="display: block; margin-top: 0.3rem; content: \'\';" />');

      if (t.annotations?.bold) {
        text = `<strong style="font-weight: 600; color: #f4f4f5;">${text}</strong>`;
      }
      if (t.annotations?.italic) {
        text = `<em style="font-style: italic; color: #d4d4d8;">${text}</em>`;
      }
      if (t.annotations?.code) {
        text = `<code style="background-color: #27272a; color: #fcd34d; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.75rem; font-family: monospace;">${text}</code>`;
      }
      if (t.annotations?.strikethrough) {
        text = `<s style="text-decoration: line-through; color: #71717a;">${text}</s>`;
      }

      const linkUrl = t.href || t.link?.url || t.text?.link?.url;
      if (linkUrl) {
        text = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #fcd34d; text-decoration: underline; text-underline-offset: 3px; font-weight: 500;">${text}</a>`;
      }
      return text;
    })
    .join("");
}

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

    if (type === "bulleted_list_item") {
      if (!inBulletedList) {
        if (inNumberedList) {
          html += "</ol>";
          inNumberedList = false;
        }
        html += '<ul style="margin-top: 1.25rem; margin-bottom: 1.25rem; padding-left: 0.25rem;">';
        inBulletedList = true;
      }
      html += `<li style="margin-bottom: 0.625rem; display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8125rem; line-height: 1.65; color: #d4d4d8;"><span style="color: #fbbf24; font-weight: bold; font-size: 0.95rem; line-height: 1; margin-top: 0.15rem;">•</span><div style="flex: 1 1 0%;">${content}</div></li>`;
      continue;
    } else if (inBulletedList) {
      html += "</ul>";
      inBulletedList = false;
    }

    if (type === "numbered_list_item") {
      if (!inNumberedList) {
        if (inBulletedList) {
          html += "</ul>";
          inBulletedList = false;
        }
        html += '<ol style="margin-top: 1.25rem; margin-bottom: 1.25rem; padding-left: 0.25rem;">';
        inNumberedList = true;
      }
      html += `<li style="margin-bottom: 0.625rem; display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8125rem; line-height: 1.65; color: #d4d4d8;"><span style="color: #fbbf24; font-weight: bold; font-size: 0.75rem; margin-top: 0.1rem;">1.</span><div style="flex: 1 1 0%;">${content}</div></li>`;
      continue;
    } else if (inNumberedList) {
      html += "</ol>";
      inNumberedList = false;
    }

    if (type === "paragraph") {
      if (content.trim()) {
        html += `<p style="margin-bottom: 1.15rem; font-size: 0.8125rem; line-height: 1.7; color: #d4d4d8;">${content}</p>`;
      } else {
        html += `<div style="height: 0.875rem;"></div>`;
      }
    } else if (type === "heading_1") {
      html += `<h1 style="margin-top: 2rem; margin-bottom: 0.75rem; font-size: 1.15rem; font-weight: 700; color: #f4f4f5; line-height: 1.3;">${content}</h1>`;
    } else if (type === "heading_2") {
      html += `<h2 style="margin-top: 1.75rem; margin-bottom: 0.625rem; font-size: 1.05rem; font-weight: 700; color: #f4f4f5; line-height: 1.35;">${content}</h2>`;
    } else if (type === "heading_3") {
      html += `<h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 0.95rem; font-weight: 600; color: #fcd34d; line-height: 1.4;">${content}</h3>`;
    } else if (type === "quote") {
      html += `<blockquote style="border-left: 2px solid #fbbf24; padding-left: 0.875rem; font-style: italic; font-size: 0.8125rem; color: #a1a1aa; margin-top: 1.25rem; margin-bottom: 1.25rem; line-height: 1.65;">${content}</blockquote>`;
    } else if (type === "callout") {
      html += `<div style="padding: 0.875rem; background-color: rgba(39, 39, 42, 0.5); border: 1px solid rgba(63, 63, 70, 0.6); border-radius: 0.75rem; margin-top: 1.25rem; margin-bottom: 1.25rem; font-size: 0.8125rem; color: #e4e4e7; line-height: 1.65;">${content}</div>`;
    } else if (type === "image") {
      const imgUrl = data?.external?.url || data?.file?.url;
      if (imgUrl) {
        html += `<div style="margin-top: 1.25rem; margin-bottom: 1.25rem;"><img src="${imgUrl}" alt="" style="border-radius: 1rem; max-width: 100%; border: 1px solid #27272a;" /></div>`;
      }
    }
  }

  if (inBulletedList) html += "</ul>";
  if (inNumberedList) html += "</ol>";

  return html;
}

function extractCoverImage(page: any, props: any): string {
  if (page.cover) {
    return page.cover.external?.url || page.cover.file?.url || "";
  }
  if (props.Cover?.files?.[0]) {
    return props.Cover.files[0].external?.url || props.Cover.files[0].file?.url || "";
  }
  if (props.Obrázek?.files?.[0]) {
    return props.Obrázek.files[0].external?.url || props.Obrázek.files[0].file?.url || "";
  }
  return "";
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
    const now = new Date().getTime();

    const posts = data.results
      .filter((page: any) => {
        const props = page.properties;
        
        // 1. Kontrola zaškrtnutí "Published"
        const isPublished = props.Published?.checkbox === true || props.Publikováno?.checkbox === true;
        if (!isPublished) return false;

        // 2. Kontrola publikace v 6:30 ráno v daný den
        const dateRaw = props.Date?.date?.start || props.Datum?.date?.start || "";
        if (dateRaw) {
          let publishTime: number;
          if (dateRaw.includes("T")) {
            publishTime = new Date(dateRaw).getTime();
          } else {
            // Nastaví čas publikace na 06:30:00 daného dne
            publishTime = new Date(`${dateRaw}T06:30:00`).getTime();
          }

          if (publishTime > now) {
            return false; // Článek je naplánován do budoucna
          }
        }

        return true;
      })
      .map((page: any) => {
        const props = page.properties;
        const getPropText = (prop: any) => {
          if (!prop) return "";
          if (prop.title && prop.title.length > 0) return prop.title[0].plain_text;
          if (prop.rich_text && prop.rich_text.length > 0) return prop.rich_text[0].plain_text;
          return "";
        };

        const dateRaw = props.Date?.date?.start || props.Datum?.date?.start || "";

        return {
          id: page.id,
          title: getPropText(props.Title) || getPropText(props.Název) || "Bez názvu",
          slug: getPropText(props.Slug) || page.id,
          description: getPropText(props.Perex) || getPropText(props.Popis) || "",
          category: props.Category?.select?.name || props.Kategorie?.select?.name || "ADHD & Čas",
          dateRaw,
          date: dateRaw
            ? new Date(dateRaw).toLocaleDateString("cs-CZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "",
          youtube: props.YouTube?.url || getPropText(props.YouTube) || "",
          spotify: props.Spotify?.url || getPropText(props.Spotify) || "",
          coverImage: extractCoverImage(page, props),
        };
      });

    return posts.sort((a: any, b: any) => {
      const timeA = a.dateRaw ? new Date(a.dateRaw).getTime() : 0;
      const timeB = b.dateRaw ? new Date(b.dateRaw).getTime() : 0;
      return timeB - timeA;
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
      spotify: props.Spotify?.url || getPropText(props.Spotify) || "",
      coverImage: extractCoverImage(page, props),
      contentHtml,
    };
  } catch (error) {
    console.error("Chyba getPostBySlug:", error);
    return null;
  }
}
