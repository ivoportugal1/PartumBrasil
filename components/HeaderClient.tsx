"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { SITE } from "@/lib/site";
import {
  IconChevronDown,
  IconClipboard,
  IconMail,
  IconMenu,
  IconPhone,
  IconSearch,
  IconX,
  IconArrowRight,
  IconChevronRight,
  categoryIcon,
} from "./icons";

type Cat = { name: string; slug: string; count: number };

export default function HeaderClient({
  categories,
  stats,
}: {
  categories: Cat[];
  stats: { products: number; brands: number };
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { total } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fecha menus ao trocar de página
  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setSearchOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  function submitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
    router.push(q ? `/busca?q=${encodeURIComponent(q)}` : "/busca");
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const inProdutos = pathname.startsWith("/produtos") || pathname.startsWith("/busca");

  return (
    <header className="sticky top-0 z-50">
      {/* Faixa de contato: some no scroll para liberar espaço */}
      <div
        className={`hidden bg-[#071a33] text-white/70 transition-[height,opacity] duration-200 md:block ${
          scrolled ? "h-0 opacity-0 overflow-hidden" : "h-9 opacity-100"
        }`}
      >
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <p>Distribuidora de EPIs e fardamentos em Camaçari (BA) desde {SITE.since}</p>
          <div className="flex items-center gap-5">
            <a href={SITE.phone.href} className="inline-flex items-center gap-1.5 hover:text-white">
              <IconPhone size={13} /> {SITE.phone.label}
            </a>
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
              <IconMail size={13} /> {SITE.email}
            </a>
          </div>
        </div>
      </div>

      <div
        className={`bg-ink text-white transition-shadow duration-200 ${
          scrolled ? "shadow-[0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(4,16,34,0.25)]" : ""
        }`}
      >
        <div className={`container-page flex items-center gap-6 transition-[height] duration-200 ${scrolled ? "h-16" : "h-[4.5rem]"}`}>
          <Link href="/" className="shrink-0" aria-label="Partum Brasil — página inicial">
            <Image
              src="/logopartum-clean.png"
              alt="Partum Brasil"
              width={3014}
              height={1574}
              priority
              className={`w-auto transition-[height] duration-200 ${scrolled ? "h-9" : "h-11"}`}
            />
          </Link>

          {/* Navegação desktop */}
          <nav aria-label="Principal" className="hidden h-full items-center lg:flex">
            <NavLink href="/" active={isActive("/")}>Início</NavLink>

            <div ref={megaRef} className="relative h-full">
              <button
                type="button"
                onClick={() => setMegaOpen((v) => !v)}
                aria-expanded={megaOpen}
                aria-controls="menu-produtos"
                className={`relative flex h-full items-center gap-1 px-3.5 text-sm font-medium transition-colors hover:text-white ${
                  inProdutos || megaOpen ? "text-white" : "text-white/75"
                }`}
              >
                Produtos
                <IconChevronDown size={15} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />
                {inProdutos && <ActiveBar />}
              </button>

              {megaOpen && (
                <div
                  id="menu-produtos"
                  className="absolute left-0 top-full w-[560px] border border-line bg-white text-graphite shadow-[0_18px_40px_rgba(11,34,64,0.18)]"
                >
                  <div className="grid grid-cols-2 gap-px bg-line">
                    {categories.map((c) => {
                      const Icon = categoryIcon[c.slug];
                      return (
                        <Link
                          key={c.slug}
                          href={`/produtos/${c.slug}`}
                          className="group flex items-center gap-3 bg-white px-4 py-3.5 transition-colors hover:bg-sky"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-surface text-primary group-hover:bg-white">
                            {Icon && <Icon size={18} />}
                          </span>
                          <span className="flex-1">
                            <span className="block text-sm font-semibold text-ink">{c.name}</span>
                            <span className="block text-xs text-muted">{c.count.toLocaleString("pt-BR")} itens</span>
                          </span>
                          <IconChevronRight size={16} className="text-line transition-colors group-hover:text-accent" />
                        </Link>
                      );
                    })}
                    <Link
                      href="/busca"
                      className="group flex items-center justify-between gap-3 bg-surface px-4 py-3.5 text-sm font-semibold text-accent hover:bg-sky"
                    >
                      Catálogo completo
                      <span className="text-xs font-normal text-muted">{stats.products.toLocaleString("pt-BR")} itens</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink href="/marcas" active={isActive("/marcas")}>Marcas</NavLink>
            <NavLink href="/#sobre" active={false}>A empresa</NavLink>
            <NavLink href="/#contato" active={false}>Contato</NavLink>
          </nav>

          {/* Busca desktop */}
          <form onSubmit={submitSearch} role="search" className="ml-auto hidden w-full max-w-xs xl:block">
            <label htmlFor="busca-header" className="sr-only">Buscar no catálogo</label>
            <div className="relative">
              <IconSearch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                id="busca-header"
                name="q"
                type="search"
                placeholder="Buscar por produto, código ou CA"
                className="h-10 w-full rounded-md border border-white/15 bg-white/[0.06] pl-9 pr-3 text-sm text-white placeholder:text-white/45 focus:border-accent-light focus:bg-white/10 focus:outline-none"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1.5 xl:ml-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white xl:hidden"
              aria-label="Buscar"
              aria-expanded={searchOpen}
            >
              <IconSearch />
            </button>

            <Link
              href="/carrinho"
              className="relative flex h-10 items-center gap-2 rounded-md px-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              aria-label={`Lista de orçamento${total ? `, ${total} itens` : ""}`}
            >
              <IconClipboard />
              <span className="hidden font-medium sm:inline">Orçamento</span>
              {total > 0 && (
                <span className="min-w-5 rounded-full bg-accent px-1.5 text-center text-[11px] font-bold leading-5 text-white">
                  {total > 99 ? "99+" : total}
                </span>
              )}
            </Link>

            <Link href="/#contato" className="btn-primary ml-1 hidden xl:inline-flex">
              Solicitar orçamento
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 lg:hidden"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
            >
              <IconMenu />
            </button>
          </div>
        </div>

        {/* Busca expandida (mobile e telas médias) */}
        {searchOpen && (
          <div className="border-t border-white/10 xl:hidden">
            <form onSubmit={submitSearch} role="search" className="container-page py-3">
              <label htmlFor="busca-mobile" className="sr-only">Buscar no catálogo</label>
              <div className="relative">
                <IconSearch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="busca-mobile"
                  name="q"
                  type="search"
                  autoFocus
                  placeholder="Buscar por produto, código ou CA"
                  className="field h-11 pl-9"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Menu mobile em painel lateral */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="absolute inset-0 bg-ink/50" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <span className="font-display text-base font-bold text-ink">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-md text-graphite hover:bg-surface"
                aria-label="Fechar menu"
              >
                <IconX />
              </button>
            </div>
            <nav aria-label="Menu móvel" className="flex-1 overflow-y-auto px-3 py-4">
              <MobileLink href="/">Início</MobileLink>
              <p className="px-3 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Produtos</p>
              {categories.map((c) => {
                const Icon = categoryIcon[c.slug];
                return (
                  <Link
                    key={c.slug}
                    href={`/produtos/${c.slug}`}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-graphite hover:bg-surface"
                  >
                    {Icon && <Icon size={18} className="text-primary" />}
                    <span className="flex-1">{c.name}</span>
                    <span className="text-xs text-muted">{c.count.toLocaleString("pt-BR")}</span>
                  </Link>
                );
              })}
              <div className="my-3 border-t border-line" />
              <MobileLink href="/busca">Catálogo completo</MobileLink>
              <MobileLink href="/marcas">Marcas</MobileLink>
              <MobileLink href="/#sobre">A empresa</MobileLink>
              <MobileLink href="/#contato">Contato</MobileLink>
            </nav>
            <div className="space-y-2 border-t border-line p-4">
              <Link href="/#contato" className="btn-primary w-full" onClick={() => setMenuOpen(false)}>
                Solicitar orçamento <IconArrowRight size={16} />
              </Link>
              <a href={SITE.phone.href} className="btn-secondary w-full">
                <IconPhone size={16} /> {SITE.phone.label}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function ActiveBar() {
  return <span className="absolute inset-x-3.5 bottom-0 h-0.5 bg-accent-light" />;
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative flex h-full items-center whitespace-nowrap px-3.5 text-sm font-medium transition-colors hover:text-white ${
        active ? "text-white" : "text-white/75"
      }`}
    >
      {children}
      {active && <ActiveBar />}
    </Link>
  );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block rounded-md px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface">
      {children}
    </Link>
  );
}
