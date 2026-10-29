import Link from "next/link";
import ProductCard from "./ProductCard";
import {
  queryProducts,
  getFacets,
  brandOf,
  getCategoryName,
  ITEMS_PER_PAGE,
  type SortKey,
} from "@/lib/products";
import { IconSearch, IconX, IconChevronLeft, IconChevronRight, IconFilter, IconPackage, categoryIcon } from "./icons";

export type CatalogParams = {
  q?: string;
  marca?: string;
  categoria?: string;
  ordem?: string;
  page?: string;
};

const SORTS: { key: SortKey; label: string }[] = [
  { key: "relevancia", label: "Relevância" },
  { key: "foto", label: "Com foto primeiro" },
  { key: "az", label: "Nome A–Z" },
  { key: "za", label: "Nome Z–A" },
];

/* Listagem única do catálogo, usada pela categoria, pela marca e pela busca.
   Tudo funciona por URL (links e GET), então filtros, ordenação e paginação
   podem ser compartilhados e indexados, e funcionam sem JavaScript. */
export default function CatalogView({
  base,
  fixed,
  params,
  title,
  eyebrow,
  breadcrumb,
}: {
  base: string; // ex.: /produtos/luvas, /marcas/kalipso, /busca
  fixed: { categoria?: string; marca?: string };
  params: CatalogParams;
  title: string;
  eyebrow?: string;
  breadcrumb: { label: string; href?: string }[];
}) {
  const q = (params.q ?? "").trim();
  const categoria = fixed.categoria ?? params.categoria ?? "";
  const marca = fixed.marca ?? params.marca ?? "";
  const ordem = (SORTS.some((s) => s.key === params.ordem) ? params.ordem : "relevancia") as SortKey;
  const page = Math.max(1, parseInt(params.page ?? "1") || 1);

  const result = queryProducts({ categoria, marca, q, sort: ordem, page });
  const facets = getFacets({ categoria, marca, q });

  // monta a querystring a partir do estado atual, sobrescrevendo o que vier em `extra`
  const href = (extra: Partial<Record<"q" | "marca" | "categoria" | "ordem" | "page", string | number>>) => {
    const sp = new URLSearchParams();
    const state: Record<string, string> = {
      q,
      marca: fixed.marca ? "" : marca,
      categoria: fixed.categoria ? "" : categoria,
      ordem: ordem === "relevancia" ? "" : ordem,
    };
    for (const [k, v] of Object.entries({ ...state, ...extra })) {
      const s = String(v ?? "");
      if (s && !(k === "page" && s === "1")) sp.set(k, s);
    }
    const s = sp.toString();
    return s ? `${base}?${s}` : base;
  };

  const chips: { label: string; remove: string }[] = [];
  if (q) chips.push({ label: `“${q}”`, remove: href({ q: "", page: "" }) });
  if (!fixed.categoria && categoria) chips.push({ label: getCategoryName(categoria), remove: href({ categoria: "", page: "" }) });
  if (!fixed.marca && marca) chips.push({ label: marca, remove: href({ marca: "", page: "" }) });

  const from = result.total ? (result.page - 1) * ITEMS_PER_PAGE + 1 : 0;
  const to = Math.min(result.page * ITEMS_PER_PAGE, result.total);

  const filters = (
    <FilterPanel
      base={base}
      fixed={fixed}
      q={q}
      categoria={categoria}
      marca={marca}
      facets={facets}
      href={href}
    />
  );

  return (
    <>
      {/* Cabeçalho da página */}
      <div className="border-b border-line bg-white">
        <div className="container-page py-8 lg:py-10">
          <nav aria-label="Trilha" className="text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              {breadcrumb.map((b, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {i > 0 && <IconChevronRight size={12} className="text-line" />}
                  {b.href ? <Link href={b.href} className="hover:text-accent">{b.label}</Link> : <span className="text-graphite">{b.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
          {eyebrow && <p className="eyebrow mt-5">{eyebrow}</p>}
          <h1 className={`font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl ${eyebrow ? "mt-2" : "mt-4"}`}>{title}</h1>
          <p className="mt-2 text-sm text-muted">
            {result.total.toLocaleString("pt-BR")} {result.total === 1 ? "item" : "itens"}
            {q && <> para “{q}”</>}
          </p>
        </div>
      </div>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:py-10">
        {/* Filtros: barra lateral no desktop, painel recolhível no mobile */}
        <aside className="hidden lg:block" aria-label="Filtros">{filters}</aside>

        <div className="min-w-0">
          <details className="mb-4 rounded-[var(--radius-card)] border border-line bg-white lg:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-ink">
              <IconFilter size={16} /> Filtrar e buscar
              {chips.length > 0 && <span className="ml-auto rounded bg-sky px-1.5 text-xs text-accent-dark">{chips.length}</span>}
            </summary>
            <div className="border-t border-line p-4">{filters}</div>
          </details>

          {/* Barra de ordenação e filtros ativos */}
          <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {chips.length > 0 ? (
                <>
                  {chips.map((c) => (
                    <Link key={c.label} href={c.remove} className="chip-on" aria-label={`Remover filtro ${c.label}`}>
                      {c.label} <IconX size={13} />
                    </Link>
                  ))}
                  <Link href={base} className="text-xs font-medium text-muted underline-offset-2 hover:text-accent hover:underline">
                    Limpar filtros
                  </Link>
                </>
              ) : (
                <p className="text-sm text-muted">
                  {result.total > 0 ? <>Mostrando {from}–{to} de {result.total.toLocaleString("pt-BR")}</> : "Nenhum item"}
                </p>
              )}
            </div>
            <nav aria-label="Ordenar" className="flex items-center gap-1 overflow-x-auto">
              <span className="mr-1 shrink-0 text-xs text-muted">Ordenar:</span>
              {SORTS.map((s) => (
                <Link
                  key={s.key}
                  href={href({ ordem: s.key === "relevancia" ? "" : s.key, page: "" })}
                  aria-current={ordem === s.key ? "true" : undefined}
                  className={ordem === s.key ? "chip-on" : "chip-off"}
                >
                  {s.label}
                </Link>
              ))}
            </nav>
          </div>

          {result.products.length === 0 ? (
            <div className="mt-6 flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-line bg-white px-6 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted">
                <IconPackage size={22} />
              </span>
              <p className="mt-4 font-display text-lg font-bold text-ink">Nenhum produto encontrado</p>
              <p className="mt-1 max-w-sm text-sm text-muted">
                Confira a grafia, busque pelo código ou pelo número do CA, ou remova algum filtro.
                Se não achar, a equipe comercial verifica para você.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href={base} className="btn-secondary">Limpar filtros</Link>
                <Link href="/#contato" className="btn-primary">Falar com a equipe</Link>
              </div>
            </div>
          ) : (
            <>
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                {result.products.map((p) => (
                  <li key={p.id} className="flex">
                    <div className="flex w-full"><ProductCard product={p} brand={brandOf(p)} /></div>
                  </li>
                ))}
              </ul>
              <Pagination page={result.page} totalPages={result.totalPages} href={(n) => href({ page: n })} />
              <p className="mt-4 text-center text-xs text-muted">
                Mostrando {from}–{to} de {result.total.toLocaleString("pt-BR")} itens
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function FilterPanel({
  base,
  fixed,
  q,
  categoria,
  marca,
  facets,
  href,
}: {
  base: string;
  fixed: { categoria?: string; marca?: string };
  q: string;
  categoria: string;
  marca: string;
  facets: ReturnType<typeof getFacets>;
  href: (extra: Record<string, string | number>) => string;
}) {
  const topBrands = facets.brands.slice(0, 10);
  const moreBrands = facets.brands.slice(10);
  return (
    <div className="space-y-7">
      <form method="get" action={base} role="search">
        <label htmlFor={`busca-${base}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Buscar
        </label>
        {!fixed.marca && marca && <input type="hidden" name="marca" value={marca} />}
        {!fixed.categoria && categoria && <input type="hidden" name="categoria" value={categoria} />}
        <div className="relative mt-2">
          <IconSearch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id={`busca-${base}`}
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Nome, código ou CA"
            className="field h-10 pl-9"
          />
        </div>
      </form>

      <FacetGroup title={fixed.categoria ? "Outras categorias" : "Categoria"}>
        {fixed.categoria
          ? facets.categories.map((c) => (
              <FacetLink key={c.slug} href={`/produtos/${c.slug}`} active={c.slug === categoria} count={c.count} icon={c.slug}>
                {c.name}
              </FacetLink>
            ))
          : facets.categories.map((c) => (
              <FacetLink
                key={c.slug}
                href={href({ categoria: categoria === c.slug ? "" : c.slug, page: "" })}
                active={categoria === c.slug}
                count={c.count}
                icon={c.slug}
              >
                {c.name}
              </FacetLink>
            ))}
      </FacetGroup>

      {!fixed.marca && facets.brands.length > 0 && (
        <FacetGroup title="Marca">
          {topBrands.map((b) => (
            <FacetLink key={b.name} href={href({ marca: marca === b.name ? "" : b.name, page: "" })} active={marca === b.name} count={b.count}>
              {b.name}
            </FacetLink>
          ))}
          {moreBrands.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer list-none px-2 py-1.5 text-xs font-semibold text-accent hover:text-accent-dark">
                <span className="group-open:hidden">Mais {moreBrands.length} marcas</span>
                <span className="hidden group-open:inline">Mostrar menos</span>
              </summary>
              {moreBrands.map((b) => (
                <FacetLink key={b.name} href={href({ marca: marca === b.name ? "" : b.name, page: "" })} active={marca === b.name} count={b.count}>
                  {b.name}
                </FacetLink>
              ))}
            </details>
          )}
        </FacetGroup>
      )}
    </div>
  );
}

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
      <div className="mt-2 space-y-0.5">{children}</div>
    </div>
  );
}

function FacetLink({
  href,
  active,
  count,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  count: number;
  icon?: string;
  children: React.ReactNode;
}) {
  const Icon = icon ? categoryIcon[icon] : null;
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors ${
        active ? "bg-sky font-semibold text-accent-dark" : "text-graphite hover:bg-surface hover:text-accent"
      }`}
    >
      {Icon && <Icon size={16} className={active ? "text-accent" : "text-muted"} />}
      <span className="flex-1 truncate">{children}</span>
      <span className="text-xs tabular-nums text-muted">{count.toLocaleString("pt-BR")}</span>
    </Link>
  );
}

function Pagination({ page, totalPages, href }: { page: number; totalPages: number; href: (n: number) => string }) {
  if (totalPages <= 1) return null;
  // janela de páginas com reticências: 1 … 4 5 6 … 20
  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const list = [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  list.forEach((n, i) => {
    if (i > 0 && n - list[i - 1] > 1) items.push("gap");
    items.push(n);
  });
  const cell = "flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm transition-colors";
  return (
    <nav aria-label="Paginação" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${cell} border-line bg-white hover:border-accent hover:text-accent`} aria-label="Página anterior">
          <IconChevronLeft size={16} />
        </Link>
      ) : null}
      {items.map((it, i) =>
        it === "gap" ? (
          <span key={`g${i}`} className="px-1 text-muted">…</span>
        ) : (
          <Link
            key={it}
            href={href(it)}
            aria-current={it === page ? "page" : undefined}
            className={`${cell} ${it === page ? "border-accent bg-accent font-semibold text-white" : "border-line bg-white hover:border-accent hover:text-accent"}`}
          >
            {it}
          </Link>
        )
      )}
      {page < totalPages ? (
        <Link href={href(page + 1)} className={`${cell} border-line bg-white hover:border-accent hover:text-accent`} aria-label="Próxima página">
          <IconChevronRight size={16} />
        </Link>
      ) : null}
    </nav>
  );
}
