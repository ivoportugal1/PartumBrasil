import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, getCategoryName, getCategoryCount, getBrandsByCategory, categories } from "@/lib/products";

export function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.slug }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<{ q?: string; page?: string; marca?: string }>;
}) {
  const { categoria } = await params;
  const { q = "", page = "1", marca = "" } = await searchParams;

  if (!categories.find((c) => c.slug === categoria)) notFound();

  const currentPage = Math.max(1, parseInt(page));
  const { products, total, totalPages } = getProductsByCategory(categoria, currentPage, q, marca);
  const categoryName = getCategoryName(categoria);
  const brands = getBrandsByCategory(categoria);

  // monta a querystring preservando os filtros ativos
  const qs = (extra: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (marca) sp.set("marca", marca);
    for (const [k, v] of Object.entries(extra)) {
      if (v === undefined || v === "") sp.delete(k);
      else sp.set(k, String(v));
    }
    const s = sp.toString();
    return s ? `?${s}` : "";
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        {/* Header da categoria */}
        <div className="bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-extrabold">{categoryName}</h1>
            <p className="text-white/70 mt-1 text-sm">
              {total} produto{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
              {marca && ` da marca ${marca}`}
              {q && ` para "${q}"`}
            </p>
          </div>
        </div>

        {/* Filtros e pesquisa */}
        <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Categorias */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/produtos/${cat.slug}`}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border
                    ${cat.slug === categoria
                      ? "bg-primary text-white border-primary"
                      : "text-gray-600 border-gray-200 hover:border-primary hover:text-primary bg-white"
                    }`}
                >
                  {cat.name}
                  <span className="ml-1 opacity-60">({getCategoryCount(cat.slug)})</span>
                </Link>
              ))}
            </div>

            {/* Pesquisa */}
            <form method="get" className="flex w-full sm:w-80 shrink-0">
              {marca && <input type="hidden" name="marca" value={marca} />}
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Pesquisar produtos..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button type="submit" className="ml-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                Buscar
              </button>
              {q && (
                <Link href={`/produtos/${categoria}${qs({ q: "" })}`} className="ml-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-600 flex items-center">
                  ✕
                </Link>
              )}
            </form>
          </div>

          {/* Marcas */}
          {brands.length > 0 && (
            <div className="border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 shrink-0 hidden sm:block">
                  Marca
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <Link
                    href={`/produtos/${categoria}${qs({ marca: "", page: "" })}`}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors border
                      ${!marca
                        ? "bg-primary text-white border-primary"
                        : "text-gray-600 border-gray-200 hover:border-primary hover:text-primary bg-white"
                      }`}
                  >
                    Todas
                  </Link>
                  {brands.map((b) => (
                    <Link
                      key={b.name}
                      href={`/produtos/${categoria}${qs({ marca: b.name, page: "" })}`}
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors border
                        ${marca === b.name
                          ? "bg-primary text-white border-primary"
                          : "text-gray-600 border-gray-200 hover:border-primary hover:text-primary bg-white"
                        }`}
                    >
                      {b.name}
                      <span className="ml-1 opacity-60">({b.count})</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-lg font-bold text-gray-900 mb-2">Nenhum produto encontrado</p>
              <p className="text-gray-400 text-sm mb-6">Tente um termo diferente ou veja outra categoria</p>
              <Link href={`/produtos/${categoria}`} className="text-primary font-semibold hover:underline text-sm">
                Limpar filtros
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {currentPage > 1 && (
                    <Link
                      href={`/produtos/${categoria}${qs({ page: currentPage - 1 })}`}
                      className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors bg-white"
                    >
                      ← Anterior
                    </Link>
                  )}

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let p = i + 1;
                    if (totalPages > 7 && currentPage > 4) {
                      p = currentPage - 3 + i;
                    }
                    if (p > totalPages) return null;
                    return (
                      <Link
                        key={p}
                        href={`/produtos/${categoria}${qs({ page: p })}`}
                        className={`w-9 h-9 flex items-center justify-center text-sm rounded-lg border transition-colors
                          ${p === currentPage
                            ? "bg-primary text-white border-primary"
                            : "border-gray-200 hover:border-primary hover:text-primary bg-white"
                          }`}
                      >
                        {p}
                      </Link>
                    );
                  })}

                  {currentPage < totalPages && (
                    <Link
                      href={`/produtos/${categoria}${qs({ page: currentPage + 1 })}`}
                      className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors bg-white"
                    >
                      Próxima →
                    </Link>
                  )}
                </div>
              )}

              <p className="text-center text-xs text-gray-400 mt-4">
                Mostrando {(currentPage - 1) * 24 + 1}–{Math.min(currentPage * 24, total)} de {total} produtos
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
