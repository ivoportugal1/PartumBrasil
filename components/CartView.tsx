"use client";

import { useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/lib/cart-context";
import { SITE, whatsappLink } from "@/lib/site";
import { IconCheck, IconClipboard, IconLoader, IconMinus, IconPlus, IconTrash, IconWhatsApp, IconArrowRight } from "@/components/icons";

/* Lista de orçamento. Os itens ficam no navegador (localStorage) e o pedido
   segue para /api/orcamento, que envia o e-mail para a equipe comercial. */
export default function CartView() {
  const { items, remove, updateQty, clear } = useCart();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const f = new FormData(e.currentTarget);
    const data = {
      nome: String(f.get("nome") ?? "").trim(),
      empresa: String(f.get("empresa") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      whatsapp: String(f.get("whatsapp") ?? "").trim(),
      observacoes: String(f.get("observacoes") ?? "").trim(),
      items: items.map(({ product, quantity }) => ({
        name: product.name,
        brand: product.brand || "-",
        ca: product.code,
        quantity,
      })),
    };
    try {
      const res = await fetch("/api/orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      clear();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const resumoWhats = [
    "Olá! Gostaria de um orçamento destes itens:",
    ...items.map(({ product, quantity }) => `• ${quantity}x ${product.name} (cód. ${product.code})`),
  ].join("\n");

  return (
    <main id="conteudo" className="flex-1 bg-surface">
        <div className="border-b border-line bg-white">
          <div className="container-page py-8">
            <nav aria-label="Trilha" className="text-xs text-muted">
              <Link href="/" className="hover:text-accent">Início</Link> <span className="mx-1 text-line">/</span>
              <span className="text-graphite">Lista de orçamento</span>
            </nav>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink">Lista de orçamento</h1>
            <p className="mt-2 text-sm text-muted">
              {items.length > 0
                ? `${items.length} ${items.length === 1 ? "produto" : "produtos"} na lista`
                : "Adicione produtos do catálogo para pedir uma proposta."}
            </p>
          </div>
        </div>

        <div className="container-page py-10">
          {status === "sent" ? (
            <div className="mx-auto max-w-lg rounded-[var(--radius-card)] border border-line bg-white p-10 text-center" role="status">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky text-accent"><IconCheck size={24} /></span>
              <h2 className="mt-4 font-display text-2xl font-bold text-ink">Pedido de orçamento enviado</h2>
              <p className="mt-2 text-muted">Recebemos sua lista. A equipe comercial vai responder pelo e-mail ou WhatsApp informado.</p>
              <Link href="/busca" className="btn-primary mt-6">Voltar ao catálogo</Link>
            </div>
          ) : items.length === 0 ? (
            <div className="mx-auto flex max-w-lg flex-col items-center rounded-[var(--radius-card)] border border-dashed border-line bg-white px-6 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted"><IconClipboard size={22} /></span>
              <p className="mt-4 font-display text-lg font-bold text-ink">Sua lista está vazia</p>
              <p className="mt-1 text-sm text-muted">Use “Adicionar ao orçamento” nos produtos do catálogo.</p>
              <Link href="/busca" className="btn-primary mt-6">Explorar produtos <IconArrowRight size={16} /></Link>
            </div>
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div>
                <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
                  {items.map(({ product, quantity }) => (
                    <li key={product.id} className="flex items-center gap-4 p-4">
                      <div className="w-20 shrink-0 overflow-hidden rounded-md border border-line">
                        <ProductImage code={product.code} imageCode={product.imageCode} name={product.name} category={product.category} size="card" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/produtos/${product.category}/${product.slug}`} className="line-clamp-2 text-sm font-medium text-ink hover:text-accent">
                          {product.name}
                        </Link>
                        <p className="mt-0.5 font-mono text-xs text-muted">Cód. {product.code}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1" role="group" aria-label={`Quantidade de ${product.name}`}>
                        <button onClick={() => updateQty(product.id, quantity - 1)} className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-graphite hover:border-accent hover:text-accent" aria-label="Diminuir">
                          <IconMinus size={15} />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold tabular-nums" aria-live="polite">{quantity}</span>
                        <button onClick={() => updateQty(product.id, quantity + 1)} className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-graphite hover:border-accent hover:text-accent" aria-label="Aumentar">
                          <IconPlus size={15} />
                        </button>
                        <button onClick={() => remove(product.id)} className="ml-1 flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-red-600" aria-label="Remover da lista">
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button onClick={clear} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-red-600">
                    <IconTrash size={15} /> Esvaziar lista
                  </button>
                  <Link href="/busca" className="btn-link">Adicionar mais produtos <IconArrowRight size={15} /></Link>
                </div>
              </div>

              <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 lg:sticky lg:top-24">
                <h2 className="font-display text-lg font-bold text-ink">Enviar para a equipe comercial</h2>
                <p className="mt-1 text-sm text-muted">Informe seus dados para receber a proposta.</p>
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="c-nome" className="label">Nome <span className="text-accent">*</span></label>
                    <input id="c-nome" name="nome" type="text" required autoComplete="name" className="field" />
                  </div>
                  <div>
                    <label htmlFor="c-empresa" className="label">Empresa</label>
                    <input id="c-empresa" name="empresa" type="text" autoComplete="organization" className="field" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div>
                      <label htmlFor="c-email" className="label">E-mail <span className="text-accent">*</span></label>
                      <input id="c-email" name="email" type="email" required autoComplete="email" className="field" />
                    </div>
                    <div>
                      <label htmlFor="c-whats" className="label">WhatsApp <span className="text-accent">*</span></label>
                      <input id="c-whats" name="whatsapp" type="tel" required autoComplete="tel" placeholder="(71) 99999-9999" className="field" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-obs" className="label">Observações</label>
                    <textarea id="c-obs" name="observacoes" rows={3} placeholder="Tamanhos, cores, prazo de entrega…" className="field resize-y" />
                  </div>
                  <div aria-live="polite">
                    {status === "error" && (
                      <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        Não foi possível enviar agora. Tente de novo ou mande a lista pelo WhatsApp.
                      </p>
                    )}
                  </div>
                  <button type="submit" disabled={status === "sending"} className="btn-primary h-12 w-full">
                    {status === "sending" ? (<><IconLoader size={18} /> Enviando…</>) : "Enviar pedido de orçamento"}
                  </button>
                  <a href={whatsappLink(resumoWhats)} target="_blank" rel="noopener noreferrer" className="btn-secondary h-11 w-full">
                    <IconWhatsApp size={17} /> Enviar a lista pelo WhatsApp
                  </a>
                  <p className="text-center text-xs text-muted">WhatsApp comercial: {SITE.whatsapp.label}</p>
                </form>
              </div>
            </div>
          )}
        </div>
    </main>
  );
}
