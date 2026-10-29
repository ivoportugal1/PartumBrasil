import fs from "node:fs";
import path from "node:path";
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

export const ITEMS_PER_PAGE = 24;

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
  "Steelflex", "Super Safety", "Thompson", "Tramontina", "Ultra Master",
  "Valeplast",
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

/* O catálogo já traz a marca em boa parte dos itens. Quando vier vazia,
   caímos na detecção pelo nome. */
const brandById = new Map<string, string>();
for (const p of allProducts) {
  const b = p.brand?.trim() || detectBrand(p.name);
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

export type SortKey = "relevancia" | "foto" | "az" | "za";

/* Fotos reais disponíveis em public/produtos (lidas uma vez). Serve para
   ordenar "com foto primeiro" e escolher a imagem de capa das categorias. */
const PHOTO_SET: Set<string> = (() => {
  try {
    const dir = path.join(process.cwd(), "public", "produtos");
    return new Set(fs.readdirSync(dir).map((f) => f.replace(/\.(webp|jpe?g|png)$/i, "")));
  } catch {
    return new Set();
  }
})();

export const photoKey = (p: SimpleProduct) => (p.imageCode || p.code).replace(/[^a-zA-Z0-9_-]/g, "");
export const hasPhoto = (p: SimpleProduct) => PHOTO_SET.has(photoKey(p));

const deburrQ = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/* Busca por nome ou código. Cada palavra digitada precisa aparecer no nome
   (sem acento) ou no código, então "luva nitrilica 9" funciona. */
function matches(p: SimpleProduct, q: string) {
  const terms = deburrQ(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const hay = deburrQ(p.name) + " " + p.code.toLowerCase() + " " + (brandById.get(p.id) ?? "").toLowerCase();
  return terms.every((t) => hay.includes(t));
}

function sortProducts(list: SimpleProduct[], sort: SortKey) {
  if (sort === "az") return [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  if (sort === "za") return [...list].sort((a, b) => b.name.localeCompare(a.name, "pt-BR"));
  if (sort === "foto") return [...list].sort((a, b) => Number(hasPhoto(b)) - Number(hasPhoto(a)));
  return list;
}

export function queryProducts(opts: {
  categoria?: string;
  marca?: string;
  q?: string;
  sort?: SortKey;
  page?: number;
}): { products: SimpleProduct[]; total: number; totalPages: number; page: number } {
  const { categoria = "", marca = "", q = "", sort = "relevancia" } = opts;
  let filtered = allProducts;
  if (categoria) filtered = filtered.filter((p) => p.category === categoria);
  if (marca) filtered = filtered.filter((p) => brandById.get(p.id) === marca);
  if (q.trim()) filtered = filtered.filter((p) => matches(p, q));
  filtered = sortProducts(filtered, sort);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const page = Math.min(Math.max(1, opts.page || 1), totalPages);
  const start = (page - 1) * ITEMS_PER_PAGE;
  return { products: filtered.slice(start, start + ITEMS_PER_PAGE), total, totalPages, page };
}

/* Contagem de categorias para um conjunto filtrado (usada na busca global) */
export function countByCategory(q: string, marca = ""): Map<string, number> {
  const m = new Map<string, number>();
  for (const p of allProducts) {
    if (marca && brandById.get(p.id) !== marca) continue;
    if (q.trim() && !matches(p, q)) continue;
    m.set(p.category, (m.get(p.category) ?? 0) + 1);
  }
  return m;
}

/* Produto com foto real para ilustrar a categoria. Preferência por itens
   com foto e por um termo que represente bem a categoria. */
const COVER_HINT: Record<string, RegExp> = {
  luvas: /luva.*(nitril|vaqueta|pigment)/i,
  calcados: /botina|bota/i,
  oculos: /oculos|óculos/i,
  couro: /avental|perneira|raspa/i,
  mascaras: /respirador|pff/i,
  capacetes: /capacete/i,
  diversos: /cinto|talabarte|protetor auricular|abafador/i,
};
export function getCategoryCover(slug: string): SimpleProduct | null {
  const pool = allProducts.filter((p) => p.category === slug && hasPhoto(p));
  const hint = COVER_HINT[slug];
  return (hint && pool.find((p) => hint.test(p.name))) || pool[0] || null;
}

export function getProductsByCategory(slug: string, page = 1, search = "", brand = "") {
  return queryProducts({ categoria: slug, marca: brand, q: search, page });
}

export function getRelatedProducts(product: SimpleProduct, limit = 5): SimpleProduct[] {
  const brand = brandById.get(product.id);
  const same = allProducts.filter((p) => p.id !== product.id && p.category === product.category);
  const byBrand = brand ? same.filter((p) => brandById.get(p.id) === brand) : [];
  const out: SimpleProduct[] = [];
  const seen = new Set<string>([photoKey(product)]);
  for (const p of [...byBrand.filter(hasPhoto), ...same.filter(hasPhoto), ...byBrand, ...same]) {
    const k = photoKey(p);
    if (seen.has(k)) continue; // evita repetir o mesmo item em outro tamanho
    seen.add(k);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export function getCatalogStats() {
  return { products: allProducts.length, brands: new Set(brandById.values()).size };
}

export function searchProducts(query: string, limit = 30): SimpleProduct[] {
  if (!query.trim()) return [];
  return allProducts.filter((p) => matches(p, query)).slice(0, limit);
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

/* ---------------- Páginas de marca ---------------- */

export const brandSlug = (name: string) =>
  deburr(name).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const brandBySlug = new Map<string, string>();
for (const b of brandById.values()) brandBySlug.set(brandSlug(b), b);

export function getAllBrands(): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const b of brandById.values()) counts.set(b, (counts.get(b) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: brandSlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getBrandNameBySlug(slug: string): string | null {
  return brandBySlug.get(slug) ?? null;
}

export function getCategoriesOfBrand(brand: string): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of allProducts) {
    if (brandById.get(p.id) !== brand) continue;
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, name: getCategoryName(slug), count }))
    .sort((a, b) => b.count - a.count);
}

export function getProductsByBrand(
  brand: string,
  page = 1,
  search = "",
  categoria = ""
): { products: SimpleProduct[]; total: number; totalPages: number } {
  let filtered = allProducts.filter((p) => brandById.get(p.id) === brand);

  if (categoria.trim()) filtered = filtered.filter((p) => p.category === categoria);

  if (search.trim()) filtered = filtered.filter((p) => matches(p, search));

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  return { products: filtered.slice(start, start + ITEMS_PER_PAGE), total, totalPages };
}

/* Facetas para os filtros: categorias e marcas disponíveis no recorte atual
   (cada faceta ignora o próprio filtro, para o usuário poder trocar). */
export function getFacets(opts: { categoria?: string; marca?: string; q?: string }) {
  const { categoria = "", marca = "", q = "" } = opts;
  const cats = new Map<string, number>();
  const brands = new Map<string, number>();
  for (const p of allProducts) {
    if (q.trim() && !matches(p, q)) continue;
    const b = brandById.get(p.id);
    if (!marca || b === marca) cats.set(p.category, (cats.get(p.category) ?? 0) + 1);
    if ((!categoria || p.category === categoria) && b) brands.set(b, (brands.get(b) ?? 0) + 1);
  }
  return {
    categories: categories
      .map((c) => ({ ...c, count: cats.get(c.slug) ?? 0 }))
      .filter((c) => c.count > 0),
    brands: [...brands.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
  };
}

export function brandOf(p: SimpleProduct): string | null {
  return brandById.get(p.id) ?? null;
}
