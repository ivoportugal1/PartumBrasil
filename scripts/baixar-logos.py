"""
Baixa os logos das marcas parceiras para public/marcas/.

    python scripts/baixar-logos.py

Precisa de internet, entao roda no seu PC.
Camper e Steelflex ficam de fora: nao achei arquivo bom, peca ao representante.
"""
import os, ssl, sys, urllib.request

sys.stdout.reconfigure(encoding="utf-8")

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, "public", "marcas")

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/125.0 Safari/537.36"}

LOGOS = {
    "kalipso.svg":      "https://kalipso.com.br/img/logo.svg",
    "kadesh.png":       "https://kadeshepi.com.br/wp-content/uploads/2026/04/logo_kadesh.png",
    "volk.png":         "https://www.volkdobrasil.com.br/wp-content/uploads/2024/07/logo-branca.png",
    "3m.png":           "https://logodownload.org/wp-content/uploads/2015/12/3m-logo-11.png",
    "msa.png":          "https://companieslogo.com/img/orig/MSA_BIG-298ca6b5.png",
    "rhino.png":        "https://rhinocalcados.com.br/wp-content/uploads/2024/03/Logo-Preta-Site-300x71.png",
    "ultra-master.png": "https://www.ultramasterplug.com.br/assets/ump-logo-light-DJudKqaA.png",
}

def contexto():
    if "--inseguro" in sys.argv:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
    else:
        try:
            import certifi
            ctx = ssl.create_default_context(cafile=certifi.where())
        except ImportError:
            ctx = ssl.create_default_context()
    for c in ("DEFAULT@SECLEVEL=0", "DEFAULT@SECLEVEL=1"):
        try:
            ctx.set_ciphers(c); break
        except ssl.SSLError:
            continue
    return ctx

CTX = contexto()

def main():
    os.makedirs(DESTINO, exist_ok=True)
    ok = erro = 0
    for nome, url in LOGOS.items():
        caminho = os.path.join(DESTINO, nome)
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=30, context=CTX) as r:
                dados = r.read()
            if len(dados) < 300:
                print(f"{nome:18} pequeno demais ({len(dados)} bytes), pulando")
                erro += 1
                continue
            with open(caminho, "wb") as f:
                f.write(dados)
            print(f"{nome:18} OK  ({len(dados)//1024} KB)")
            ok += 1
        except Exception as e:
            print(f"{nome:18} ERRO: {type(e).__name__}: {str(e)[:70]}")
            erro += 1

    print(f"\n{ok} logos baixados, {erro} falharam, em public/marcas/")
    if erro:
        print("Se deu erro de certificado, tente:  python scripts/baixar-logos.py --inseguro")

if __name__ == "__main__":
    main()
