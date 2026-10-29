import type { MetadataRoute } from "next";
import { allProducts, categories, getAllBrands } from "@/lib/products";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/busca`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/marcas`, changeFrequency: "monthly", priority: 0.6 },
    ...categories.map((c) => ({ url: `${base}/produtos/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...getAllBrands().map((b) => ({ url: `${base}/marcas/${b.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...allProducts.map((p) => ({ url: `${base}/produtos/${p.category}/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}
