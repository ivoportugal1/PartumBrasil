import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/* Robôs de SEO/scraping que varriam o catálogo e estouravam o limite de
   requisições da Vercel. Google e Bing continuam liberados pela regra "*". */
const BLOQUEADOS = [
  "PetalBot",
  "SemrushBot",
  "AhrefsBot",
  "MJ12bot",
  "DotBot",
  "SerpstatBot",
  "SEOkicks",
  "Amazonbot",
  "SerankingBacklinksBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* /busca e URLs com parâmetros (?page=, ?sort=, ?q=…) geram combinações
           infinitas; os produtos chegam ao Google pelo sitemap. */
        disallow: ["/api/", "/carrinho", "/busca", "/*?*"],
      },
      ...BLOQUEADOS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
