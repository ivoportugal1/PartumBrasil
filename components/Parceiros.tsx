import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { getAllBrands, brandSlug } from "@/lib/products";
import { IconArrowRight } from "./icons";

// logo só entra se o arquivo existir de verdade em public/; senão vira card de texto
const existe = (arquivo: string | null) =>
  !!arquivo && fs.existsSync(path.join(process.cwd(), "public", arquivo));

/* Marcas destacadas na home, na ordem em que aparecem.
   logo = arquivo em public/marcas/. Marca sem logo aparece como texto.
   escuro = logo branco (só existe essa versão): ganha uma placa azul-marinho. */
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
    <section id="marcas" className="bg-white py-20 lg:py-24">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow">Marcas</p>
            <h2 className="h-section mt-3">Fabricantes que fazem parte do nosso catálogo</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Trabalhamos com marcas reconhecidas em segurança do trabalho. Clique em uma
              marca para ver todos os itens dela.
            </p>
          </div>
          <Link href="/marcas" className="btn-link">
            Todas as {marcas.length} marcas <IconArrowRight size={16} />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-5">
          {DESTAQUE.map(({ nome, logo: arquivo, escuro }) => {
            const n = contagem.get(nome) ?? 0;
            const logo = existe(arquivo) ? arquivo : null;
            return (
              <li key={nome} className="border-b border-r border-line">
                <Link
                  href={`/marcas/${brandSlug(nome)}`}
                  className="group flex h-full flex-col items-center justify-center gap-3 px-4 py-8 transition-colors hover:bg-surface"
                >
                  <span
                    className={
                      logo && escuro
                        ? "flex h-14 w-full max-w-[150px] items-center justify-center rounded-md bg-ink px-4"
                        : "flex h-14 items-center justify-center"
                    }
                  >
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logo}
                        alt={nome}
                        loading="lazy"
                        className={`w-auto object-contain transition-[filter,opacity] duration-200 ${
                          escuro ? "h-8 max-w-[110px]" : "h-10 max-w-[130px] opacity-90 grayscale group-hover:opacity-100 group-hover:grayscale-0"
                        }`}
                      />
                    ) : (
                      <span className="font-display text-base font-bold uppercase tracking-wide text-muted group-hover:text-primary">
                        {nome}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted transition-colors group-hover:text-accent">
                    {n} {n === 1 ? "item" : "itens"}
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="border-b border-r border-line">
            <Link
              href="/marcas"
              className="flex h-full flex-col items-center justify-center gap-1 bg-surface px-4 py-8 text-center text-sm font-semibold text-accent transition-colors hover:bg-sky"
            >
              Ver todas as marcas
              <span className="text-xs font-normal text-muted">{marcas.length} no catálogo</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
