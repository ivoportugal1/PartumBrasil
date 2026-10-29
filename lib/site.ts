/* Dados institucionais confirmados. Use sempre estes valores; não espalhe
   telefone, e-mail ou WhatsApp pelo código. */
export const SITE = {
  name: "Partum Brasil",
  url: "https://www.partumbrasil.com.br",
  since: 2016,
  phone: { label: "(71) 2136-4247", href: "tel:+557121364247" },
  whatsapp: { label: "(71) 98307-0736", number: "5571983070736", href: "tel:+5571983070736" },
  email: "vendas04@partumbrasil.com.br",
  address: {
    street: "Tv. Industrial Urbana, 02 — Ponto Certo",
    city: "Camaçari — BA",
    zip: "CEP 42800-145",
  },
  instagram: "https://www.instagram.com/partumbrasil/",
};

/* Link do WhatsApp com mensagem preenchida. O envio continua nas mãos do usuário. */
export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
