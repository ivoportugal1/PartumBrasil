import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Atendimento from "@/components/Atendimento";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { getProductBySlug, getCategoryName, getRelatedProducts, brandOf, brandSlug, hasPhoto, photoKey } from "@/lib/products";
import { isFotoIlustrativa } from "@/lib/foto-ilustrativa";
import { SITE, whatsappLink } from "@/lib/site";
import { IconChevronRight, IconWhatsApp, IconInfo, IconPhone, IconMail, IconShieldCheck } from "@/components/icons";

export const dynamic = "force-dynamic";

/* CA escrito no nome do produto (ex.: "CA 41562", "C.A 13.779") */
function extractCA(name: string) {
  return name.match(/C\.?\s?A\.?\s*:?\s*([\d.]{3,7})/i)?.[1]?.replace(/\./g, "") ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string; slug: string }> }): Promise<Metadata> {
  const { slug, categoria } = await params;
  const p = getProductBySlug(slug);
  if (!p || p.category !== categoria) return {};
  const marca = brandOf(p);
  const ca = extractCA(p.name);
  const desc = [
    p.name,
    marca ? `Marca ${marca}.` : "",
    ca ? `CA ${ca}.` : "",
    `Código ${p.code}. Solicite orçamento na Partum Brasil.`,
  ].filter(Boolean).join(" ");
  const img = hasPhoto(p) ? `/produtos/${photoKey(p)}.webp` : undefined;
  return {
    title: p.name,
    description: desc,
    alternates: { canonical: `/produtos/${categoria}/${slug}` },
    openGraph: { title: p.name, description: desc, images: img ? [{ url: img }] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ categoria: string; slug: string }> }) {
  const { categoria, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.category !== categoria) notFound();

  const marca = brandOf(product);
  const ca = extractCA(product.name);
  const categoriaNome = getCategoryName(categoria);
  const ilustrativa = isFotoIlustrativa(product.imageCode, product.code);
  const related = getRelatedProducts(product, 4);
  const url = `${SITE.url}/produtos/${categoria}/${slug}`;

  const msg = [
    "Olá! Gostaria de um orçamento deste produto:",
    product.name,
    `Código: ${product.code}`,
    marca ? `Marca: ${marca}` : "",
    url,
  ].filter(Boolean).join("\n");

  return (
    <>
      <Header />
      <main id="conteudo" className="flex-1 bg-surface">
        <div className="container-page py-6 lg:py-8">
          <nav aria-label="Trilha" className="text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-accent">Início</Link></li>
              <li className="flex items-center gap-1.5"><IconChevronRight size={12} className="text-line" /><Link href={`/produtos/${categoria}`} className="hover:text-accent">{categoriaNome}</Link></li>
              <li className="flex min-w-0 items-center gap-1.5"><IconChevronRight size={12} className="text-line" /><span className="line-clamp-1 text-graphite">{product.name}</span></li>
            </ol>
          </nav>

          <div className="mt-5 grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-white lg:grid-cols-2">
            {/* Imagem */}
            <div className="border-b border-line lg:border-b-0 lg:border-r">
              <ProductImage code={product.code} imageCode={product.imageCode} name={product.name} category={product.category} size="large" />
              {ilustrativa && (
                <p className="mx-5 mb-5 flex items-start gap-2 rounded-md bg-sky px-3.5 py-2.5 text-xs leading-relaxed text-primary">
                  <IconInfo size={16} className="mt-px shrink-0" />
                  <span>
                    <strong className="font-semibold">Cor ilustrativa.</strong> A foto mostra o mesmo modelo em outra cor.
                    Confirme a cor disponível com a equipe antes de fechar o pedido.
                  </span>
                </p>
              )}
            </div>

            {/* Dados e ações */}
            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {marca && (
                  <Link href={`/marcas/${brandSlug(marca)}`} className="font-semibold uppercase tracking-wider text-primary hover:text-accent">
                    {marca}
                  </Link>
                )}
                {marca && <span className="text-line">|</span>}
                <Link href={`/produtos/${categoria}`} className="text-muted hover:text-accent">{categoriaNome}</Link>
              </div>

              <h1 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-[1.75rem]">
                {product.name}
              </h1>

              {ca && (
                <p className="mt-4 inline-flex w-fit items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-sm text-ink">
                  <IconShieldCheck size={16} className="text-accent" />
                  Certificado de Aprovação <strong className="font-semibold">CA {ca}</strong>
                </p>
              )}

              <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
                <Row term="Código" value={<span className="font-mono">{product.code}</span>} />
                {marca && <Row term="Marca" value={marca} />}
                <Row term="Categoria" value={categoriaNome} />
                {ca && (
                  <Row
                    term="CA"
                    value={
                      <a href={`https://consultaca.com/${ca}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        {ca} — consultar validade
                      </a>
                    }
                  />
                )}
                <Row term="Tamanhos, cores e prazo" value={<span className="text-muted">Confirmados pela equipe comercial no orçamento</span>} />
              </dl>

              <div className="mt-8 space-y-3">
                <AddToCartButton product={product} large />
                <a href={whatsappLink(msg)} target="_blank" rel="noopener noreferrer" className="btn-secondary h-12 w-full text-[15px]">
                  <IconWhatsApp size={18} /> Consultar pelo WhatsApp
                </a>
                <p className="text-center text-xs text-muted">
                  Preço sob consulta. A mensagem do WhatsApp já vai com o nome, o código e o link deste produto.
                </p>
              </div>

              <div className="mt-auto grid gap-2 pt-8 text-sm text-muted sm:grid-cols-2">
                <a href={SITE.phone.href} className="inline-flex items-center gap-2 hover:text-accent"><IconPhone size={16} /> {SITE.phone.label}</a>
                <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 break-all hover:text-accent"><IconMail size={16} /> {SITE.email}</a>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-14" aria-labelledby="relacionados">
              <div className="flex items-end justify-between gap-4">
                <h2 id="relacionados" className="font-display text-xl font-bold text-ink">
                  {marca ? `Mais de ${marca} em ${categoriaNome.toLowerCase()}` : `Mais em ${categoriaNome.toLowerCase()}`}
                </h2>
                <Link href={marca ? `/marcas/${brandSlug(marca)}` : `/produtos/${categoria}`} className="btn-link shrink-0">Ver todos</Link>
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {related.map((p) => (
                  <li key={p.id} className="flex"><div className="flex w-full"><ProductCard product={p} brand={brandOf(p)} /></div></li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <Atendimento />
    </>
  );
}

function Row({ term, value }: { term: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 py-3">
      <dt className="text-muted">{term}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
