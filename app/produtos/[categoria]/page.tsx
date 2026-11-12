import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Atendimento from "@/components/Atendimento";
import CatalogView, { type CatalogParams } from "@/components/CatalogView";
import { getCategoryName, getCategoryCount, categories } from "@/lib/products";

export function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }): Promise<Metadata> {
  const { categoria } = await params;
  if (!categories.find((c) => c.slug === categoria)) return {};
  const nome = getCategoryName(categoria);
  return {
    title: `${nome} de proteção`,
    description: `${getCategoryCount(categoria).toLocaleString("pt-BR")} itens de ${nome.toLowerCase()} no catálogo da Partum Brasil. Solicite orçamento para sua empresa.`,
    alternates: { canonical: `/produtos/${categoria}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<CatalogParams>;
}) {
  const { categoria } = await params;
  const sp = await searchParams;
  if (!categories.find((c) => c.slug === categoria)) notFound();
  const nome = getCategoryName(categoria);

  return (
    <>
      <Header />
      <main id="conteudo" className="flex-1 bg-surface">
        <CatalogView
          base={`/produtos/${categoria}`}
          fixed={{ categoria }}
          params={sp}
          title={nome}
          eyebrow="Categoria"
          breadcrumb={[{ label: "Início", href: "/" }, { label: "Produtos", href: "/busca" }, { label: nome }]}
        />
      </main>
      <Footer />
      <Atendimento />
    </>
  );
}
