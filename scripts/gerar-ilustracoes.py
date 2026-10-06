"""Gera as ilustrações genéricas (public/ilustracoes/<chave>.webp) usadas quando o
produto (uniforme, tecido etc.) não tem foto. A chave vem de lib/ilustracao-generica.ts:
    tipo-cor-manga-faixa    (ex.: camisa-royal-longa-faixa)

Uso:  python scripts/gerar-ilustracoes.py chaves.json
onde chaves.json é uma lista de chaves. Sem argumento, gera todas as combinações."""
import json, os, sys, itertools
from PIL import Image, ImageDraw, ImageFilter

S = 2                      # supersampling
W = 1000
SAIDA = os.path.join(os.path.dirname(__file__), "..", "public", "ilustracoes")

CORES = {
    "marinho": (24, 38, 84), "royal": (31, 78, 178), "azul": (44, 100, 180), "celeste": (130, 185, 230),
    "chumbo": (72, 78, 88), "cinza": (140, 146, 156), "petroleo": (22, 98, 110), "limao": (150, 190, 40),
    "verde": (44, 128, 70), "laranja": (240, 122, 26), "amarelo": (242, 197, 0), "vermelho": (196, 40, 32),
    "branco": (244, 244, 244), "preto": (34, 34, 38), "marrom": (110, 76, 50), "bege": (205, 185, 150),
    "prata": (190, 194, 200), "rosa": (232, 130, 170), "roxo": (110, 70, 160), "transparente": (190, 215, 235),
}


def tom(c, f):
    return tuple(max(0, min(255, int(v * f))) for v in c)


class Pincel:
    def __init__(self, cor, alpha=255):
        self.im = Image.new("RGBA", (W * S, W * S), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)
        self.c = cor
        self.dk = tom(cor, 0.68)
        self.lt = tom(cor, 1.16)
        self.a = alpha

    def p(self, pts, f=None, linha=True, w=5):
        f = f or self.c
        pts = [(x * S, y * S) for x, y in pts]
        self.d.polygon(pts, fill=f + (self.a,), outline=None)
        if linha:
            self.d.line(pts + [pts[0]], fill=self.dk + (255,), width=w * S, joint="curve")

    def l(self, pts, cor=None, w=4):
        self.d.line([(x * S, y * S) for x, y in pts], fill=(cor or self.dk) + (255,), width=w * S, joint="curve")

    def e(self, box, f=None, linha=True):
        b = [v * S for v in box]
        self.d.ellipse(b, fill=(f or self.c) + (self.a,), outline=(self.dk + (255,)) if linha else None, width=5 * S)

    def r(self, box, f, linha=False):
        b = [v * S for v in box]
        self.d.rectangle(b, fill=f + (255,), outline=(self.dk + (255,)) if linha else None, width=3 * S)

    def fim(self):
        sombra = Image.new("RGBA", self.im.size, (0, 0, 0, 0))
        alfa = self.im.split()[3].filter(ImageFilter.GaussianBlur(14 * S))
        sombra.putalpha(alfa.point(lambda v: int(v * 0.22)))
        sombra = sombra.transform(sombra.size, Image.AFFINE, (1, 0, 0, 0, 1, -10 * S))
        out = Image.alpha_composite(sombra, self.im)
        return out.resize((W, W), Image.LANCZOS)


PRATA = (205, 208, 214)
PRATA_ESC = (150, 154, 162)


def faixas_h(b, y, x0, x1, n=2, gap=34, esp=22):
    for i in range(n):
        yy = y + i * gap
        b.r((x0, yy, x1, yy + esp), PRATA)
        b.r((x0, yy, x1, yy + 4), PRATA_ESC)


def camisa(b, manga, faixa, gola_v=False, comprimento=820):
    top = 215
    corpo = [(330, top), (670, top), (700, 262), (722, comprimento), (278, comprimento), (300, 262)]
    if manga == "curta":
        mL = [(330, top), (255, 250), (150, 430), (252, 480), (302, 330)]
    else:
        mL = [(318, 232), (205, 300), (118, 735), (216, 762), (302, 440)]
    mR = [(1000 - x, y) for x, y in mL]
    b.p(mL), b.p(mR), b.p(corpo)
    if faixa:
        faixas_h(b, 600, 279, 721)
        if manga == "curta":
            pass
        else:
            for (x0, x1, yy) in [(150, 245, 610), (755, 850, 610)]:
                faixas_h(b, yy, x0, x1, 1)
    # colarinho / gola
    if gola_v:
        b.p([(420, 205), (580, 205), (500, 340)], tom(b.c, 0.8), True)
    else:
        b.p([(410, 203), (500, 215), (500, 320), (440, 300)], b.lt)
        b.p([(590, 203), (500, 215), (500, 320), (560, 300)], b.lt)
        b.l([(500, 320), (500, comprimento)], w=4)
        for yy in range(380, comprimento - 40, 95):
            b.e((492, yy, 508, yy + 16), tom(b.c, 0.55), False)
        b.p([(545, 345), (645, 345), (645, 425), (595, 450), (545, 425)], b.c, True, 4)
    b.l([(330, top + 6), (300, 262)], w=3)


def calca(b, faixa):
    perna = [(330, 205), (670, 205), (692, 380), (652, 880), (522, 880), (500, 440), (478, 880), (348, 880), (308, 380)]
    b.p(perna)
    b.r((330, 205, 670, 252), tom(b.c, 0.85))
    b.l([(330, 252), (670, 252)], w=3)
    for x in (360, 470, 530, 640):
        b.r((x, 198, x + 14, 262), tom(b.c, 0.7))
    b.l([(500, 252), (500, 440)], w=4)
    b.l([(500, 440), (520, 880)], w=3)
    b.l([(500, 440), (480, 880)], w=3)
    b.l([(335, 290), (395, 330), (400, 400)], w=4)
    b.l([(665, 290), (605, 330), (600, 400)], w=4)
    if faixa:
        faixas_h(b, 640, 342, 505, 2)
        faixas_h(b, 640, 495, 658, 2)


def macacao(b, faixa):
    camisa(b, "longa", False, comprimento=520)
    b.p([(278, 520), (722, 520), (704, 880), (532, 880), (500, 600), (468, 880), (296, 880)])
    b.l([(500, 320), (500, 600)], w=5)
    b.l([(500, 600), (532, 880)], w=3)
    b.l([(500, 600), (468, 880)], w=3)
    b.r((278, 500, 722, 540), tom(b.c, 0.85))
    if faixa:
        faixas_h(b, 650, 300, 480, 2)
        faixas_h(b, 650, 520, 700, 2)


def colete(b):
    esq = [(325, 205), (440, 205), (500, 400), (500, 860), (305, 860), (292, 300)]
    dir_ = [(1000 - x, y) for x, y in esq]
    b.p(esq), b.p(dir_)
    b.p([(440, 205), (560, 205), (500, 400)], tom(b.c, 0.78))
    for x0 in (330, 640):
        b.r((x0, 330, x0 + 30, 860), PRATA)
    for x0 in (470, 500):
        pass
    faixas_h(b, 560, 300, 500, 1)
    faixas_h(b, 560, 500, 700, 1)
    faixas_h(b, 700, 305, 500, 1)
    faixas_h(b, 700, 500, 695, 1)
    b.l([(500, 400), (500, 860)], w=5)


def capa(b, transp):
    corpo = [(320, 260), (680, 260), (740, 880), (260, 880)]
    mL = [(325, 262), (225, 330), (150, 760), (240, 780), (310, 440)]
    mR = [(1000 - x, y) for x, y in mL]
    b.p(mL), b.p(mR), b.p(corpo)
    b.e((395, 120, 605, 300), tom(b.c, 0.9))
    b.e((430, 165, 570, 300), tom(b.c, 0.6) if not transp else (150, 180, 205))
    b.l([(500, 300), (500, 880)], w=4)
    for yy in range(340, 860, 110):
        b.e((490, yy, 510, yy + 20), tom(b.c, 0.5), False)


def avental(b):
    b.l([(420, 215), (500, 120), (580, 215)], w=9)
    b.p([(405, 215), (595, 215), (610, 420), (680, 430), (700, 880), (300, 880), (320, 430), (390, 420)])
    b.p([(390, 560), (610, 560), (610, 700), (390, 700)], b.c, True, 4)
    b.l([(500, 560), (500, 700)], w=3)


def jaleco(b):
    camisa(b, "longa", False, comprimento=900)
    b.p([(440, 215), (500, 400), (560, 215)], tom(b.c, 0.78))
    b.p([(300, 620), (400, 620), (400, 720), (300, 720)], b.c, True, 4)
    b.p([(600, 620), (700, 620), (700, 720), (600, 720)], b.c, True, 4)


def touca(b):
    b.e((330, 230, 670, 560))
    b.p([(318, 470), (682, 470), (730, 640), (690, 690), (500, 600), (310, 690), (270, 640)], tom(b.c, 0.92))
    b.l([(335, 470), (665, 470)], w=4)
    b.l([(500, 235), (500, 470)], w=3)


def faixa_rolo(b):
    b.r((130, 400, 870, 560), PRATA)
    b.r((130, 400, 870, 420), PRATA_ESC)
    b.r((130, 540, 870, 560), PRATA_ESC)
    for x in range(160, 860, 70):
        b.p([(x, 420), (x + 36, 420), (x + 6, 540), (x - 30, 540)], (230, 232, 236), False)
    b.r((130, 478, 870, 482), tom(b.c, 0.7))


def tecido(b):
    import math
    n = 9
    larg = 760 / n
    for i in range(n):
        x0, x1 = 120 + i * larg, 120 + (i + 1) * larg
        def topo(x): return 300 + 28 * math.sin(x / 70.0)
        def base(x): return 720 + 28 * math.sin(x / 70.0 + 1.2)
        f = tom(b.c, 0.88 if i % 2 else 1.1)
        b.p([(x0, topo(x0)), (x1, topo(x1)), (x1, base(x1)), (x0, base(x0))], f, False)
    for i in range(1, n):
        x = 120 + i * larg
        b.l([(x, topo(x)), (x, base(x))], tom(b.c, 0.78), 2)
    for yy in range(340, 700, 26):
        b.l([(130, yy), (870, yy + 8)], tom(b.c, 0.93), 1)


def renderiza(chave):
    tipo, cor, manga, faixa = chave.split("-")
    base = CORES.get(cor, CORES["cinza"])
    transp = cor == "transparente"
    if tipo == "conjunto":
        a, c = Pincel(base), Pincel(base)
        camisa(a, manga, faixa == "faixa"), calca(c, faixa == "faixa")
        ia, ic = a.fim().resize((620, 620), Image.LANCZOS), c.fim().resize((620, 620), Image.LANCZOS)
        im = Image.new("RGBA", (W, W), (0, 0, 0, 0))
        im.alpha_composite(ia, (-70, 190)), im.alpha_composite(ic, (450, 190))
        return im
    b = Pincel(base, 190 if (transp and tipo == "capa") else 255)
    if tipo == "camisa": camisa(b, manga, faixa == "faixa", gola_v=False)
    elif tipo == "calca": calca(b, faixa == "faixa")
    elif tipo == "macacao": macacao(b, faixa == "faixa")
    elif tipo == "colete": colete(b)
    elif tipo == "capa": capa(b, transp)
    elif tipo == "avental": avental(b)
    elif tipo == "jaleco": jaleco(b)
    elif tipo == "touca": touca(b)
    elif tipo == "faixa": faixa_rolo(b)
    elif tipo == "tecido": tecido(b)
    else: return None
    return b.fim()


def main():
    os.makedirs(SAIDA, exist_ok=True)
    if len(sys.argv) > 1:
        chaves = json.load(open(sys.argv[1], encoding="utf-8"))
    else:
        chaves = []
        for cor in CORES:
            for t in ("calca", "macacao", "colete", "capa", "avental", "jaleco", "touca", "faixa", "tecido"):
                chaves.append(f"{t}-{cor}-x-x")
    n = 0
    for k in chaves:
        im = renderiza(k)
        if im is None:
            continue
        bb = im.getbbox()
        if bb:
            im = im.crop(bb)
            lado = max(im.size)
            tela = Image.new("RGBA", (lado + 60, lado + 60), (0, 0, 0, 0))
            tela.alpha_composite(im, ((lado + 60 - im.width) // 2, (lado + 60 - im.height) // 2))
            im = tela.resize((700, 700), Image.LANCZOS)
        im.save(os.path.join(SAIDA, k + ".webp"), "WEBP", quality=88)
        n += 1
    print(n, "ilustrações geradas em", os.path.abspath(SAIDA))


if __name__ == "__main__":
    main()
