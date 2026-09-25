"""
Partum Brasil - Buscador de fotos de produtos
=============================================

Roda no SEU PC (precisa de internet), dentro da pasta do site.

    python buscar-fotos.py --marcas              lista as marcas e quantas fotos faltam
    python buscar-fotos.py --testar Vonder       testa os padroes de URL sem baixar nada
    python buscar-fotos.py Vonder                baixa as fotos que faltam dessa marca
    python buscar-fotos.py Vonder --limite 30    baixa no maximo 30 (bom pra testar)

Depois de baixar, rode o REMOVER-FUNDO.bat pra tirar o fundo e converter em WebP.

As fotos sao salvas em public/produtos/<codigo>.<ext>, que e exatamente o nome
que o site procura. Nao precisa mexer em codigo nenhum.
"""

import json
import os
import re
import sys
import time
import ssl
import urllib.request
import urllib.error

RAIZ = os.path.dirname(os.path.abspath(__file__))
CATALOGO = os.path.join(RAIZ, "lib", "products-data.json")
DESTINO = os.path.join(RAIZ, "public", "produtos")

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/125.0 Safari/537.36"}

# Padroes de URL de imagem por marca. {code} e o codigo do produto no catalogo.
# Va acrescentando marcas aqui conforme a gente descobrir o padrao de cada site.
PADROES = {
    "Vonder": [
        "https://www.vonder.com.br/estatico/vonder/temp/500_{code}.jpg",
        "https://www.vonder.com.br/estatico/vonder/temp/800_{code}.jpg",
        "https://www.vonder.com.br/estatico/vonder/temp/300_{code}.jpg",
        "https://www.vonder.com.br/estatico/vonder/produto/{code}.jpg",
        "https://www.vonder.com.br/estatico/vonder/temp/500_{code}.png",
    ],
}

EXT_VALIDAS = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}

# Chutes de endereco de imagem por marca, usados pelo modo --descobrir.
# {code} e o codigo do produto no catalogo da Partum.
CHUTES = {
    "Worker": {
        "host": "https://www.worker.com.br",
        "paths": [
            "/loja/images/produtos/{code}.jpg",
            "/loja/images/produtos/{code}.png",
            "/loja/images/produtos/g/{code}.jpg",
            "/loja/images/produtos/{code}_1.jpg",
            "/loja/images/produto/{code}.jpg",
            "/loja/images/catalogo/{code}.jpg",
            "/loja/images/site/{code}.jpg",
            "/loja/images/arquivos/{code}.jpg",
            "/images/produtos/{code}.jpg",
            "/estatico/worker/produto/{code}.jpg",
            "/estatico/worker/temp/500_{code}.jpg",
            "/produtos/{code}.jpg",
        ],
        "paginas": [
            "/catalogo/ferramentas-manuais",
            "/catalogo/epis",
        ],
    },
}

# --- certificados -----------------------------------------------------------
# O Python no Windows costuma vir sem a lista de certificados, e ai toda conexao
# https falha com CERTIFICATE_VERIFY_FAILED. Se o certifi estiver instalado a
# gente usa ele. Com --inseguro a verificacao e desligada (ultimo recurso).
INSEGURO = "--inseguro" in sys.argv

def montar_contexto():
    if INSEGURO:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        print(">> Modo inseguro: verificacao de certificado desligada.")
    else:
        try:
            import certifi
            ctx = ssl.create_default_context(cafile=certifi.where())
        except ImportError:
            ctx = ssl.create_default_context()
    # Varios sites de fabricante ainda usam chave Diffie-Hellman curta, que o
    # OpenSSL novo recusa (DH_KEY_TOO_SMALL). Baixar o nivel resolve.
    for ciphers in ("DEFAULT@SECLEVEL=0", "DEFAULT@SECLEVEL=1"):
        try:
            ctx.set_ciphers(ciphers)
            break
        except ssl.SSLError:
            continue
    try:
        ctx.minimum_version = ssl.TLSVersion.TLSv1
    except Exception:
        pass
    return ctx

CTX = montar_contexto()


def sanitizar(code):
    return re.sub(r"[^a-zA-Z0-9_-]", "", code or "")


def carregar():
    with open(CATALOGO, encoding="utf-8") as f:
        return json.load(f)


def ja_tem_foto():
    if not os.path.isdir(DESTINO):
        return set()
    return {os.path.splitext(f)[0] for f in os.listdir(DESTINO)}


def faltantes(marca=None):
    tem = ja_tem_foto()
    out = []
    for p in carregar():
        if marca and (p.get("brand") or "").lower() != marca.lower():
            continue
        code = sanitizar(p.get("imageCode") or p.get("code"))
        if not code or code in tem:
            continue
        out.append((code, p.get("name", ""), p.get("brand") or ""))
    # tira codigos repetidos mantendo a ordem
    vistos, unicos = set(), []
    for c, n, b in out:
        if c in vistos:
            continue
        vistos.add(c)
        unicos.append((c, n, b))
    return unicos


def baixar(url, timeout=20, detalhe=False):
    """Devolve (bytes, extensao) ou None. Com detalhe=True devolve (None, motivo)."""
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as r:
            if r.status != 200:
                return (None, f"HTTP {r.status}") if detalhe else None
            tipo = (r.headers.get("Content-Type") or "").split(";")[0].strip().lower()
            ext = EXT_VALIDAS.get(tipo)
            if not ext:
                return (None, f"tipo {tipo or '?'}") if detalhe else None
            dados = r.read()
            if len(dados) < 3000:      # placeholder / imagem "sem foto"
                return (None, f"pequena demais ({len(dados)} bytes)") if detalhe else None
            return (dados, ext)
    except urllib.error.HTTPError as e:
        return (None, f"HTTP {e.code}") if detalhe else None
    except urllib.error.URLError as e:
        motivo = str(e.reason)
        if "CERTIFICATE_VERIFY_FAILED" in motivo:
            motivo = ("certificado. Rode:  pip install certifi   "
                      "e tente de novo. Se persistir, use --inseguro")
        return (None, motivo[:110]) if detalhe else None
    except Exception as e:
        return (None, f"{type(e).__name__}: {str(e)[:60]}") if detalhe else None


def cmd_marcas():
    tem = ja_tem_foto()
    contagem = {}
    for p in carregar():
        b = (p.get("brand") or "").strip() or "(sem marca)"
        code = sanitizar(p.get("imageCode") or p.get("code"))
        t, c = contagem.get(b, (0, 0))
        contagem[b] = (t + 1, c + (1 if code in tem else 0))
    linhas = sorted(contagem.items(), key=lambda kv: -(kv[1][0] - kv[1][1]))
    print(f"{'MARCA':24}{'TOTAL':>7}{'COM FOTO':>10}{'FALTAM':>8}")
    for b, (t, c) in linhas[:40]:
        print(f"{b[:23]:24}{t:>7}{c:>10}{t - c:>8}")


def com_foto(marca, n=8):
    """Produtos da marca que JA tem foto - servem pra validar o padrao de URL."""
    tem = ja_tem_foto()
    out = []
    for p in carregar():
        if (p.get("brand") or "").lower() != marca.lower():
            continue
        code = sanitizar(p.get("imageCode") or p.get("code"))
        if code and code in tem:
            out.append((code, p.get("name", "")))
        if len(out) >= n:
            break
    return out


def cmd_testar(marca):
    padroes = PADROES.get(marca)
    if not padroes:
        print(f"Ainda nao tenho padrao de URL pra marca '{marca}'.")
        print("Marcas configuradas:", ", ".join(PADROES) or "(nenhuma)")
        return

    referencia = com_foto(marca)
    if not referencia:
        print(f"{marca} nao tem nenhuma foto ainda, entao nao da pra validar o padrao por aqui.")
        referencia = [(c, n) for c, n, _ in faltantes(marca)[:6]]

    print(f"Validando os padroes em {len(referencia)} produtos de {marca} que JA tem foto no site.")
    print("Se o padrao estiver certo, esses tem que dar OK.\n")

    placar = {p: 0 for p in padroes}
    for idx, (code, nome) in enumerate(referencia):
        print(f"  {code}  {nome[:44]}")
        for padrao in padroes:
            url = padrao.format(code=code)
            r = baixar(url, detalhe=True)
            if r and r[0]:
                placar[padrao] += 1
                print(f"      OK        {url}")
            elif idx == 0:
                print(f"      falhou    {r[1] if r else '?'}   {url}")
        time.sleep(0.3)

    print("\nAcertos por padrao:")
    for padrao, n in sorted(placar.items(), key=lambda kv: -kv[1]):
        print(f"  {n}/{len(referencia)}  {padrao}")
    if not any(placar.values()):
        print("\nNenhum padrao funcionou. Me manda essa saida inteira que eu descubro o endereco certo.")


def baixar_texto(url, timeout=25):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout, context=CTX) as r:
        dados = r.read()
    for enc in ("utf-8", "latin-1"):
        try:
            return dados.decode(enc)
        except UnicodeDecodeError:
            continue
    return dados.decode("utf-8", "ignore")


def cmd_inspecionar(url):
    """Baixa uma pagina e mostra o que tem dentro: imagens, links de produto, codigos."""
    print(f"Abrindo {url}\n")
    try:
        html = baixar_texto(url)
    except Exception as e:
        print("Nao consegui abrir:", type(e).__name__, str(e)[:150])
        return
    print(f"Tamanho da pagina: {len(html)} caracteres\n")

    t = re.search(r"<title[^>]*>(.*?)</title>", html, re.S | re.I)
    if t:
        print("Titulo:", re.sub(r"\s+", " ", t.group(1)).strip()[:110], "\n")

    imgs = []
    for m in re.finditer(r'(?:src|data-src|data-original|content)\s*=\s*["\']([^"\']+\.(?:jpe?g|png|webp)[^"\']*)["\']', html, re.I):
        u = m.group(1)
        if u not in imgs:
            imgs.append(u)
    print(f"IMAGENS encontradas ({len(imgs)}), mostrando ate 25:")
    for u in imgs[:25]:
        print("   ", u[:150])

    links = []
    for m in re.finditer(r'href\s*=\s*["\']([^"\']*(?:produto|product|item)[^"\']*)["\']', html, re.I):
        u = m.group(1)
        if u not in links:
            links.append(u)
    if links:
        print(f"\nLINKS DE PRODUTO ({len(links)}), mostrando ate 10:")
        for u in links[:10]:
            print("   ", u[:130])

    codigos = sorted(set(re.findall(r"\b\d{12,14}\b", html)))[:10]
    if codigos:
        print("\nCODIGOS LONGOS (possiveis EAN):", ", ".join(codigos))


CA_RX = re.compile(r"\bC\.?A\.?\s*[:\-]?\s*(\d{3,6})", re.I)


def cmd_aplicar(arquivo):
    """Le um arquivo com linhas 'CA;url' ou 'codigo;url' e baixa as fotos,
    salvando uma copia para cada produto que usa aquele CA/codigo."""
    if not os.path.isfile(arquivo):
        print("Nao achei o arquivo", arquivo)
        return
    pares = []
    with open(arquivo, encoding="utf-8") as f:
        for linha in f:
            linha = linha.strip()
            if not linha or linha.startswith("#"):
                continue
            if ";" not in linha:
                continue
            chave, url = linha.split(";", 1)
            pares.append((chave.strip(), url.strip()))

    produtos = carregar()
    tem = ja_tem_foto()
    os.makedirs(DESTINO, exist_ok=True)

    total_arquivos = 0
    for chave, url in pares:
        # quais produtos essa foto atende
        alvos = []
        for p in produtos:
            code = sanitizar(p.get("imageCode") or p.get("code"))
            if not code or code in tem:
                continue
            m = CA_RX.search(p.get("name", ""))
            if (m and m.group(1) == chave) or code == chave:
                alvos.append((code, p.get("name", "")))
        if not alvos:
            print(f"[{chave}] nenhum produto sem foto usa essa chave, pulando.")
            continue

        r = baixar(url, timeout=30, detalhe=True)
        if not r or not r[0]:
            print(f"[{chave}] FALHOU baixar: {r[1] if r else '?'}")
            continue
        dados, ext = r
        for code, nome in alvos:
            with open(os.path.join(DESTINO, code + ext), "wb") as f:
                f.write(dados)
            total_arquivos += 1
        print(f"[{chave}] OK - {len(alvos)} produtos atendidos ({alvos[0][1][:45]}...)")
        time.sleep(0.3)

    print(f"\nPronto. {total_arquivos} arquivos gravados em public/produtos.")
    print("Agora rode o REMOVER-FUNDO.bat pra tirar o fundo e converter em WebP.")


def cmd_descobrir(marca):
    cfg = CHUTES.get(marca)
    if not cfg:
        print(f"Nao tenho chutes cadastrados pra '{marca}'. Cadastradas:", ", ".join(CHUTES) or "(nenhuma)")
        return

    alvos = [(c, n) for c, n, _ in faltantes(marca)[:4]]
    if not alvos:
        print("Nada faltando nessa marca.")
        return

    print(f"=== 1) Testando {len(cfg['paths'])} enderecos possiveis em {len(alvos)} produtos ===\n")
    achou_algum = False
    for code, nome in alvos:
        print(f"  {code}  {nome[:45]}")
        for path in cfg["paths"]:
            url = cfg["host"] + path.format(code=code)
            r = baixar(url, timeout=12, detalhe=True)
            if r and r[0]:
                achou_algum = True
                print(f"      >>> ACHOU  {url}")
        time.sleep(0.2)
    if not achou_algum:
        print("      nenhum endereco direto funcionou.")

    print(f"\n=== 2) Procurando os codigos dentro das paginas do catalogo ===")
    codes = [c for c, _ in alvos]
    for pag in cfg.get("paginas", []):
        url = cfg["host"] + pag
        print(f"\n  {url}")
        try:
            html = baixar_texto(url)
        except Exception as e:
            print("     nao abriu:", type(e).__name__, str(e)[:90])
            continue
        print(f"     {len(html)} caracteres")
        for code in codes:
            if code in html:
                i = html.find(code)
                trecho = re.sub(r"\s+", " ", html[max(0, i - 160):i + 160])
                print(f"     codigo {code} aparece: ...{trecho}...")
        scripts = re.findall(r'<script[^>]+src\s*=\s*["\']([^"\']+)["\']', html, re.I)[:12]
        if scripts:
            print("     scripts da pagina:")
            for sc in scripts:
                print("       ", sc[:120])
        endpoints = sorted(set(re.findall(r'["\']([^"\']*(?:ajax|api|json|lista|busca|produtos?)[^"\']*\.(?:php|asp|aspx|json)[^"\']*)["\']', html, re.I)))[:12]
        if endpoints:
            print("     possiveis endpoints de dados:")
            for e in endpoints:
                print("       ", e[:120])


def cmd_baixar(marca, limite=None):
    padroes = PADROES.get(marca)
    if not padroes:
        print(f"Ainda nao tenho padrao de URL pra marca '{marca}'. Rode --marcas pra ver a lista.")
        return
    os.makedirs(DESTINO, exist_ok=True)
    alvos = faltantes(marca)
    if limite:
        alvos = alvos[:limite]
    print(f"{marca}: {len(alvos)} produtos sem foto. Comecando...\n")
    ok = 0
    for i, (code, nome, _) in enumerate(alvos, 1):
        resultado = None
        for padrao in padroes:
            resultado = baixar(padrao.format(code=code))
            if resultado:
                break
        if resultado:
            dados, ext = resultado
            with open(os.path.join(DESTINO, code + ext), "wb") as f:
                f.write(dados)
            ok += 1
            print(f"[{i}/{len(alvos)}] OK   {code}  {nome[:45]}")
        else:
            print(f"[{i}/{len(alvos)}] --   {code}  {nome[:45]}")
        time.sleep(0.3)
    print(f"\nPronto. {ok} fotos baixadas de {len(alvos)} tentativas.")
    print("Agora rode o REMOVER-FUNDO.bat pra limpar o fundo e converter em WebP.")


def main():
    args = [a for a in sys.argv[1:] if a != "--inseguro"]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
        return
    if args[0] == "--marcas":
        cmd_marcas()
    elif args[0] == "--aplicar":
        if len(args) < 2:
            print("Uso: python buscar-fotos.py --aplicar fotos.txt")
            return
        cmd_aplicar(args[1])
    elif args[0] == "--descobrir":
        if len(args) < 2:
            print("Uso: python buscar-fotos.py --descobrir <Marca>")
            return
        cmd_descobrir(args[1])
    elif args[0] == "--inspecionar":
        if len(args) < 2:
            print("Uso: python buscar-fotos.py --inspecionar <url>")
            return
        cmd_inspecionar(args[1])
    elif args[0] == "--testar":
        if len(args) < 2:
            print("Uso: python buscar-fotos.py --testar <Marca>")
            return
        cmd_testar(args[1])
    else:
        marca = args[0]
        limite = None
        if "--limite" in args:
            limite = int(args[args.index("--limite") + 1])
        cmd_baixar(marca, limite)


if __name__ == "__main__":
    main()
