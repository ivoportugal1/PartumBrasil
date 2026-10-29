import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "./icons";
import { SITE } from "@/lib/site";
import { getCatalogStats } from "@/lib/products";

/* Abertura institucional. A foto é da campanha da Partum (fardamento e
   capacete com a marca). A faixa usa a proporção da arte (2200x944) em telas
   grandes para nunca cortar o rosto do profissional. */
export default function Hero() {
  const { products, brands } = getCatalogStats();

  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-ink text-white">
      <div className="relative lg:aspect-[2200/944] lg:max-h-[720px] lg:w-full">
        {/* No celular a foto vem em cima (rosto visível) e o texto abaixo */}
        <div className="relative h-72 sm:h-96 lg:absolute lg:inset-0 lg:h-auto">
          <Image
            src="/hero.jpg"
            alt="Profissional com fardamento e capacete Partum Brasil"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[18%_top] lg:object-left-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-ink/40 lg:to-ink/85" />
        </div>

        <div className="relative pb-12 pt-2 lg:absolute lg:inset-0 lg:flex lg:items-center lg:p-0">
          <div className="container-page">
            <div className="reveal max-w-xl lg:ml-auto lg:mr-4 xl:mr-10">
              <p className="eyebrow !text-accent-light">EPIs e fardamentos profissionais</p>
              <h1 className="mt-4 font-display text-[2.25rem] font-bold leading-[1.05] tracking-tight sm:text-5xl xl:text-[3.5rem]">
                Proteção para quem faz a indústria acontecer.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
                Equipamentos de proteção individual e fardamentos para empresas que precisam de
                segurança, CA válido e atendimento direto com a equipe comercial.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/#contato" className="btn-primary h-12 px-6 text-[15px]">
                  Solicitar orçamento <IconArrowRight size={18} />
                </Link>
                <Link href="/#categorias" className="btn-ghost-dark h-12 px-6 text-[15px]">
                  Explorar produtos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dados verificáveis do próprio catálogo, sem números de efeito */}
      <div className="border-t border-white/10 bg-[#071a33]">
        <dl className="container-page grid grid-cols-1 divide-y divide-white/10 text-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Fact term="Catálogo" value={`${products.toLocaleString("pt-BR")} itens para orçamento`} />
          <Fact term="Marcas" value={`${brands} fabricantes de EPI e ferramentas`} />
          <Fact term="Atendimento" value={`Camaçari (BA), desde ${SITE.since}`} />
        </dl>
      </div>
    </section>
  );
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 py-4 sm:px-6 sm:first:pl-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-light">{term}</dt>
      <dd className="text-white/85">{value}</dd>
    </div>
  );
}
