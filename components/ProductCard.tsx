import Link from "next/link";
import type { SimpleProduct } from "@/lib/products";
import AddToCartButton from "./AddToCartButton";
import ProductImage from "./ProductImage";
import { isFotoIlustrativa } from "@/lib/foto-ilustrativa";

/* Card de catálogo: imagem neutra, marca, código, nome e ação de orçamento.
   `brand` vem resolvida pelo servidor (mesma lógica de todo o catálogo). */
export default function ProductCard({ product, brand }: { product: SimpleProduct; brand?: string | null }) {
  const href = `/produtos/${product.category}/${product.slug}`;
  const ca = product.name.match(/C\.?\s?A\.?\s*:?\s*([\d.]{3,7})/i)?.[1]?.replace(/\./g, "");
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-accent/50 hover:shadow-[0_8px_24px_rgba(11,34,64,0.08)]">
      <Link href={href} className="relative block border-b border-line" tabIndex={-1} aria-hidden="true">
        <ProductImage code={product.code} imageCode={product.imageCode} name={product.name} category={product.category} size="card" />
        {isFotoIlustrativa(product.imageCode, product.code) && (
          <span className="absolute bottom-2 left-2 rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted ring-1 ring-line">
            Cor ilustrativa
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="truncate font-semibold uppercase tracking-wider text-primary">{brand ?? " "}</span>
          {ca && <span className="shrink-0 rounded bg-sky px-1.5 py-0.5 font-semibold text-primary">CA {ca}</span>}
        </div>
        <h3 className="mt-1.5 flex-1 text-[13.5px] font-medium leading-snug text-ink">
          <Link href={href} className="line-clamp-3 hover:text-accent">
            <span className="absolute inset-0 z-0" aria-hidden="true" />
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 truncate font-mono text-[11px] text-muted">Cód. {product.code}</p>
        <div className="relative z-10 mt-3">
          <AddToCartButton product={product} variant="subtle" />
        </div>
      </div>
    </article>
  );
}
