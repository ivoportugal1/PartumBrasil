import Link from "next/link";
import { categories, getCategoryCount, getCategoryCover, photoKey } from "@/lib/products";
import { IconArrowRight, categoryIcon } from "./icons";

/* Texto curto e factual de cada categoria real do catálogo */
const DESC: Record<string, string> = {
  luvas: "Vaqueta, raspa, nitrílica, látex, pigmentada, anticorte e térmica.",
  calcados: "Botinas, botas de PVC e de couro, com bico de aço ou composite.",
  oculos: "Lentes incolores, escuras e modelos de ampla visão.",
  couro: "Aventais, perneiras, mangotes e acessórios em raspa.",
  mascaras: "Respiradores PFF, semifaciais, filtros e cartuchos.",
  capacetes: "Capacetes, carneiras, jugulares e acessórios.",
  diversos: "Altura, sinalização, abafadores, ferramentas e fardamentos.",
};

export default function Categories() {
  const items = categories.map((c) => ({
    ...c,
    count: getCategoryCount(c.slug),
    cover: getCategoryCover(c.slug),
  }));
  const [first, ...rest] = items;

  return (
    <section id="categorias" className="bg-white py-20 lg:py-24">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow">Catálogo</p>
            <h2 className="h-section mt-3">Linhas de proteção para cada etapa do trabalho</h2>
          </div>
          <Link href="/busca" className="btn-link">
            Ver catálogo completo <IconArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line lg:grid-cols-4">
          {/* Primeira categoria em destaque, ocupando duas linhas no desktop */}
          <CategoryTile item={first} featured />
          {rest.map((c) => (
            <CategoryTile key={c.slug} item={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTile({
  item,
  featured,
}: {
  item: { name: string; slug: string; count: number; cover: ReturnType<typeof getCategoryCover> };
  featured?: boolean;
}) {
  const Icon = categoryIcon[item.slug];
  const img = item.cover ? `/produtos/${photoKey(item.cover)}.webp` : null;
  return (
    <Link
      href={`/produtos/${item.slug}`}
      className={`group relative flex flex-col bg-white p-4 transition-colors hover:bg-sky/60 sm:p-6 ${
        featured ? "col-span-2 lg:col-span-1 lg:row-span-2 lg:p-8" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-sky text-primary">
          {Icon && <Icon size={18} />}
        </span>
        <span className="text-xs tabular-nums text-muted">{item.count.toLocaleString("pt-BR")} itens</span>
      </div>

      <div className={`relative my-4 flex items-center justify-center sm:my-5 ${featured ? "h-36 lg:h-64" : "h-20 sm:h-28"}`}>
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt=""
            loading="lazy"
            className="max-h-full max-w-[80%] object-contain transition-transform duration-300 group-hover:-translate-y-1"
          />
        )}
      </div>

      <h3 className={`font-display font-bold text-ink ${featured ? "text-2xl" : "text-lg"}`}>{item.name}</h3>
      <p className="mt-1.5 hidden text-sm leading-relaxed text-muted sm:block">{DESC[item.slug]}</p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent sm:mt-4">
        Ver produtos
        <IconArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
