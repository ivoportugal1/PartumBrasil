"use client";

import { useState } from "react";
import { SITE, whatsappLink } from "@/lib/site";
import { IconPhone, IconMail, IconMapPin, IconWhatsApp, IconCheck, IconLoader } from "./icons";

/* Formulário de contato. Continua enviando para /api/contato (e-mail via
   Resend). Nada de sucesso simulado: só confirma quando a API responde ok. */
export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const f = new FormData(e.currentTarget);
    const data = {
      nome: String(f.get("nome") ?? "").trim(),
      empresa: String(f.get("empresa") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      telefone: String(f.get("telefone") ?? "").trim(),
      mensagem: String(f.get("mensagem") ?? "").trim(),
    };
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contato" className="border-t border-line bg-surface py-20 lg:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <p className="eyebrow">Contato</p>
          <h2 className="h-section mt-3">Fale com a equipe comercial</h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            Conte o que sua empresa precisa: produtos, quantidades e prazo. Para listas maiores,
            use a lista de orçamento do catálogo.
          </p>

          <ul className="mt-8 divide-y divide-line border-y border-line">
            <ContactRow icon={IconPhone} label="Telefone">
              <a href={SITE.phone.href} className="hover:text-accent">{SITE.phone.label}</a>
            </ContactRow>
            <ContactRow icon={IconWhatsApp} label="WhatsApp">
              <a
                href={whatsappLink("Olá! Gostaria de falar com a equipe comercial da Partum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                {SITE.whatsapp.label}
              </a>
            </ContactRow>
            <ContactRow icon={IconMail} label="E-mail">
              <a href={`mailto:${SITE.email}`} className="break-all hover:text-accent">{SITE.email}</a>
            </ContactRow>
            <ContactRow icon={IconMapPin} label="Endereço">
              {SITE.address.street}, {SITE.address.city}, {SITE.address.zip}
            </ContactRow>
          </ul>

          <div className="mt-8 h-56 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
            <iframe
              title="Localização da Partum Brasil em Camaçari"
              src="https://www.google.com/maps?q=Partum+Fardamentos+Industriais+e+Epis,+Tv.+Industrial+Urbana,+02,+Ponto+Certo,+Camaçari,+BA&output=embed&z=15"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 sm:p-8">
          {status === "sent" ? (
            <div className="py-10 text-center" role="status">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky text-accent">
                <IconCheck size={24} />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-ink">Mensagem enviada</h3>
              <p className="mt-2 text-muted">Recebemos sua solicitação. A equipe comercial vai responder pelo e-mail informado.</p>
              <button onClick={() => setStatus("idle")} className="btn-link mt-6">Enviar outra mensagem</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
              <h3 className="font-display text-lg font-bold text-ink">Solicitar orçamento</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="nome" label="Nome" required>
                  <input id="nome" name="nome" type="text" required autoComplete="name" className="field" />
                </Field>
                <Field id="empresa" label="Empresa">
                  <input id="empresa" name="empresa" type="text" autoComplete="organization" className="field" />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="email" label="E-mail" required>
                  <input id="email" name="email" type="email" required autoComplete="email" className="field" />
                </Field>
                <Field id="telefone" label="Telefone ou WhatsApp">
                  <input id="telefone" name="telefone" type="tel" autoComplete="tel" placeholder="(71) 99999-9999" className="field" />
                </Field>
              </div>
              <Field id="mensagem" label="Produtos e quantidades" required>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  required
                  rows={5}
                  placeholder="Ex.: 50 pares de luva nitrílica tam. 9, 20 botinas bidensidade nº 40…"
                  className="field resize-y"
                />
              </Field>

              <div aria-live="polite">
                {status === "error" && (
                  <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp {SITE.whatsapp.label}.
                  </p>
                )}
              </div>

              <button type="submit" disabled={status === "sending"} className="btn-primary h-12 w-full">
                {status === "sending" ? (<><IconLoader size={18} /> Enviando…</>) : "Enviar solicitação"}
              </button>
              <p className="text-center text-xs text-muted">Usamos seus dados só para responder a esta solicitação.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, required, children }: { id: string; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required && <span className="text-accent" aria-hidden="true">*</span>}
      </label>
      {children}
    </div>
  );
}

function ContactRow({ icon: Icon, label, children }: { icon: (p: { size?: number }) => React.ReactElement; label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4 py-4">
      <span className="mt-0.5 text-primary"><Icon size={18} /></span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-ink">{children}</p>
      </div>
    </li>
  );
}
