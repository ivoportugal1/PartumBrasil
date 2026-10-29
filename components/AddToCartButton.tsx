"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { SimpleProduct } from "@/lib/products";
import { IconPlus, IconCheck } from "./icons";

/* Adiciona o produto à lista de orçamento (salva no navegador). */
export default function AddToCartButton({
  product,
  large,
  variant = "primary",
}: {
  product: SimpleProduct;
  large?: boolean;
  variant?: "primary" | "subtle";
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const base = large ? "h-12 w-full text-[15px]" : "h-9 w-full text-[13px]";
  const look =
    variant === "subtle"
      ? added
        ? "border border-accent bg-sky text-accent-dark"
        : "border border-line bg-white text-ink hover:border-accent hover:text-accent"
      : added
        ? "bg-accent-dark text-white"
        : "bg-accent text-white hover:bg-accent-dark";

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-live="polite"
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors ${base} ${look}`}
    >
      {added ? (
        <>
          <IconCheck size={large ? 18 : 15} /> {large ? "Adicionado à lista" : "Adicionado"}
        </>
      ) : (
        <>
          <IconPlus size={large ? 18 : 15} />{" "}
          {large ? "Adicionar à lista de orçamento" : (<><span className="sm:hidden">Orçamento</span><span className="hidden sm:inline">Adicionar ao orçamento</span></>)}
        </>
      )}
    </button>
  );
}
