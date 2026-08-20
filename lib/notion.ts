import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  perex: string;
  date: string;
  category: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  content?: string[];
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const databaseId = process.env.NOTION_DATABASE_ID;

  // Fallback data pro případ, že ještě nemáte nastavené klíče ve Vercelu
  if (!process.env.NOTION_API_KEY || !databaseId) {
    return [
      {
        id: "1",
        title: "Časová slepota u ADHD: Proč běžné minutky v mobilu selhávají",
        slug: "casova-slepota-adhd-proc-minutky-selhavaji",
        perex: "Mozek s ADHD nevnímá abstraktní digitální čísla. Zjistěte, proč vám i vašim dětem pomůže vizuální ubývání hmoty času.",
        date: "2026-02-24",
        category: "Fokus & Čas",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        spotifyUrl: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
        content: [
          "Mnoho lidí s ADHD bojuje s fenoménem zvaným časová slepota (Time Blindness). Čas existuje pouze ve dvou kategoriích: 'TEĎ' a 'JINDY'.",
          "Když se podíváte na digitální časovač '14:56', mozek si nedokáže představit fyzický objem zbývajícího času. Oproti tomu kruhový Time Timer ukazuje ubývání koláče přímo před vašima očima.",
          "V kombinaci s hnědým šumem navíc odfiltrujete neustálé vnitřní myšlenkové odbíhání a usnadníte zahájení práce."
        ]
      },
      {
        id: "2",
        title: "Jak překonat paralýzu úkolů: Metoda 3 mikro-kroků",
        slug: "jak-prekonat-paralyzu-ukolu-mikrokroky",
        perex: "Proč je tak těžké začít uklízet stůl nebo psát e-mail? Jednoduchý návod na oklamání dopaminového deficitu.",
        date: "2026-02-20",
        category: "Produktivita bez viny",
        youtubeUrl: "",
        spotifyUrl: "",
        content: [
          "Exekutivní dysfunkce způsobuje, že i banální úkol (např. vynést koš nebo uklidit stůl) mozek vyhodnotí jako obří nepřekonatelnou horu.",
          "Cílem není dokončit celý úkol najednou, ale udělat první krok tak primitivní, aby k němu mozek necítil žádný odpor.",
          "Vyzkoušejte náš AI Kouskovač přímo v aplikaci ADHDen."
        ]
      }
    ];
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props.Title?.title[0]?.plain_text || "Bez názvu",
        slug: props.Slug?.rich_text[0]?.plain_text || page.id,
        perex: props.Perex?.rich_text[0]?.plain_text || "",
        date: props.Date?.date?.start || new Date().toISOString().split("T")[0],
        category: props.Category?.select?.name || "ADHD Tipy",
        youtubeUrl: props.YouTube?.url || undefined,
        spotifyUrl: props.Spotify?.url || undefined,
      };
    });
  } catch (error) {
    console.error("Chyba při načítání z Notion:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPublishedPosts();
  const found = posts.find((p) => p.slug === slug);
  if (!found) return null;

  if (!process.env.NOTION_API_KEY) {
    return found;
  }

  try {
    const blocks = await notion.blocks.children.list({ block_id: found.id });
    const content: string[] = [];

    for (const block of blocks.results as any[]) {
      if (block.type === "paragraph" && block.paragraph?.rich_text?.length > 0) {
        content.push(block.paragraph.rich_text.map((t: any) => t.plain_text).join(""));
      } else if (block.type === "heading_2" && block.heading_2?.rich_text?.length > 0) {
        content.push(`## ${block.heading_2.rich_text.map((t: any) => t.plain_text).join("")}`);
      }
    }

    return { ...found, content: content.length > 0 ? content : found.content };
  } catch (e) {
    return found;
  }
}
