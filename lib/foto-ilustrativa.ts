/* Produtos cuja foto é de outra cor do mesmo modelo (a cor exata ainda não
   tem imagem). Mostram um aviso de "imagem ilustrativa" no site. A chave é o
   imageCode (ou o code) do produto. Para tirar o aviso, é só remover o código
   daqui quando a foto correta for colocada em public/produtos. */
export const FOTO_ILUSTRATIVA = new Set<string>([
  "VIC5612000CZ",
  "7898606604417",
  "7898606604288",
  "7890839894627",
  "7899367921355",
  "7899367921416",
  "7899367938407",
  "7909066558124",
  "7909066589487",
  "7909066590100",
]);

export const isFotoIlustrativa = (imageCode?: string, code?: string) =>
  FOTO_ILUSTRATIVA.has((imageCode || code || "").replace(/[^a-zA-Z0-9_-]/g, ""));
