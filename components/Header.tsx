import { categories, getCategoryCount, getCatalogStats } from "@/lib/products";
import HeaderClient from "./HeaderClient";

/* Wrapper de servidor: calcula as contagens reais do catálogo e entrega
   ao cabeçalho interativo (assim o JSON do catálogo não vai para o navegador). */
export default function Header() {
  const cats = categories.map((c) => ({ ...c, count: getCategoryCount(c.slug) }));
  return <HeaderClient categories={cats} stats={getCatalogStats()} />;
}
