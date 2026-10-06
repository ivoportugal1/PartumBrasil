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


/* ---- Calçados, luvas, máscaras, couro, óculos e capacetes ----
   As chaves destes grupos têm formato próprio (tipo-variação...), por exemplo
   botacouro-marrom-composite, luva-nitrilica-azul-curto, pff-branco-valv. */

const cores = (n: string, padrao: string): string => {
  if (/azul (marinho|escuro)|marinho|navy/.test(n)) return "marinho";
  if (/azul royal|royal|azul bic/.test(n)) return "royal";
  if (/azul/.test(n)) return "azul";
  if (/cinza|chumbo/.test(n)) return "cinza";
  if (/verde/.test(n)) return "verde";
  if (/laranja/.test(n)) return "laranja";
  if (/amarel|amaral/.test(n)) return "amarelo";
  if (/vermelh/.test(n)) return "vermelho";
  if (/branc/.test(n)) return "branco";
  if (/preto|preta|black/.test(n)) return "preto";
  if (/marrom|cafe|castor|nobuck/.test(n)) return "marrom";
  if (/rosa|pink/.test(n)) return "rosa";
  if (/bege|cru\b/.test(n)) return "bege";
  return padrao;
};

function calcado(n: string): string | null {
  if (!/^(bota|botina|coturno|sapato|tenis|babuch|calcado|galocha)/.test(n)) return null;
  if (/^babuch|^calcado eva|^sapato tipo tamanco|tamanco/.test(n)) return "babuche-" + cores(n, "branco");
  if (/^tenis/.test(n)) return "tenis-" + cores(n, "preto");
  if (/^coturno/.test(n)) return "coturno-" + cores(n, "preto");
  if (/^sapato/.test(n)) return "sapato-" + cores(n, "preto");
  if (/^botina/.test(n) || /^bota.*elastic/.test(n)) return "botina-" + cores(n, "preto");
  if (/^galocha/.test(n) || (/^bota/.test(n) && /pvc|^bota eva/.test(n) && !/couro|biq|bico/.test(n))) {
    const c = /pr\/am|preta\/am/.test(n) ? "preto" : cores(n, "preto");
    return "botapvc-" + c;
  }
  if (/^bota/.test(n)) {
    const bico = /composite/.test(n) ? "composite" : /(bico|biq|b\.) ?aco/.test(n) ? "aco" : "x";
    const c = /nobuck/.test(n) && !/preto|preta/.test(n) ? "marrom" : cores(n, "preto");
    return `botacouro-${c === "preto" || c === "marrom" ? c : "preto"}-${bico}`;
  }
  return null;
}

function luva(n: string): string | null {
  if (!/^luva/.test(n)) return null;
  const longo = /cano longo|\b(2\d|3\d|4\d)\s?cm|punho 20/.test(n) ? "longo" : "curto";
  if (/desc|vinil|procedimento|cirurgica/.test(n)) return "luva-descartavel-" + cores(n, "azul") + "-curto";
  if (/nitril|nitrilsafe/.test(n)) return `luva-nitrilica-${cores(n, "azul")}-${longo}`;
  if (/latex/.test(n)) return `luva-latex-${cores(n, "amarelo")}-${longo}`;
  if (/\bpvc/.test(n)) return `luva-pvc-${cores(n, "vermelho")}-longo`;
  if (/vaqueta/.test(n)) return `luva-vaqueta-bege-${longo}`;
  if (/raspa/.test(n)) return `luva-raspa-bege-${longo}`;
  if (/corte|aramida|kevlar/.test(n)) return `luva-anticorte-${cores(n, "cinza")}-curto`;
  if (/termic|radiant/.test(n)) return `luva-termica-${cores(n, "cinza")}-curto`;
  if (/isolante|cobert|alta tens/.test(n)) return "luva-isolante-preto-longo";
  if (/neopr/.test(n)) return `luva-neoprene-preto-${longo}`;
  if (/pigment/.test(n)) return `luva-pigmentada-${cores(n, "cinza")}-curto`;
  if (/\bpu\b|poliuretano/.test(n)) return `luva-pu-${cores(n, "preto")}-curto`;
  if (/malha|tricot|nylon|poliamida|grip/.test(n)) return `luva-malha-${cores(n, "cinza")}-curto`;
  return null;
}

function mascara(n: string): string | null {
  if (/^(pre )?filtro|^kit (pre )?filtro|^cartucho/.test(n) && !/linha|toma/.test(n)) {
    return /partic|pre filtro|\bp[123]\b|poeira/.test(n) ? "filtro-particula" : "filtro-quimico";
  }
  if (!/^(respirador|resperidor|mascara|semi)/.test(n)) return null;
  if (/pff/.test(n)) {
    const valv = /(com|c) valvula|\bc valvula|\bcv\b/.test(n) && !/sem valvula|\bsv\b|s\/valvula/.test(n) ? "valv" : "sem";
    return `pff-${cores(n, "branco")}-${valv}`;
  }
  if (/semi ?facial/.test(n)) return "semifacial-cinza";
  if (/facial inteir|panoram/.test(n)) return "facial-preto";
  if (/desc|tnt|cirurg/.test(n)) return "mascaradesc-" + cores(n, /cirurg/.test(n) ? "azul" : "branco");
  return null;
}

function couro(n: string): string | null {
  if (/^perneira/.test(n)) return "perneira-" + (/raspa/.test(n) ? "bege" : cores(n, "marrom"));
  if (/^(mangote|manga )/.test(n)) return "mangote-" + (/raspa/.test(n) ? "bege" : cores(n, "cinza"));
  if (/^bainha/.test(n)) return "bainha-marrom";
  return null;
}

function oculos(n: string): string | null {
  if (!/^oculos/.test(n) || /liquido|lente|clipe|adaptavel|suporte|spray|antiemba/.test(n)) return null;
  const lente = /cinza|fume|escuro/.test(n) ? "escuro" : /ambar|amarel/.test(n) ? "ambar" : "incolor";
  return /ampla/.test(n) ? `oculosampla-${lente}` : `oculos-${lente}`;
}

function capacete(n: string): string | null {
  if (!/^capacete/.test(n) || /moto|alpinista|abafador/.test(n)) return null;
  return `capacete-${cores(n, "branco")}-${/jugular/.test(n) ? "j" : "x"}`;
}

export function chaveEpi(name: string): string | null {
  const n = norm(name);
  return calcado(n) || luva(n) || mascara(n) || couro(n) || oculos(n) || capacete(n);
}

export function chaveIlustracao(name: string): string | null {
  const epi = chaveEpi(name);
  if (epi) return epi;
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
