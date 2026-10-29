import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/products";
import { SITE, whatsappLink } from "@/lib/site";
import { IconInstagram, IconWhatsApp, IconPhone, IconMail, IconMapPin } from "./icons";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
        <div>
          <Image src="/logopartum-clean.png" alt="Partum Brasil" width={3014} height={1574} className="h-12 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            EPIs e fardamentos profissionais para empresas. Camaçari (BA), desde {SITE.since}.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Partum Brasil"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white/75 hover:border-white/40 hover:text-white"
            >
              <IconInstagram size={18} />
            </a>
            <a
              href={whatsappLink("Olá! Vim pelo site da Partum Brasil.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da Partum Brasil"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white/75 hover:border-white/40 hover:text-white"
            >
              <IconWhatsApp size={18} />
            </a>
          </div>
        </div>

        <FooterCol title="Produtos">
          {categories.map((c) => (
            <FooterLink key={c.slug} href={`/produtos/${c.slug}`}>{c.name}</FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Navegação">
          <FooterLink href="/busca">Catálogo completo</FooterLink>
          <FooterLink href="/marcas">Marcas</FooterLink>
          <FooterLink href="/#sobre">A empresa</FooterLink>
          <FooterLink href="/carrinho">Lista de orçamento</FooterLink>
          <FooterLink href="/#contato">Contato</FooterLink>
        </FooterCol>

        <FooterCol title="Contato">
          <li className="flex gap-2.5 text-sm text-white/65">
            <IconPhone size={16} className="mt-0.5 shrink-0 text-white/40" />
            <span>
              <a href={SITE.phone.href} className="hover:text-white">{SITE.phone.label}</a>
              <span className="text-white/30"> · </span>
              <a href={SITE.whatsapp.href} className="hover:text-white">{SITE.whatsapp.label}</a>
            </span>
          </li>
          <li className="flex gap-2.5 text-sm text-white/65">
            <IconMail size={16} className="mt-0.5 shrink-0 text-white/40" />
            <a href={`mailto:${SITE.email}`} className="break-all hover:text-white">{SITE.email}</a>
          </li>
          <li className="flex gap-2.5 text-sm text-white/65">
            <IconMapPin size={16} className="mt-0.5 shrink-0 text-white/40" />
            <span>{SITE.address.street}<br />{SITE.address.city}, {SITE.address.zip}</span>
          </li>
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Partum Brasil. Todos os direitos reservados.</p>
          <p>Imagens marcadas como “ilustrativas” não representam o produto exato.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{title}</h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-white/70 transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}
