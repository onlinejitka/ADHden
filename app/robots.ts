import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
          "Googlebot",
          "SeznamBot",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://www.adhden.cz/sitemap.xml",
  };
}
