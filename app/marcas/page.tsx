import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getAllBrands } from "@/lib/products";

export const metadata = {
  title: "Marcas | Partum Brasil",
  description: "Todas as marcas de EPI disponíveis no catálogo da Partum Brasil.",
};

export default function MarcasPage() {
  const marcas = getAllBrands();
  const total = marcas.reduce((s, m) => s + m.count, 0);

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-extrabold">Marcas</h1>
            <p className="text-white/70 mt-1 text-sm">
              {marcas.length} marcas, {total.toLocaleString("pt-BR")} produtos no catálogo
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {marcas.map((m) => (
              <Link
                key={m.slug}
                href={`/marcas/${m.slug}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm transition-all hover:border-primary/25 hover:shadow-md"
              >
                <span className="font-semibold text-gray-900 text-sm truncate">{m.name}</span>
                <span className="shrink-0 text-xs text-gray-400">{m.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
