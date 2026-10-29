# Auditoria e redesign — Partum Brasil

Branch de trabalho: `redesign` (nada foi publicado no `main`).

## 1. Estado encontrado

- **Stack:** Next.js 16.2.4 (App Router, Turbopack), React 19, Tailwind 4 (tokens em `app/globals.css` via `@theme`), fonte Geist via `next/font`. Sem banco de dados: o catálogo é o arquivo `lib/products-data.json` (~7.450 itens) com a lógica em `lib/products.ts`.
- **Rotas:** `/`, `/produtos/[categoria]`, `/produtos/[categoria]/[slug]`, `/marcas`, `/marcas/[marca]`, `/carrinho` (lista de orçamento), `/api/contato` e `/api/orcamento` (envio de e-mail pela Resend, chave em `RESEND_API_KEY`).
- **Imagens:** `public/produtos/<código>.webp` (fotos reais), `public/ilustracoes/*.webp` (ilustrações genéricas marcadas como "Imagem ilustrativa"), `public/marcas/` (logos), `public/hero.jpg` (fotografia da campanha com fardamento Partum).
- **Contato confirmado:** (71) 2136-4247, WhatsApp (71) 98307-0736, vendas04@partumbrasil.com.br, Tv. Industrial Urbana, 02 — Ponto Certo, Camaçari — BA. Empresa desde 2016.

## 2. Problemas encontrados

### Conteúdo e credibilidade
- Números sem comprovação repetidos em três lugares (Hero, Welcome e Diferenciais): "5.000+ clientes", "100% entrega nacional", "24h suporte online", "100% CA garantido", "rastreamento em tempo real", "estoque disponível para reposição imediata", "responde em até 24 horas".
- "Mais de 10 anos" convive com "desde 2016" (só fecha em 2026; frágil).
- Seção "Bem-vindo" com emojis (🏆 🤝 🚀), círculos decorativos e dois selos flutuantes.
- O texto institucional promete "rigoroso controle de qualidade" sem base.

### Identidade visual
- Cores fora da paleta: verde (botão adicionado, sucesso, WhatsApp, selo CA), âmbar e ciano nas etiquetas de categoria.
- Emojis como ícones nos cards, nas páginas vazias e no fallback de imagem.
- Uso excessivo de gradientes radiais e de cards muito arredondados (`rounded-3xl`), com efeito de zoom e rotação nos produtos.
- Três sistemas de ícones misturados (paths soltos em cada componente).

### Navegação e catálogo
- Não existe busca global: a busca só funciona dentro de uma categoria.
- Links do rodapé apontam para âncoras inexistentes (`#luvas`, `#oculos` etc.).
- Menu "Produtos" leva direto para Luvas.
- Paginação sem reticências e sem primeira/última página; não há ordenação nem indicador de filtros ativos.
- Página de produto adivinha a marca por uma regex própria, diferente da usada no resto do site.
- Mensagem de WhatsApp do produto não inclui marca nem link da página.

### Técnico / SEO
- Sem `sitemap.xml`, `robots.txt` nem página 404 própria.
- Páginas de categoria e de produto sem `title`/`description` próprios; sem Open Graph.
- Formulários sem `htmlFor`/`id` ligando label e campo; erro sem `aria-live`.
- Sem tratamento de `prefers-reduced-motion`.

## 3. O que foi feito

- **Paleta** azul/branco/grafite em tokens (`app/globals.css`), mantendo os nomes antigos (`primary`, `accent`, `surface`) para não quebrar nada e acrescentando `ink`, `line`, `graphite`, `muted`, `sky`.
- **Tipografia:** Geist para texto e Archivo para títulos (peso industrial).
- **Ícones:** conjunto vetorial único em `components/icons.tsx` (traço 1.75, estilo Lucide), substituindo emojis e paths soltos.
- **Header** novo: barra de contato, logo, menu de produtos com as categorias reais e contagem, marcas, busca global, lista de orçamento e CTA. Encolhe no scroll. Menu mobile próprio.
- **Hero:** fotografia original da campanha, headline e texto revisados, dois CTAs. Indicadores grandes sem comprovação removidos.
- **Home** reorganizada: Hero → Categorias (com contagem real e foto real de um produto da categoria) → Lançamentos → Marcas → Como funciona o orçamento → Contato. Removidas as seções "Bem-vindo" e "Diferenciais" com dados não comprovados.
- **Busca global** (`/busca`) por nome ou código em todo o catálogo, com filtro de categoria.
- **Catálogo:** filtros de categoria e marca, busca, ordenação (relevância, com foto primeiro, nome A–Z/Z–A), chips de filtros ativos com "limpar", paginação completa e estados vazios.
- **Cards** neutros com marca, código, nome e ação de orçamento.
- **Página de produto:** breadcrumb, marca e CA vindos da mesma lógica do catálogo, tabela de dados, CTAs (lista de orçamento e WhatsApp com nome, código, marca e link), relacionados da mesma marca/categoria.
- **WhatsApp:** botão flutuante e links usam somente o número confirmado; a mensagem é preenchida e o usuário confirma o envio.
- **Formulários:** labels ligados, `aria-live` nos erros, estado de envio; o fluxo continua o mesmo (`/api/contato` e `/api/orcamento`). Nenhum envio é simulado.
- **SEO:** `metadata` com template e Open Graph, `generateMetadata` em categoria, produto e busca, `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`.
- **Acessibilidade/motion:** foco visível, `prefers-reduced-motion`, áreas de toque ≥ 40px.

## 4. Testes executados

- `tsc --noEmit` sem erros e `next build` concluído (89 páginas estáticas, rotas dinâmicas de catálogo).
- Rotas respondendo no servidor local: `/`, `/busca`, `/produtos/luvas`, `/marcas`, `/marcas/kalipso`, `/carrinho`, `/sitemap.xml`, `/robots.txt` (200) e uma rota inexistente (404 com a página própria).
- Inspeção visual no navegador em 1440 px e 375 px: home completa, categoria com filtros, busca global, página de produto, lista de orçamento, marcas e menu mobile. Sem rolagem horizontal no celular.
- Lista de orçamento: adicionar produto atualiza o contador do cabeçalho e os itens aparecem em `/carrinho`.
- Varredura no código: nenhuma cor laranja, amarela ou verde e nenhum emoji na interface.
- **Não testado:** envio real dos formulários (depende da `RESEND_API_KEY`, que não existe no ambiente local) e o comportamento em navegadores além do Chromium.

## 5. Pendências que dependem de você

- **Fotografia:** usei a foto da campanha já existente (`public/hero.jpg`). Não havia ferramenta de geração de imagem configurada; se quiser fotos editoriais novas, é preciso produzi-las ou gerar fora daqui.
- **Volk e Ultra Master:** os logos disponíveis são brancos; seguem sobre placa azul. Conseguir as versões coloridas.
- **Segmentos atendidos** (indústria, construção etc.): não incluí uma seção por segmento porque não há informação que sustente especialização. Se quiser, me passe quais segmentos a Partum atende de fato.
- **Números institucionais** (clientes atendidos, prazo de resposta, cobertura de entrega): removidos. Se forem reais, posso recolocar com a fonte.
- **E-mail dos formulários** depende de `RESEND_API_KEY` configurada na Vercel (já está em produção; localmente o envio falha sem a chave).
