import Link from "next/link";
import Image from "next/image";
import { getAllBrands, brandSlug } from "@/lib/products";

/* Marcas destacadas na home, na ordem em que aparecem.
   logo = arquivo em public/marcas/. Quando não houver logo,
   o card mostra o nome da marca em texto. */
const DESTAQUE: { nome: string; logo: string | null }[] = [
  { nome: "Kalipso", logo: "/marcas/kalipso.svg" },
  { nome: "Kadesh", logo: "/marcas/kadesh.png" },
  { nome: "Volk", logo: "/marcas/volk.png" },
  { nome: "3M", logo: "/marcas/3m.png" },
  { nome: "MSA", logo: "/marcas/msa.png" },
  { nome: "Rhino", logo: "/marcas/rhino.png" },
  { nome: "Camper", logo: null },
  { nome: "Ultra Master", logo: "/marcas/ultra-master.png" },
  { nome: "Steelflex", logo: null },
];

export default function Parceiros() {
  const contagem = new Map(getAllBrands().map((b) => [b.name, b.count]));
  const totalMarcas = getAllBrands().length;

  return (
    <section id="parceiros" className="relative overflow-hidden bg-primary-dark">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 300px at 20% 0%, rgba(91,155,245,0.18), transparent 70%)",
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {DESTAQUE.map(({ nome, logo }) => {
            const n = contagem.get(nome) ?? 0;
            return (
              <Link
                key={nome}
                href={`/marcas/${brandSlug(nome)}`}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-light/55 hover:bg-white/[0.08]"
              >
                {logo ? (
                  <Image
                    src={logo}
                    alt={nome}
                    width={200}
                    height={60}
                    unoptimized
                    className="h-[34px] w-auto max-w-[132px] object-contain opacity-80 brightness-0 invert transition group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0"
                  />
                ) : (
                  <span className="h-[34px] flex items-center text-[15px] font-bold tracking-wide text-white/55 uppercase">
                    {nome}
                  </span>
                )}
                <span className="text-[11px] text-white/45 transition-colors group-hover:text-accent-light">
                  {n} produto{n !== 1 ? "s" : ""}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/marcas"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-light hover:underline"
          >
            Ver todas as {totalMarcas} marcas do catálogo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
