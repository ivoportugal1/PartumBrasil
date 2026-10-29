import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CatalogView, { type CatalogParams } from "@/components/CatalogView";

export async function generateMetadata({ searchParams }: { searchParams: Promise<CatalogParams> }): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Busca: ${q}` : "Catálogo completo",
    description: "Busque EPIs e fardamentos por nome, código ou número do CA no catálogo da Partum Brasil.",
    // páginas de resultado não precisam ser indexadas
    robots: q ? { index: false, follow: true } : undefined,
    alternates: { canonical: "/busca" },
  };
}

export default async function BuscaPage({ searchParams }: { searchParams: Promise<CatalogParams> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  return (
    <>
      <Header />
      <main id="conteudo" className="flex-1 bg-surface">
        <CatalogView
          base="/busca"
          fixed={{}}
          params={sp}
          title={q ? `Resultados para “${q}”` : "Catálogo completo"}
          eyebrow={q ? "Busca" : "Produtos"}
          breadcrumb={[{ label: "Início", href: "/" }, { label: q ? "Busca" : "Catálogo" }]}
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
