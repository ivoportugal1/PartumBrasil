"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import CartIcon from "./CartIcon";

const categories = [
  { label: "Luvas", href: "/produtos/luvas" },
  { label: "Calçados", href: "/produtos/calcados" },
  { label: "Óculos", href: "/produtos/oculos" },
  { label: "Couro", href: "/produtos/couro" },
  { label: "Máscaras", href: "/produtos/mascaras" },
  { label: "Capacetes", href: "/produtos/capacetes" },
  { label: "Diversos", href: "/produtos/diversos" },
];

const navItems = [
  { label: "Início", href: "/" },
  { label: "Produtos", href: "/produtos/luvas", sub: categories },
  { label: "Sobre", href: "/#sobre" },
  { label: "Contato", href: "/#contato" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center mt-4">
            <Image
              src="/logopartum-clean.png"
              alt="Partum Brasil"
              width={240}
              height={64}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.sub ? (
                <div key={item.label} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdown((prev) => !prev)}
                    className="flex items-center gap-1 px-4 py-2 text-white/90 hover:text-white text-sm font-medium transition-colors rounded hover:bg-white/10"
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${dropdown ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      {item.sub.map((s) => (
                        <Link
                          key={s.label}
                          href={s.href}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                          onClick={() => setDropdown(false)}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-white/90 hover:text-white text-sm font-medium transition-colors rounded hover:bg-white/10"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side: cart + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <CartIcon />
            <Link
              href="/#contato"
              className="inline-flex items-center gap-2 bg-accent hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow"
            >
              Solicitar Orçamento
            </Link>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <CartIcon />
            <button
              className="text-white p-2 rounded hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary-dark border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 text-white/90 hover:text-white text-sm font-medium rounded hover:bg-white/10 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.sub && (
                  <div className="pl-4 space-y-1">
                    {item.sub.map((s) => (
                      <Link
                        key={s.label}
                        href={s.href}
                        className="block px-3 py-2 text-white/70 hover:text-white text-sm rounded hover:bg-white/10 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/#contato"
              className="block mt-2 text-center bg-accent hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Solicitar Orçamento
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
