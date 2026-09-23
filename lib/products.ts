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

export const allProducts: SimpleProduct[] = (rawProducts as { id: string; code: string; name: string; category: string; slug: string; imageCode?: string }[]).map((p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  code: p.code,
  imageCode: p.imageCode,
}));

const ITEMS_PER_PAGE = 24;

/* ---------------- Marcas ----------------
   O catálogo não tem campo de marca, ela vem escrita dentro do nome do
   produto. A lista abaixo é casada com o nome (palavra inteira, sem acento)
   e o resultado fica em cache logo no carregamento do módulo. */
const BRAND_LIST = [
  "AgroIndustria", "Air Safety", "Athenas", "Ayrton", "Bellga", "Bracol",
  "Brasil", "Camper", "Carbografite", "Cartom", "Crival", "Danny",
  "Delta Plus", "Doptex", "Dystray", "Estival", "Extremo Sul",
  "Ferreira Mold", "Fortline", "Fujiwara", "Gedore", "Idol", "Innpro",
  "Kadesh", "Kala", "Kalipso", "Ledan", "Libus", "Maicol", "Mapa",
  "Marluvas", "MSA", "Mucambo", "Norton", "Nove54", "Nutriex", "Partum",
  "Plastcor", "Promat", "Protecap", "Rhino", "Soft Works", "Solida",
  "Steelflex", "Super Safety", "Thompson", "Tramontina", "Valeplast",
  "Vicsa", "Vicunha", "Volk", "Vonder", "Vulcaflex", "Worker", "Zanel",
  "3M",
];

const deburr = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const BRAND_MATCHERS = BRAND_LIST
  // marcas com nome mais longo primeiro, pra "Super Safety" ganhar de "Safety"
  .slice()
  .sort((a, b) => b.length - a.length)
  .map((brand) => ({
    brand,
    regex: new RegExp(
      `(^|[^a-z0-9])${deburr(brand).replace(/\s+/g, "\\s+")}([^a-z0-9]|$)`
    ),
  }));

function detectBrand(name: string): string | null {
  const n = deburr(name);
  for (const { brand, regex } of BRAND_MATCHERS) {
    if (regex.test(n)) return brand;
  }
  return null;
}

const brandById = new Map<string, string>();
for (const p of allProducts) {
  const b = detectBrand(p.name);
  if (b) brandById.set(p.id, b);
}

export function getProductBrand(product: SimpleProduct): string | null {
  return brandById.get(product.id) ?? null;
}

export function getBrandsByCategory(slug: string): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of allProducts) {
    if (p.category !== slug) continue;
    const b = brandById.get(p.id);
    if (!b) continue;
    counts.set(b, (counts.get(b) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getProductsByCategory(slug: string, page = 1, search = "", brand = ""): {
  products: SimpleProduct[];
  total: number;
  totalPages: number;
} {
  let filtered = allProducts.filter((p) => p.category === slug);

  if (brand.trim()) {
    filtered = filtered.filter((p) => brandById.get(p.id) === brand);
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
