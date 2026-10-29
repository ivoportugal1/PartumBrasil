import Link from "next/link";
import { allProducts } from "@/lib/products";
import { IconArrowRight } from "./icons";

/* Lançamentos exibidos na home. ca = número do CA, que também é o nome da
   foto em public/produtos/<ca>.webp e o imageCode do produto no catálogo. */
const NOVIDADES = [
  {
    ca: "45485",
    titulo: "Botina Bidensidade",
    sub: "Com cadarço e bico de PVC",
    detalhe: "Nobuck marrom",
    tags: ["Solado antiderrapante", "Bico de PVC"],
  },
  {
    ca: "49230",
    titulo: "Botina Microfibra",
    sub: "Eletricista 500 V",
    detalhe: "Bico de composite",
    tags: ["Proteção elétrica 500 V", "Palmilha antiperfuro"],
  },
  {
    ca: "45374",
    titulo: "Botina Londrina",
    sub: "Bidensidade com bico de PVC",
    detalhe: "Nobuck marrom",
    tags: ["Solado bidensidade", "Bico de PVC"],
  },
];

export default function Novidades() {
  const itens = NOVIDADES.map((n) => ({
    ...n,
    produto: allProducts.find((p) => p.imageCode === n.ca),
  }));

  return (
    <section id="novidades" className="border-y border-line bg-surface py-20 lg:py-24">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-14">
          <div className="lg:pt-2">
            <p className="eyebrow">Lançamentos</p>
            <h2 className="h-section mt-3">Novas botinas Delta Plus</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-muted">
              Três modelos que chegaram ao catálogo, todos com CA. Consulte numeração e
              disponibilidade com a equipe comercial.
            </p>
            <Link href="/produtos/calcados" className="btn-link mt-6">
              Ver todos os calçados <IconArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {itens.map(({ ca, titulo, sub, detalhe, tags, produto }) => {
              const href = produto ? `/produtos/calcados/${produto.slug}` : "/produtos/calcados";
              return (
                <Link
                  key={ca}
                  href={href}
                  className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-[border-color,box-shadow] hover:border-accent/50 hover:shadow-[0_10px_30px_rgba(11,34,64,0.08)]"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center bg-white p-5">
                    <span className="absolute left-3 top-3 rounded bg-ink px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      Novo
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/produtos/${ca}.webp`}
                      alt={`${titulo} ${sub}, CA ${ca}`}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col border-t border-line p-4">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold uppercase tracking-wider text-primary">Delta Plus</span>
                      <span className="font-mono text-muted">CA {ca}</span>
                    </div>
                    <h3 className="mt-2 font-display text-base font-bold leading-snug text-ink">{titulo}</h3>
                    <p className="mt-0.5 text-sm text-muted">
                      {sub} · {detalhe}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {tags.map((t) => (
                        <li key={t} className="rounded bg-sky px-2 py-0.5 text-[11px] font-medium text-primary">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
