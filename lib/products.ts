import rawProducts from "./products-data.json";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  code: string;
  brand: string;
  ca: string;
  description: string;
  features: string[];
  image: string;
  badge?: string;
};

export type SimpleProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  code: string;
  imageCode?: string;
  brand?: string;
};

export const categories = [
  { name: "Luvas", slug: "luvas" },
  { name: "Calçados", slug: "calcados" },
  { name: "Óculos", slug: "oculos" },
  { name: "Couro", slug: "couro" },
  { name: "Máscaras", slug: "mascaras" },
  { name: "Capacetes", slug: "capacetes" },
  { name: "Diversos", slug: "diversos" },
];

export const allProducts: SimpleProduct[] = (rawProducts as { id: string; code: string; name: string; category: string; slug: string; imageCode?: string; brand?: string }[]).map((p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  code: p.code,
  imageCode: p.imageCode,
  brand: p.brand,
}));

const ITEMS_PER_PAGE = 24;

export function getProductsByCategory(slug: string, page = 1, search = "", brand = ""): {
  products: SimpleProduct[];
  total: number;
  totalPages: number;
} {
  let filtered = allProducts.filter((p) => p.category === slug);

  if (brand.trim()) {
    filtered = filtered.filter((p) => p.brand === brand);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const products = filtered.slice(start, start + ITEMS_PER_PAGE);

  return { products, total, totalPages };
}

export function searchProducts(query: string, limit = 30): SimpleProduct[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return allProducts
    .filter((p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
    .slice(0, limit);
}

export function getProductBySlug(slug: string): SimpleProduct | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getCategoryName(slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

export function getCategoryCount(slug: string): number {
  return allProducts.filter((p) => p.category === slug).length;
}

export function getBrandsByCategory(slug: string): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of allProducts) {
    if (p.category === slug && p.brand) {
      counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
