import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Atendimento from "@/components/Atendimento";
import CatalogView, { type CatalogParams } from "@/components/CatalogView";
import { getAllBrands, getBrandNameBySlug } from "@/lib/products";

export function generateStaticParams() {
  return getAllBrands().map((m) => ({ marca: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ marca: string }> }): Promise<Metadata> {
  const { marca } = await params;
  const nome = getBrandNameBySlug(marca);
  if (!nome) return { title: "Marca" };
  return {
    title: `${nome}`,
    description: `Produtos da marca ${nome} no catálogo da Partum Brasil. Solicite orçamento.`,
    alternates: { canonical: `/marcas/${marca}` },
  };
}

export default async function MarcaPage({
  params,
  searchParams,
}: {
  params: Promise<{ marca: string }>;
  searchParams: Promise<CatalogParams>;
}) {
  const { marca } = await params;
  const sp = await searchParams;
  const nome = getBrandNameBySlug(marca);
  if (!nome) notFound();

  return (
    <>
      <Header />
      <main id="conteudo" className="flex-1 bg-surface">
        <CatalogView
          base={`/marcas/${marca}`}
          fixed={{ marca: nome }}
          params={sp}
          title={nome}
          eyebrow="Marca"
          breadcrumb={[{ label: "Início", href: "/" }, { label: "Marcas", href: "/marcas" }, { label: nome }]}
        />
      </main>
      <Footer />
      <Atendimento />
    </>
  );
}
