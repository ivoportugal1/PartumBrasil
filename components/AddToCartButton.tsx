"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { SimpleProduct } from "@/lib/products";

export default function AddToCartButton({ product, large }: { product: SimpleProduct; large?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-2 font-semibold rounded-xl transition-all
        ${large ? "py-3.5 text-base" : "py-2.5 text-sm"}
        ${added
          ? "bg-green-500 text-white"
          : "bg-primary hover:bg-primary-dark text-white shadow hover:shadow-lg"
        }`}
    >
      {added ? (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Adicionado!
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Adicionar ao Carrinho
        </>
      )}
    </button>
  );
}
