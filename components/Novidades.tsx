import Link from "next/link";
import { allProducts } from "@/lib/products";

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
    sub: "Eletricista 500V",
    detalhe: "Bico de composite",
    tags: ["Proteção elétrica 500V", "Palmilha antiperfuro"],
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
    <section id="novidades" className="relative overflow-hidden bg-surface">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(800px 300px at 85% 0%, rgba(42,109,217,0.12), transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="w-7 h-0.5 rounded-full bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Chegou na loja
          </span>
        </div>
        <h2 className="text-primary-dark text-3xl lg:text-4xl font-extrabold leading-tight max-w-2xl">
          Novidades em botinas de segurança
        </h2>
        <p className="mt-2 mb-9 text-gray-500 text-base max-w-xl">
          Três lançamentos Delta Plus, todos com CA válido, já disponíveis para orçamento.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {itens.map(({ ca, titulo, sub, detalhe, tags, produto }) => {
            const href = produto ? `/produtos/calcados/${produto.slug}` : "/produtos/calcados";
            return (
              <Link
                key={ca}
                href={href}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-accent/40"
              >
                <span className="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Novo
                </span>

                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary-dark sm:h-72">
                  <div
                    className="absolute inset-0 opacity-90"
                    style={{
                      background:
                        "radial-gradient(260px 200px at 65% 40%, rgba(91,155,245,0.45), transparent 70%)",
                    }}
                  />
                  <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />
                  <div className="absolute -right-2 -top-2 h-28 w-28 rounded-full border border-white/10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/produtos/${ca}.webp`}
                    alt={`${titulo} ${sub} CA ${ca}`}
                    loading="lazy"
                    className="relative z-10 h-[88%] w-auto object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                      Delta Plus
                    </span>
                    <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-bold text-primary ring-1 ring-primary/10">
                      CA {ca}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold leading-tight text-primary-dark">{titulo}</h3>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {sub} · {detalhe}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-5 inline-flex items-center gap-2 pt-1 text-sm font-semibold text-accent">
                    Ver produto
                    <svg
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
