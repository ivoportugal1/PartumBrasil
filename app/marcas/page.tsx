import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Atendimento from "@/components/Atendimento";
import { getAllBrands } from "@/lib/products";
import { IconChevronRight } from "@/components/icons";

export const metadata = {
  title: "Marcas",
  description: "Fabricantes de EPI, fardamento e ferramentas disponíveis no catálogo da Partum Brasil.",
  alternates: { canonical: "/marcas" },
};

/* Logo oficial, se existir em public/marcas (svg ou png). Logos só brancos
   ficam sobre placa azul-marinho. */
const BRANCOS = new Set(["volk", "ultra-master"]);
function logoDe(slug: string): string | null {
  for (const ext of ["svg", "png"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", "marcas", `${slug}.${ext}`))) return `/marcas/${slug}.${ext}`;
  }
  return null;
}

export default function MarcasPage() {
  const marcas = getAllBrands().map((m) => ({ ...m, logo: logoDe(m.slug) }));
  const comLogo = marcas.filter((m) => m.logo);
  const semLogo = marcas.filter((m) => !m.logo);
  const total = marcas.reduce((s, m) => s + m.count, 0);

  return (
    <>
      <Header />
      <main id="conteudo" className="flex-1 bg-surface">
        <div className="border-b border-line bg-white">
          <div className="container-page py-10">
            <nav aria-label="Trilha" className="text-xs text-muted">
              <Link href="/" className="hover:text-accent">Início</Link> <span className="mx-1 text-line">/</span> <span className="text-graphite">Marcas</span>
            </nav>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Marcas</h1>
            <p className="mt-2 text-sm text-muted">
              {marcas.length} fabricantes, {total.toLocaleString("pt-BR")} itens identificados por marca
            </p>
          </div>
        </div>

        <div className="container-page py-10">
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
            {comLogo.map((m) => (
              <li key={m.slug}>
                <Link href={`/marcas/${m.slug}`} className="group flex h-full flex-col items-center justify-center gap-3 bg-white px-4 py-8 hover:bg-sky/50">
                  <span className={BRANCOS.has(m.slug) ? "flex h-14 items-center rounded-md bg-ink px-4" : "flex h-14 items-center"}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.logo!} alt={m.name} loading="lazy" className="h-9 max-w-[130px] w-auto object-contain" />
                  </span>
                  <span className="text-xs text-muted group-hover:text-accent">{m.count} itens</span>
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Todas as marcas</h2>
          <ul className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[...comLogo, ...semLogo]
              .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
              .map((m) => (
                <li key={m.slug}>
                  <Link href={`/marcas/${m.slug}`} className="group flex items-center justify-between gap-2 bg-white px-4 py-3.5 text-sm hover:bg-sky/50">
                    <span className="truncate font-medium text-ink group-hover:text-accent">{m.name}</span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      {m.count} <IconChevronRight size={14} className="text-line group-hover:text-accent" />
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </main>
      <Footer />
      <Atendimento />
    </>
  );
}
