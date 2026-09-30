import Link from "next/link";
import Image from "next/image";
import { getAllBrands, brandSlug } from "@/lib/products";

/* Marcas destacadas na home, na ordem em que aparecem.
   logo = arquivo em public/marcas/. Marca sem logo aparece
   como card de texto, funcionando igual. */
const DESTAQUE: { nome: string; logo: string | null }[] = [
  { nome: "Kalipso", logo: "/marcas/kalipso.svg" },
  { nome: "Kadesh", logo: "/marcas/kadesh.png" },
  { nome: "Volk", logo: null },
  { nome: "3M", logo: "/marcas/3m.png" },
  { nome: "MSA", logo: "/marcas/msa.png" },
  { nome: "Rhino", logo: "/marcas/rhino.png" },
  { nome: "Camper", logo: null },
  { nome: "Ultra Master", logo: null },
  { nome: "Steelflex", logo: null },
];

export default function Parceiros() {
  const marcas = getAllBrands();
  const contagem = new Map(marcas.map((b) => [b.name, b.count]));

  return (
    <section id="parceiros" className="relative overflow-hidden bg-primary-dark">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 320px at 18% 0%, rgba(91,155,245,0.20), transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="w-7 h-0.5 rounded-full bg-accent-light" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-light">
            Nossos parceiros
          </span>
        </div>

        <h2 className="text-white text-3xl lg:text-4xl font-extrabold leading-tight max-w-2xl">
          Trabalhamos com as maiores marcas do mercado
        </h2>
        <p className="mt-2 mb-10 text-white/60 text-base max-w-xl">
          Equipamentos certificados, com CA válido, das fabricantes que o mercado já conhece.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {DESTAQUE.map(({ nome, logo }) => {
            const n = contagem.get(nome) ?? 0;
            return (
              <Link
                key={nome}
                href={`/marcas/${brandSlug(nome)}`}
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-4 py-7 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-accent/40"
              >
                <div className="h-[42px] flex items-center justify-center">
                  {logo ? (
                    <Image
                      src={logo}
                      alt={nome}
                      width={220}
                      height={70}
                      unoptimized
                      className="max-h-[42px] w-auto max-w-[140px] object-contain"
                    />
                  ) : (
                    <span className="text-base font-bold uppercase tracking-wide text-gray-400 transition-colors group-hover:text-primary">
                      {nome}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-gray-400 transition-colors group-hover:text-primary">
                  {n} produto{n !== 1 ? "s" : ""}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-9 text-center">
          <Link
            href="/marcas"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-light hover:underline"
          >
            Ver todas as {marcas.length} marcas do catálogo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
