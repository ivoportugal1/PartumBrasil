import Link from "next/link";
import { SITE, whatsappLink } from "@/lib/site";
import { IconArrowRight, IconWhatsApp, IconPhone } from "./icons";

/* Chamada comercial: azul-marinho, um CTA principal e os dois canais diretos. */
export default function CtaBand() {
  return (
    <section className="bg-ink text-white">
      <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:py-20">
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Precisa equipar uma equipe?
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-white/75">
            Envie a lista de EPIs e fardamentos que sua empresa usa. Nossa equipe comercial
            monta a proposta e confirma tamanhos, cores e prazos.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
          <Link href="/#contato" className="btn-primary h-12 px-6">
            Solicitar orçamento <IconArrowRight size={18} />
          </Link>
          <a
            href={whatsappLink("Olá! Gostaria de solicitar um orçamento de EPIs.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-dark h-12 px-6"
          >
            <IconWhatsApp size={18} /> WhatsApp
          </a>
          <a href={SITE.phone.href} className="btn-ghost-dark h-12 px-6">
            <IconPhone size={17} /> {SITE.phone.label}
          </a>
        </div>
      </div>
    </section>
  );
}
