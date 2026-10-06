/* Ilustração genérica para produtos sem foto (uniformes, tecidos e afins).
   A chave é calculada a partir do nome do produto: tipo|cor|manga|faixa.
   Os desenhos ficam em public/ilustracoes/<chave com "-">.webp e são gerados
   por scripts/gerar-ilustracoes.py. */

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function tipoDe(n: string): string | null {
  if (/^(brim|camisaria|tricoline|denin|denim|comfort plus|tecido|oxford|gabardine|helanca|popeline|malha)\b/.test(n) || /\b(tecido|rip stop)\b/.test(n)) return "tecido";
  if (/^(faixa|fita) refletiva/.test(n)) return "faixa";
  if (/\bmacacao\b|\bmacacoes\b/.test(n)) return "macacao";
  if (/\bconj/.test(n) && /camisa|calca|brim|fardamento|motociclista|uniforme|impermeavel|chuva|jaleco|pvc/.test(n)) return "conjunto";
  if (/capa (de )?chuva|blusao|poncho|conjunto (pvc|impermeavel)/.test(n)) return "capa";
  if (/avental/.test(n)) return "avental";
  if (/jaleco|guarda.?po/.test(n)) return "jaleco";
  if (/colete/.test(n)) return "colete";
  if (/\b(touca|bone|capuz|balaclava)/.test(n)) return "touca";
  if (/camisa|camiseta|blusa|\bpolo\b/.test(n)) return "camisa";
  if (/\bcalcas?\b|\bbermuda/.test(n)) return "calca";
  return null;
}

function corDe(n: string): string {
  if (/transparente|transpa/.test(n)) return "transparente";
  if (/azul (marinho|escuro)|marinho/.test(n)) return "marinho";
  if (/azul royal|royal|azul bic|maritimo|aurora/.test(n)) return "royal";
  if (/placido|hortencia|celeste|azul claro|pastel|azul bebe|aqua|verde agua/.test(n)) return "celeste";
  if (/azul/.test(n)) return "azul";
  if (/chumbo|minerio|grafite/.test(n)) return "chumbo";
  if (/cinza/.test(n)) return "cinza";
  if (/petro/.test(n)) return "petroleo";
  if (/lemon|limao|neon/.test(n)) return "limao";
  if (/verde/.test(n)) return "verde";
  if (/laranja/.test(n)) return "laranja";
  if (/amarelo|amarela/.test(n)) return "amarelo";
  if (/vermelho|vermelha|cereja|vinho|bordo/.test(n)) return "vermelho";
  if (/branco|branca/.test(n)) return "branco";
  if (/preto|preta/.test(n)) return "preto";
  if (/marrom|marron|chocolate/.test(n)) return "marrom";
  if (/bege|areia|caqui|cru\b/.test(n)) return "bege";
  if (/prata/.test(n)) return "prata";
  if (/rosa|pink/.test(n)) return "rosa";
  if (/roxo|lilas|violeta/.test(n)) return "roxo";
  return "cinza";
}

export function chaveIlustracao(name: string): string | null {
  const n = norm(name);
  const tipo = tipoDe(n);
  if (!tipo) return null;
  const cor = corDe(n);
  const longa = /manga longa|m\. ?longa|\bml\b/.test(n);
  const curta = /manga curta|m\. ?curta|\bmc\b|gola v/.test(n);
  const manga = tipo === "camisa" || tipo === "conjunto" ? (longa ? "longa" : curta ? "curta" : "longa") : "x";
  const faixa = /c\/? ?faixa|com faixa|faixa (verde|reflet)|refletiv/.test(n) && tipo !== "faixa" && tipo !== "tecido" ? "faixa" : "x";
  return [tipo, cor, manga, faixa].join("-");
}
