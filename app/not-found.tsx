import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="conteudo" className="flex flex-1 items-center bg-surface py-24">
        <div className="container-page max-w-xl text-center">
          <p className="eyebrow justify-center">Erro 404</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">Página não encontrada</h1>
          <p className="mt-3 text-muted">
            O endereço pode ter mudado ou o produto saiu do catálogo. Busque pelo nome, código ou CA.
          </p>
          <form action="/busca" method="get" role="search" className="mx-auto mt-8 flex max-w-md gap-2">
            <label htmlFor="busca-404" className="sr-only">Buscar no catálogo</label>
            <input id="busca-404" name="q" type="search" placeholder="Ex.: luva nitrílica, CA 41562" className="field h-11" />
            <button className="btn-primary h-11">Buscar</button>
          </form>
          <Link href="/" className="btn-link mt-6">Voltar para o início</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
