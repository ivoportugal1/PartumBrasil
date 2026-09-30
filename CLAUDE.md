@AGENTS.md

## Contexto do projeto Partum Brasil

Resumo do que já foi feito no site, para quem pegar o projeto daqui pra frente.

### Como publicar

- Publicar é sempre: `git add -A`, `git commit`, `git push` na branch `main`. A Vercel builda sozinha.
- O Ivo **não usa localhost** para conferir. Ao terminar uma mudança, já entregar o bloco de publicar.
- Se um build falhar na Vercel, o site anterior continua no ar. Consertar pelo log.
- Build local exige `npm install` antes (o projeto não tinha `node_modules`) e a variável `RESEND_API_KEY` (qualquer valor serve só para buildar, ex.: `re_dummy`).
- Não deixar arquivos de trabalho entrarem no commit (ex.: `saida.txt`). Colocar no `.gitignore`.

### Identidade visual

- A empresa é **só azul e branco**. Não usar laranja em lugar nenhum.
- Cores em `app/globals.css` (`@theme`):
  `primary #0d2e63`, `primary-dark #071c40`, `primary-light #3b7de0`,
  `accent #2a6dd9`, `accent-light #5b9bf5`, `surface #f1f5f9`.
- Logo oficial: `public/logopartum-clean.png`, formato empilhado (o "P" fica **em cima** da palavra PARTUM). Ícones em `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`.
- Hero (`components/Hero.tsx`): imagem `public/hero.jpg` com 2400x1030. A faixa usa `lg:aspect-[240/103]` para a arte nunca cortar o rosto do trabalhador em monitor grande. Não trocar por altura fixa.
- Empresa existe **desde 2016**. E-mail de contato é **vendas04@partumbrasil.com.br** (não vendas05).

### Catálogo e fotos

- Produtos em `lib/products-data.json` (~7.450 itens). Lógica em `lib/products.ts`.
- Foto de produto: `public/produtos/<codigo>.<ext>`. O `components/ProductImage.tsx` tenta nesta ordem: `webp`, `jpg`, `jpeg`, `png`. Por isso tudo deve ficar em **WebP**.
- Imagens sempre hospedadas no próprio site. **Nunca** apontar para imagem de site de fornecedor.
- A chave para achar foto é o **número do CA**, que vem escrito no nome do produto. Um CA cobre todos os tamanhos e cores do mesmo modelo.
- Regra do Ivo: se o produto só muda tamanho ou cor, **pode repetir a mesma foto**.

#### Scripts de fotos (rodam no PC do Ivo, precisam de internet)

1. `python buscar-fotos.py --aplicar fotos-XXX.txt --inseguro`
   Arquivo com linhas `CA;url`. Baixa cada foto uma vez e grava uma cópia para cada produto daquele CA.
2. `python scripts/remover-fundo-tudo.py`
   Remove o fundo de todas as imagens da pasta (rembg). O `REMOVER-FUNDO.bat` antigo só pega arquivo **novo**, não usar para lote.
3. `python scripts/png-para-webp.py`
   Converte para WebP, teto de 1000px. Deixou a pasta em ~39 MB.
4. Commit e push.

#### Onde achar fotos

- Melhor fonte: lojas de EPI que colocam o CA no endereço do produto. A `novaopcaoepi.com.br` (Loja Integrada, sitemap em `/sitemap/product-N.xml`) rendeu 65 CAs de uma vez. Casar o CA do endereço com o CA do nome do produto.
- Becos sem saída já testados: site da Worker (catálogo em PDF folheável), Nove54, Idol e Bootbras (sem site), Crival (site quebrado), bracol.pro (bloqueia).
- **Pendente:** ~90 CAs grandes ainda sem foto (~700 produtos). Os maiores: Kala CA 30258 (22 produtos), Vonder 37285 (18), Worker 39940/39184/26835, Rhino 48539, Bootbras 48021, AgroIndustria 49423, Crival 40099.
- CA 36026 (Innpro) falhava por causa de travessão (–) na URL; resolvido: `buscar-fotos.py` agora codifica a URL antes de baixar.

### Seção "Nossos parceiros" e páginas de marca

- `components/Parceiros.tsx`, na home entre Categorias e Features. Cards brancos com o logo na cor original sobre fundo azul-marinho.
- A lista `DESTAQUE` define as marcas e a ordem: Kalipso, Kadesh, Volk, 3M, MSA, Rhino, Camper, Ultra Master, Steelflex.
- Logos em `public/marcas/`, baixados por `python scripts/baixar-logos.py`. Se o arquivo de um logo não existir, o card mostra o nome da marca em texto (proteção contra card vazio).
- Páginas: `app/marcas/page.tsx` (todas as marcas) e `app/marcas/[marca]/page.tsx` (produtos da marca, com filtro por categoria, busca e paginação). Funções em `lib/products.ts`: `brandSlug`, `getAllBrands`, `getBrandNameBySlug`, `getCategoriesOfBrand`, `getProductsByBrand`.
- "Ultra Master" foi incluída na `BRAND_LIST` de `lib/products.ts`.

#### Cuidados com logo

- `next/image` bloqueia SVG. Na seção de parceiros os logos usam `<img>` comum.
- SVG **sem `width` e `height`** aparece com tamanho 0x0. O `baixar-logos.py` já corrige isso copiando do `viewBox`.
- Logo feito para fundo escuro (texto branco) some no card branco. Precisa da versão colorida. A Camper foi extraída do site deles (Wix, SVG embutido) com o texto trocado para preto.

#### Pendente nos parceiros

| Marca | Situação |
|---|---|
| Volk | site só tem `logo-branca.png`, precisa da versão colorida |
| Ultra Master | site só tem `ump-logo-light`, procurar a versão escura |
| Steelflex | resolvido: `public/marcas/steelflex.png` (colorido, vermelho), já ligado em `DESTAQUE` |

Volk e Ultra Master seguem com `logo: null` (card de texto) porque só existem versões brancas; `public/marcas/volk.png` e `ultra-master.png` são brancos e não devem ser usados. Quando conseguir os arquivos coloridos, salvar em `public/marcas/` e apontar na lista `DESTAQUE`.
