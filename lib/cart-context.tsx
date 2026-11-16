"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { SimpleProduct } from "./products";

export type CartItem = {
  product: SimpleProduct;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  add: (product: SimpleProduct) => void;
  remove: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

/* A lista de orçamento fica no localStorage do navegador. Ela é lida com
   useSyncExternalStore: no servidor (e durante a hidratação) a lista começa
   vazia, e no navegador passa a mostrar o que está salvo, sem setState dentro
   de useEffect. */
const STORAGE_KEY = "partum-cart";
const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();
let cache: CartItem[] | null = null;

function readCart(): CartItem[] {
  if (cache) return cache;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    cache = saved ? (JSON.parse(saved) as CartItem[]) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function writeCart(next: CartItem[]) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getServerSnapshot = () => EMPTY;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, readCart, getServerSnapshot);

  function add(product: SimpleProduct) {
    const prev = readCart();
    const existing = prev.find((i) => i.product.id === product.id);
    writeCart(
      existing
        ? prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { product, quantity: 1 }],
    );
  }

  function remove(productId: string) {
    writeCart(readCart().filter((i) => i.product.id !== productId));
  }

  function updateQty(productId: string, quantity: number) {
    if (quantity < 1) return remove(productId);
    writeCart(readCart().map((i) => (i.product.id === productId ? { ...i, quantity } : i)));
  }

  function clear() {
    writeCart([]);
  }

  return (
    <CartContext.Provider
      value={{ items, add, remove, updateQty, clear, total: items.length }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
