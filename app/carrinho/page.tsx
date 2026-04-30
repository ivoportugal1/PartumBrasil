"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, remove, updateQty, clear } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      nome: (form.elements.namedItem("nome") as HTMLInputElement).value,
      empresa: (form.elements.namedItem("empresa") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      whatsapp: (form.elements.namedItem("whatsapp") as HTMLInputElement).value,
      observacoes: (form.elements.namedItem("observacoes") as HTMLTextAreaElement).value,
      items: items.map(({ product, quantity }) => ({
        name: product.name,
        code: product.code,
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
      setSubmitted(true);
    } catch {
      setError("Erro ao enviar. Tente novamente ou entre em contato via WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-surface flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Orçamento enviado!</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Recebemos o seu pedido. Nossa equipe entrará em contato em até 24 horas com os melhores preços.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
            >
              Voltar ao início
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-primary">Início</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Carrinho</span>
          </nav>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-8">
            Meu Carrinho
            {items.length > 0 && (
              <span className="ml-3 text-base font-medium text-gray-400">
                ({items.length} {items.length === 1 ? "item" : "itens"})
              </span>
            )}
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg font-bold text-gray-900 mb-2">Carrinho vazio</p>
              <p className="text-gray-400 mb-6">Adicione produtos para solicitar um orçamento.</p>
              <Link
                href="/#produtos"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
              >
                Ver produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Lista de itens */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-[1fr_auto] text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3 border-b border-gray-100">
                    <span>Produto</span>
                    <span>Quantidade</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-4 px-6 py-4">
                        {/* Imagem */}
                        <div className="relative w-16 h-16 bg-surface rounded-lg shrink-0 overflow-hidden">
                          <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/produtos/${product.categorySlug}/${product.slug}`}
                            className="font-semibold text-gray-900 text-sm hover:text-primary transition-colors line-clamp-2"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5">{product.code}</p>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => updateQty(product.id, quantity - 1)}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors text-lg leading-none"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
                          <button
                            onClick={() => updateQty(product.id, quantity + 1)}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors text-lg leading-none"
                          >
                            +
                          </button>
                          <button
                            onClick={() => remove(product.id)}
                            className="ml-2 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                            aria-label="Remover"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={clear}
                  className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Limpar carrinho
                </button>
              </div>

              {/* Formulário de orçamento */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                  <h2 className="text-lg font-extrabold text-gray-900 mb-1">Solicitar Orçamento</h2>
                  <p className="text-sm text-gray-400 mb-5">
                    Preencha seus dados e enviaremos os preços em até 24h.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome *</label>
                      <input name="nome" type="text" required placeholder="Seu nome completo"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Empresa</label>
                      <input name="empresa" type="text" placeholder="Nome da empresa"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail *</label>
                      <input name="email" type="email" required placeholder="seu@email.com"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp *</label>
                      <input name="whatsapp" type="tel" required placeholder="(11) 99999-9999"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações</label>
                      <textarea name="observacoes" rows={3} placeholder="Quantidade, prazo, especificações..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
                    </div>

                    {/* Resumo dos itens */}
                    <div className="bg-surface rounded-lg p-3 text-xs text-gray-500 space-y-1">
                      <p className="font-semibold text-gray-700 mb-2">Itens do pedido:</p>
                      {items.map(({ product, quantity }) => (
                        <p key={product.id}>· {product.name} × {quantity}</p>
                      ))}
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-lg">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Enviando...
                        </>
                      ) : "Enviar Solicitação"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
