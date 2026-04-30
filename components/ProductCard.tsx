import Link from "next/link";
import type { SimpleProduct } from "@/lib/products";
import AddToCartButton from "./AddToCartButton";
import ProductImage from "./ProductImage";

const categoryColors: Record<string, string> = {
  luvas: "bg-blue-100 text-blue-700",
  calcados: "bg-stone-100 text-stone-700",
  oculos: "bg-cyan-100 text-cyan-700",
  couro: "bg-amber-100 text-amber-700",
  mascaras: "bg-green-100 text-green-700",
  capacetes: "bg-orange-100 text-orange-700",
  diversos: "bg-gray-100 text-gray-600",
};

const categoryIcons: Record<string, string> = {
  luvas: "🧤",
  oculos: "🥽",
  couro: "🧥",
  mascaras: "😷",
  capacetes: "⛑️",
  diversos: "📦",
};

export default function ProductCard({ product }: { product: SimpleProduct }) {
  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Imagem ou ícone */}
      <div className="group-hover:scale-105 transition-transform duration-300">
        <ProductImage code={product.code} imageCode={product.imageCode} name={product.name} category={product.category} size="card" />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[product.category] ?? "bg-gray-100 text-gray-600"}`}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
          {product.code && (
            <span className="text-xs text-gray-400 font-mono truncate">{product.code}</span>
          )}
        </div>

        <Link
          href={`/produtos/${product.category}/${product.slug}`}
          className="font-semibold text-gray-900 text-sm leading-snug hover:text-primary transition-colors mb-3 flex-1 line-clamp-3"
        >
          {product.name}
        </Link>

        <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-gray-50">
          <AddToCartButton product={product as any} />
          <Link
            href={`/produtos/${product.category}/${product.slug}`}
            className="text-center text-xs text-primary font-semibold hover:underline"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  );
}
