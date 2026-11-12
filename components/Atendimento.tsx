"use client";

/* Atendimento guiado de orçamento. Substitui o atalho simples do WhatsApp:
   faz poucas perguntas (nome, empresa, categoria, produto/CA, quantidade),
   ou aproveita a lista de orçamento do site, e abre o WhatsApp comercial
   com a mensagem pronta. Nada é enviado nem salvo: quem envia é o usuário. */

import { useEffect, useRef, useState } from "react";
import { useCart, type CartItem } from "@/lib/cart-context";
import { whatsappLink } from "@/lib/site";
import { IconArrowRight, IconWhatsApp, IconX } from "./icons";

type Step = "lista" | "nome" | "empresa" | "categoria" | "produto" | "quantidade" | "resumo";
type Msg = { id: number; from: "bot" | "user"; text: string };
type Answers = {
  lista: boolean;
  nome: string;
  empresa: string;
  categoria: string;
  produto: string;
  quantidade: string;
};

const NAO_SEI = "Não sei o que preciso";
const CATEGORIAS = [
  { label: "Luvas", frase: "luvas" },
  { label: "Calçados", frase: "calçados de segurança" },
  { label: "Óculos", frase: "óculos de proteção" },
  { label: "Vestimentas de couro", frase: "vestimentas de couro" },
  { label: "Máscaras e respiradores", frase: "máscaras e respiradores" },
  { label: "Capacetes", frase: "capacetes" },
  { label: "Uniformes", frase: "uniformes" },
  { label: "Outros EPIs", frase: "outros EPIs" },
  { label: NAO_SEI, frase: "" },
];
const QUANTIDADES = [
  { label: "Até 10 unidades", frase: "até 10 unidades" },
  { label: "De 10 a 50", frase: "de 10 a 50 unidades" },
  { label: "De 50 a 200", frase: "de 50 a 200 unidades" },
  { label: "Mais de 200", frase: "mais de 200 unidades" },
  { label: "Ainda não sei", frase: "" },
];
/* Limite para o link do WhatsApp não ficar gigante com listas longas */
const MAX_ITENS_NA_MENSAGEM = 25;
const VAZIO: Answers = { lista: false, nome: "", empresa: "", categoria: "", produto: "", quantidade: "" };
const MSG_DIRETA = "Olá! Gostaria de solicitar um orçamento.";

const TEXT_STEPS = {
  nome: { label: "Seu nome", placeholder: "Digite seu nome", optional: false, autoComplete: "given-name" },
  empresa: { label: "Empresa", placeholder: "Nome da empresa", optional: true, autoComplete: "organization" },
  produto: { label: "Produto, código ou CA", placeholder: "Ex.: luva nitrílica, CA 12345", optional: true, autoComplete: "off" },
} as const;

function perguntas(step: Step, a: Answers, totalItens: number): string[] {
  switch (step) {
    case "lista":
      return [
        `Vi que você tem ${totalItens} ${totalItens === 1 ? "item" : "itens"} na sua lista de orçamento. Quer enviar essa lista?`,
      ];
    case "nome":
      return ["Como posso te chamar?"];
    case "empresa":
      return [`Prazer, ${a.nome}! De qual empresa você fala?`];
    case "categoria":
      return ["O que você está procurando?"];
    case "produto":
      return a.categoria === NAO_SEI
        ? ["Sem problema, a equipe ajuda a escolher. Para qual atividade ou setor é o EPI?"]
        : ["Tem o nome do produto, o código ou o número do CA?"];
    case "quantidade":
      return ["Qual a quantidade aproximada?"];
    case "resumo":
      return [`Pronto, ${a.nome}! Confira o resumo. Preço, estoque e prazo a equipe confirma pelo WhatsApp.`];
  }
}

function proximo(step: Step, a: Answers): Step {
  switch (step) {
    case "lista":
      return "nome";
    case "nome":
      return "empresa";
    case "empresa":
      return a.lista ? "resumo" : "categoria";
    case "categoria":
      return "produto";
    case "produto":
      return "quantidade";
    default:
      return "resumo";
  }
}

function fraseDe(lista: { label: string; frase: string }[], label: string) {
  return lista.find((c) => c.label === label)?.frase ?? "";
}

function montarMensagem(a: Answers, itens: CartItem[]) {
  const quem = a.empresa ? `${a.nome}, da empresa ${a.empresa},` : a.nome;
  const linhas = [`Olá! Meu nome é ${quem} e vim pelo site da Partum.`];

  if (a.lista && itens.length) {
    linhas.push("Gostaria de um orçamento destes itens:");
    itens.slice(0, MAX_ITENS_NA_MENSAGEM).forEach((i) => {
      linhas.push(`• ${i.quantity}x ${i.product.name} (cód. ${i.product.code})`);
    });
    if (itens.length > MAX_ITENS_NA_MENSAGEM) {
      linhas.push(`• e mais ${itens.length - MAX_ITENS_NA_MENSAGEM} itens da minha lista`);
    }
  } else if (a.categoria === NAO_SEI) {
    linhas.push(`Preciso de ajuda para escolher os EPIs certos${a.produto ? ` para ${a.produto}` : ""}.`);
  } else {
    const cat = fraseDe(CATEGORIAS, a.categoria);
    linhas.push(`Gostaria de um orçamento de ${cat}${a.produto ? `: ${a.produto}` : ""}.`);
  }

  const qtd = fraseDe(QUANTIDADES, a.quantidade);
  if (!a.lista && qtd) linhas.push(`Quantidade aproximada: ${qtd}.`);
  linhas.push("Pode me ajudar?");
  return linhas.join("\n");
}

export default function Atendimento() {
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step | null>(null);
  const [typing, setTyping] = useState(false);
  const [answers, setAnswers] = useState<Answers>(VAZIO);
  const [text, setText] = useState("");
  const [erro, setErro] = useState("");

  const nextId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const bot = (texts: string[]): Msg[] => texts.map((t) => ({ id: nextId.current++, from: "bot", text: t }));

  function iniciar() {
    if (timer.current) clearTimeout(timer.current);
    const primeiro: Step = items.length > 0 ? "lista" : "nome";
    setAnswers(VAZIO);
    setText("");
    setErro("");
    setTyping(false);
    setMsgs(
      bot([
        "Olá! Aqui é o atendimento da Partum Brasil.",
        "Em poucas perguntas eu monto o seu pedido de orçamento para você enviar pelo WhatsApp.",
        ...perguntas(primeiro, VAZIO, items.length),
      ]),
    );
    setStep(primeiro);
  }

  function abrir() {
    if (msgs.length === 0) iniciar();
    setOpen(true);
  }

  function fechar() {
    setOpen(false);
  }

  function responder(valor: string, exibido: string) {
    if (!step) return;
    const a: Answers = { ...answers };
    if (step === "lista") a.lista = valor === "sim";
    else if (step === "nome") a.nome = valor;
    else if (step === "empresa") a.empresa = valor;
    else if (step === "categoria") a.categoria = valor;
    else if (step === "produto") a.produto = valor;
    else if (step === "quantidade") a.quantidade = valor;

    const seguinte = proximo(step, a);
    setAnswers(a);
    setText("");
    setErro("");
    setMsgs((m) => [...m, { id: nextId.current++, from: "user", text: exibido }]);
    setStep(null);
    setTyping(true);

    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(
      () => {
        setTyping(false);
        setMsgs((m) => [...m, ...bot(perguntas(seguinte, a, items.length))]);
        setStep(seguinte);
      },
      reduzir ? 0 : 550,
    );
  }

  function enviarTexto(e: React.FormEvent) {
    e.preventDefault();
    const v = text.trim();
    if (!v) {
      if (step === "nome") setErro("Digite seu nome para continuar.");
      return;
    }
    responder(v, v);
  }

  /* Rola para a última mensagem */
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, step]);

  /* Foco: campo de texto quando a etapa pede, painel ao abrir, botão ao fechar */
  useEffect(() => {
    if (open) {
      if (step && step in TEXT_STEPS) inputRef.current?.focus();
      else if (!wasOpen.current) panelRef.current?.focus();
    } else if (wasOpen.current) {
      triggerRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open, step]);

  /* Esc fecha */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const textStep = step === "nome" || step === "empresa" || step === "produto" ? TEXT_STEPS[step] : null;
  const produtoNaoSei = step === "produto" && answers.categoria === NAO_SEI;
  const noComeco = msgs.filter((m) => m.from === "user").length === 0;

  const resumo: [string, string][] = [["Nome", answers.nome]];
  if (answers.empresa) resumo.push(["Empresa", answers.empresa]);
  if (answers.lista) {
    resumo.push(["Itens", `${items.length} ${items.length === 1 ? "item" : "itens"} da lista de orçamento`]);
  } else {
    resumo.push(["Procura", answers.categoria]);
    if (answers.produto) resumo.push([answers.categoria === NAO_SEI ? "Atividade" : "Produto", answers.produto]);
    if (answers.quantidade) resumo.push(["Quantidade", answers.quantidade]);
  }

  return (
    <>
      {!open && (
        <button
          ref={triggerRef}
          type="button"
          onClick={abrir}
          aria-haspopup="dialog"
          aria-label="Pedir orçamento pelo WhatsApp"
          className="fixed bottom-5 right-5 z-40 flex h-12 items-center gap-2 rounded-full border border-white/10 bg-ink pl-3.5 pr-4 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(11,34,64,0.35)] transition-colors hover:bg-primary"
        >
          <IconWhatsApp size={20} />
          <span>Orçamento</span>
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Atendimento de orçamento Partum Brasil"
          tabIndex={-1}
          className="reveal fixed inset-0 z-[60] flex flex-col overflow-hidden bg-white focus:outline-none sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(620px,calc(100dvh-2.5rem))] sm:w-[380px] sm:rounded-[var(--radius-card)] sm:border sm:border-line sm:shadow-[0_24px_60px_rgba(11,34,64,0.28)]"
        >
          {/* Cabeçalho */}
          <div className="flex items-center gap-3 bg-ink px-4 py-3.5 text-white">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white/10">
              <IconWhatsApp size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[15px] font-bold leading-tight">Orçamento Partum</p>
              <p className="text-xs text-white/70">Monte o pedido e envie pelo WhatsApp</p>
            </div>
            <button
              type="button"
              onClick={fechar}
              aria-label="Fechar atendimento"
              className="flex size-9 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <IconX size={20} />
            </button>
          </div>

          {/* Conversa */}
          <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-2.5 overflow-y-auto bg-surface/60 px-4 py-4">
            <p className="rounded-md border border-line bg-white px-3 py-2 text-xs leading-relaxed text-muted">
              Suas respostas só servem para montar a mensagem do WhatsApp. Nada é enviado até você apertar enviar lá.
            </p>

            {msgs.map((m) =>
              m.from === "bot" ? (
                <p
                  key={m.id}
                  className="reveal max-w-[85%] whitespace-pre-line rounded-lg rounded-bl-sm border border-line bg-white px-3.5 py-2.5 text-sm leading-relaxed text-graphite"
                >
                  {m.text}
                </p>
              ) : (
                <p
                  key={m.id}
                  className="reveal ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-primary px-3.5 py-2.5 text-sm leading-relaxed text-white"
                >
                  {m.text}
                </p>
              ),
            )}

            {typing && (
              <p className="flex w-fit items-center gap-1 rounded-lg rounded-bl-sm border border-line bg-white px-3.5 py-3" aria-label="Digitando">
                <span className="size-1.5 animate-pulse rounded-full bg-muted" />
                <span className="size-1.5 animate-pulse rounded-full bg-muted [animation-delay:150ms]" />
                <span className="size-1.5 animate-pulse rounded-full bg-muted [animation-delay:300ms]" />
              </p>
            )}

            {step === "resumo" && (
              <dl className="reveal divide-y divide-line rounded-md border border-line bg-white text-sm">
                {resumo.map(([k, v]) => (
                  <div key={k} className="flex gap-3 px-3.5 py-2">
                    <dt className="w-24 shrink-0 text-muted">{k}</dt>
                    <dd className="min-w-0 break-words font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Respostas */}
          <div className="border-t border-line bg-white px-4 pb-3 pt-3">
            {step === "lista" && (
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-primary" onClick={() => responder("sim", "Enviar minha lista")}>
                  Enviar minha lista
                </button>
                <button type="button" className="btn-secondary" onClick={() => responder("nao", "Começar do zero")}>
                  Começar do zero
                </button>
              </div>
            )}

            {step === "categoria" && (
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map((c) => (
                  <button key={c.label} type="button" className="chip-off py-2 text-sm" onClick={() => responder(c.label, c.label)}>
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {step === "quantidade" && (
              <div className="flex flex-wrap gap-2">
                {QUANTIDADES.map((q) => (
                  <button key={q.label} type="button" className="chip-off py-2 text-sm" onClick={() => responder(q.label, q.label)}>
                    {q.label}
                  </button>
                ))}
              </div>
            )}

            {textStep && (
              <form onSubmit={enviarTexto} noValidate>
                <label htmlFor="atendimento-campo" className="label">
                  {produtoNaoSei ? "Atividade ou setor" : textStep.label}
                  {textStep.optional && <span className="font-normal text-muted"> (opcional)</span>}
                </label>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    id="atendimento-campo"
                    className="field"
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      if (erro) setErro("");
                    }}
                    placeholder={produtoNaoSei ? "Ex.: solda, obra, frigorífico" : textStep.placeholder}
                    autoComplete={textStep.autoComplete}
                    maxLength={120}
                    aria-invalid={erro ? true : undefined}
                    aria-describedby={erro ? "atendimento-erro" : undefined}
                  />
                  <button type="submit" className="btn-primary shrink-0 px-3.5" aria-label="Enviar resposta">
                    <IconArrowRight size={18} />
                  </button>
                  {textStep.optional && (
                    <button type="button" className="btn-secondary shrink-0 px-3.5" onClick={() => responder("", "Pular")}>
                      Pular
                    </button>
                  )}
                </div>
                {erro && (
                  <p id="atendimento-erro" className="mt-1.5 text-xs text-red-700">
                    {erro}
                  </p>
                )}
                {step === "nome" && <p className="mt-1.5 text-xs text-muted">Não precisa informar CPF nem dados pessoais.</p>}
              </form>
            )}

            {step === "resumo" && (
              <>
                <a
                  href={whatsappLink(montarMensagem(answers, items))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
                  <IconWhatsApp size={18} />
                  Continuar no WhatsApp
                </a>
                <p className="mt-1.5 text-center text-xs text-muted">
                  Abre o WhatsApp com a mensagem pronta. Você revisa e aperta enviar.
                </p>
              </>
            )}

            <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
              {noComeco ? (
                <a
                  href={whatsappLink(MSG_DIRETA)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-muted underline-offset-2 hover:text-accent hover:underline"
                >
                  Prefiro falar direto no WhatsApp
                </a>
              ) : (
                <button type="button" onClick={iniciar} className="font-medium text-muted hover:text-accent">
                  Recomeçar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
