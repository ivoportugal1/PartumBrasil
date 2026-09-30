import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { getAllBrands, brandSlug } from "@/lib/products";

// logo só entra se o arquivo existir de verdade em public/; senão vira card de texto
const existe = (arquivo: string | null) =>
  !!arquivo && fs.existsSync(path.join(process.cwd(), "public", arquivo));

/* Marcas destacadas na home, na ordem em que aparecem.
   logo = arquivo em public/marcas/. Marca sem logo aparece
   como card de texto, funcionando igual.
   escuro = logo branco (só existe essa versão): ganha uma placa azul-marinho atrás. */
const DESTAQUE: { nome: string; logo: string | null; escuro?: boolean }[] = [
  { nome: "Kalipso", logo: "/marcas/kalipso.svg" },
  { nome: "Kadesh", logo: "/marcas/kadesh.png" },
  { nome: "Volk", logo: "/marcas/volk.png", escuro: true },
  { nome: "3M", logo: "/marcas/3m.png" },
  { nome: "MSA", logo: "/marcas/msa.png" },
  { nome: "Rhino", logo: "/marcas/rhino.png" },
  { nome: "Camper", logo: "/marcas/camper.svg" },
  { nome: "Ultra Master", logo: "/marcas/ultra-master.png", escuro: true },
  { nome: "Steelflex", logo: "/marcas/steelflex.png" },
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
          Muito além de fornecedores. Parceiros.
        </h2>
        <p className="mt-2 mb-10 text-white/60 text-base max-w-xl">
          Trabalhamos lado a lado com marcas que acreditam na capacitação e no desenvolvimento de quem está na linha de frente.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {DESTAQUE.map(({ nome, logo: arquivo, escuro }) => {
            const n = contagem.get(nome) ?? 0;
            const logo = existe(arquivo) ? arquivo : null;
            return (
              <Link
                key={nome}
                href={`/marcas/${brandSlug(nome)}`}
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-4 py-7 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-accent/40"
              >
                <div
                  className={
                    logo && escuro
                      ? "h-[64px] w-full flex items-center justify-center rounded-xl px-4 shadow-inner ring-1 ring-white/10 bg-[radial-gradient(120px_70px_at_20%_0%,rgba(91,155,245,0.35),transparent_70%),linear-gradient(135deg,#0d2e63,#071c40)]"
                      : "h-[64px] flex items-center justify-center"
                  }
                >
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo}
                      alt={nome}
                      loading="lazy"
                      className={`w-auto object-contain ${escuro ? "h-[40px] max-w-[110px]" : "h-[42px] max-w-[140px]"}`}
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
