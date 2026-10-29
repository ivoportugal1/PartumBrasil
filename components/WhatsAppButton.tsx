import { whatsappLink } from "@/lib/site";
import { IconWhatsApp } from "./icons";

/* Atalho flutuante para o WhatsApp comercial. Abre a conversa com a
   mensagem preenchida; quem envia é o usuário. */
export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Olá! Gostaria de solicitar um orçamento.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Partum no WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex h-12 items-center gap-2 rounded-full border border-white/10 bg-ink pl-3.5 pr-4 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(11,34,64,0.35)] transition-colors hover:bg-primary"
    >
      <IconWhatsApp size={20} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
