import Link from "next/link";
import { SITE } from "@/lib/site";
import { getCatalogStats } from "@/lib/products";
import { IconSearch, IconClipboard, IconMail, IconShieldCheck, IconBuilding, IconArrowRight } from "./icons";

/* "A empresa" + "Como funciona o orçamento". Só informações verificáveis:
   ano de fundação, localização, tamanho real do catálogo e o fluxo do site. */
export default function Sobre() {
  const { products, brands } = getCatalogStats();
  const passos = [
    {
      icon: IconSearch,
      titulo: "Encontre os itens",
      texto: "Busque por nome, código ou número do CA, ou navegue pelas categorias e marcas.",
    },
    {
      icon: IconClipboard,
      titulo: "Monte a lista de orçamento",
      texto: "Adicione os produtos e as quantidades. A lista fica salva neste navegador.",
    },
    {
      icon: IconMail,
      titulo: "Receba a proposta",
      texto: "Envie a lista com seus dados. A equipe comercial retorna por e-mail ou WhatsApp.",
    },
  ];

  return (
    <section id="sobre" className="bg-white py-20 lg:py-24">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow">A empresa</p>
          <h2 className="h-section mt-3">Uma distribuidora de EPIs organizada para atender empresas</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-muted">
            <p>
              A Partum Brasil fornece equipamentos de proteção individual e fardamentos
              profissionais desde {SITE.since}, a partir de Camaçari (BA). Reunimos em um só
              catálogo os itens de {brands} fabricantes, do calçado de segurança ao respirador,
              para que o comprador resolva a reposição de EPIs da equipe em um único pedido.
            </p>
            <p>
              Cada página de produto traz o código e, quando informado pelo fabricante, o número
              do Certificado de Aprovação (CA). Tamanhos, cores e prazos são confirmados pela
              equipe comercial no orçamento.
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
            <Info icon={IconBuilding} term="Sede" value={`${SITE.address.city}`} />
            <Info icon={IconShieldCheck} term="Itens no catálogo" value={products.toLocaleString("pt-BR")} />
          </dl>
        </div>

        <div className="lg:pt-10">
          <h3 className="font-display text-xl font-bold text-ink">Como funciona o orçamento</h3>
          <ol className="mt-6 space-y-0">
            {passos.map((p, i) => (
              <li key={p.titulo} className="relative flex gap-5 pb-8 last:pb-0">
                {i < passos.length - 1 && (
                  <span className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px bg-line" aria-hidden="true" />
                )}
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-white text-accent">
                  <p.icon size={18} />
                </span>
                <div className="pt-1">
                  <p className="text-xs font-semibold text-muted">Passo {i + 1}</p>
                  <p className="mt-0.5 font-semibold text-ink">{p.titulo}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/busca" className="btn-primary">
              Buscar no catálogo <IconArrowRight size={16} />
            </Link>
            <Link href="/carrinho" className="btn-secondary">Ver minha lista</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ icon: Icon, term, value }: { icon: (p: { size?: number }) => React.ReactElement; term: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-white px-5 py-4">
      <span className="text-primary"><Icon size={18} /></span>
      <div>
        <dt className="text-xs text-muted">{term}</dt>
        <dd className="text-sm font-semibold text-ink">{value}</dd>
      </div>
    </div>
  );
}
