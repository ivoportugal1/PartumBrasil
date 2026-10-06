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



# ---------------------------------------------------------------- EPI e calçados
import math

NOVOS = {"botapvc", "botacouro", "botina", "coturno", "sapato", "tenis", "babuche", "luva", "pff",
         "semifacial", "facial", "mascaradesc", "filtro", "perneira", "mangote", "bainha", "oculos",
         "oculosampla", "capacete"}


def er(b, box, fill, outline=None, w=5):
    """Elipse com cor RGBA arbitrária."""
    bb = [v * S for v in box]
    b.d.ellipse(bb, fill=fill, outline=(outline or b.dk) + (255,), width=w * S)


def arco(cx, cy, rx, ry, a0, a1, n=28):
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy - ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def sola(b, cor):
    d = tom(cor, 0.5)
    b.p([(100, 790), (872, 790), (884, 862), (112, 868)], cor, True, 4)
    b.p([(640, 800), (872, 800), (884, 872), (650, 874)], d, False)
    for x in range(150, 640, 55):
        b.l([(x, 836), (x + 24, 836)], d, 4)


def calcado(b, tipo, bico="x"):
    c = b.c
    sl, sr = 395, 655
    if tipo in ("botapvc", "botacouro", "botina", "coturno"):
        top = {"botapvc": 170, "botacouro": 250, "coturno": 250, "botina": 430}[tipo]
        pts = [(sl, top), (sr, top), (sr + 12, 560), (760, 610), (850, 680), (868, 800), (130, 800),
               (112, 730), (150, 640), (270, 590), (sl, 570)]
    else:
        top = 540
        pts = [(330, top), (650, top), (705, 610), (790, 640), (860, 700), (868, 800), (130, 800),
               (112, 730), (150, 650), (280, 600)]
    b.p(pts)
    interior = tom(c, 0.3)
    if top < 500:
        er(b, (sl, top - 16, sr, top + 26), interior + (255,), None, 3)
    else:
        b.p([(355, 540), (625, 540), (610, 580), (375, 585)], interior, False)
    soc = (70, 72, 78) if tipo != "tenis" else (246, 246, 246)
    if tipo == "botapvc":
        soc = tom(c, 0.45) if c != (34, 34, 38) else (70, 72, 78)
        for y in (260, 360, 460):
            b.l([(sl + 4, y), (sr - 2, y)], tom(c, 0.8), 3)
        b.p([(sl, top), (sr, top), (sr, top + 34), (sl, top + 34)], tom(c, 1.12), True, 3)
        b.l([(sl + 30, top + 60), (sl + 30, 560)], b.lt, 8)
    if tipo in ("botacouro", "coturno", "botina"):
        b.p([(sl, top), (sr, top), (sr, top + 46), (sl, top + 46)], tom(c, 1.2), True, 3)
        b.l([(sl + 8, top + 62), (sr - 8, top + 62)], tom(c, 1.3), 3)
        b.l([(285, 700), (560, 690), (740, 700)], tom(c, 1.25), 3)
    if tipo == "coturno":
        for i in range(6):
            x0, y0 = sl + 20 + i * 4, top + 80 + i * 55
            b.l([(x0, y0), (x0 + 110, y0 + 12)], (225, 225, 225), 5)
            b.e((x0 - 6, y0 - 6, x0 + 6, y0 + 6), (225, 225, 225), False)
    if tipo == "botina":
        b.p([(sl + 20, 470), (sr - 20, 470), (sr - 20, 560), (sl + 20, 560)], tom(c, 0.65), True, 3)
        b.l([(sl + 20, 500), (sr - 20, 500)], tom(c, 0.9), 3)
        b.l([(sl + 20, 530), (sr - 20, 530)], tom(c, 0.9), 3)
    if tipo == "sapato":
        b.p([(330, top), (650, top), (640, 600), (340, 590)], tom(c, 0.7), True, 3)
        for i in range(5):
            x0 = 365 + i * 55
            b.l([(x0, 548 + i * 7), (x0 + 38, 585 + i * 5)], (230, 230, 230), 5)
    if tipo == "tenis":
        b.p([(330, top), (650, top), (640, 600), (340, 590)], tom(c, 0.8), True, 3)
        for i in range(5):
            x0 = 365 + i * 55
            b.l([(x0, 548 + i * 7), (x0 + 38, 585 + i * 5)], (245, 245, 245), 6)
        b.p([(300, 700), (560, 690), (720, 650), (760, 700), (560, 740), (300, 750)], (245, 245, 245), True, 3)
    if bico in ("composite", "aco"):
        cap = [(112, 730), (150, 640), (270, 590), (322, 660), (322, 800), (130, 800)]
        if bico == "composite":
            b.p(cap, (112, 116, 126), True, 4)
            b.l([(150, 700), (290, 640)], (170, 174, 184), 5)
        else:
            b.p(cap, (196, 202, 212), True, 4)
            b.l([(150, 700), (290, 640)], (250, 250, 252), 6)
    sola(b, soc)


def babuche(b):
    c = b.c
    b.p([(150, 690), (190, 610), (340, 560), (560, 545), (730, 590), (850, 690), (870, 790), (130, 790)])
    b.p([(730, 590), (868, 545), (905, 650), (868, 720), (850, 690)], tom(c, 0.85), True, 4)
    b.p([(110, 780), (880, 780), (892, 850), (122, 858)], tom(c, 0.7), True, 4)
    for (x, y) in [(300, 620), (370, 600), (440, 590), (510, 590), (580, 600), (660, 630), (420, 650), (500, 650),
                   (580, 660), (350, 670), (660, 690), (250, 700)]:
        er(b, (x - 14, y - 14, x + 14, y + 14), tom(c, 0.35) + (255,), None, 2)


def mao(b, mat, cano):
    c = b.c
    cuff = 930 if cano == "longo" else 740
    palm = [(330, 380), (650, 380), (672, 560), (630, 650), (360, 650), (325, 560)]
    dedos = [(372, 235), (452, 180), (532, 165), (612, 205)]
    larg = 76
    revest = mat in ("pigmentada", "pu", "anticorte")
    dorso = tom(c, 1.12) if revest else c
    polegar = [(655, 520), (742, 440), (808, 470), (792, 545), (705, 640), (655, 610)]
    b.p(polegar, dorso)
    b.p(palm, dorso)
    for cx, top in dedos:
        pts = [(cx - larg / 2, 420)] + arco(cx, top + larg / 2, larg / 2, larg / 2, 180, 0, 14) + [(cx + larg / 2, 420)]
        b.p(pts, dorso)
    for x in (410, 492, 572):
        b.l([(x, 400), (x, 470)], b.dk, 3)
    pun = {"isolante": (240, 122, 26), "termica": (196, 40, 32), "anticorte": (31, 78, 178)}.get(mat, c)
    b.p([(345, 648), (635, 648), (652, cuff), (328, cuff)], pun, True, 5)
    b.l([(345, 672), (635, 672)], tom(pun, 0.7), 4)
    b.l([(340, cuff - 22), (642, cuff - 22)], tom(pun, 0.7), 4)
    if revest:
        for cx, top in dedos:
            b.p([(cx - larg / 2 + 4, 330), (cx + larg / 2 - 4, 330), (cx + larg / 2 - 4, 410), (cx - larg / 2 + 4, 410)], tom(c, 0.55), False)
        b.p([(342, 470), (640, 470), (655, 560), (620, 640), (365, 640), (335, 560)], tom(c, 0.55), False)
    if mat == "malha":
        for x in range(340, 650, 26):
            b.l([(x, 380), (x + 40, 640)], tom(c, 0.88), 2)
            b.l([(x + 40, 380), (x, 640)], tom(c, 0.88), 2)


def mascara_pff(b, valv):
    c = b.c
    for sgn in (-1, 1):
        x = 500 + sgn * 255
        b.l([(x, 420), (x + sgn * 150, 400), (x + sgn * 190, 520), (x + sgn * 150, 640), (x + sgn * 5, 610)], tom(c, 0.6), 7)
    b.p(arco(500, 520, 260, 235, 0, 360, 40), c, True, 5)
    b.l([(260, 500), (500, 560), (740, 500)], tom(c, 0.75), 4)
    b.l([(285, 600), (500, 650), (715, 600)], tom(c, 0.75), 4)
    b.p([(430, 315), (570, 315), (580, 345), (420, 345)], (190, 194, 200), True, 3)
    if valv:
        er(b, (435, 455, 565, 585), (205, 208, 214, 255), None, 4)
        er(b, (465, 485, 535, 555), (120, 124, 132, 255), None, 3)
        for y in (500, 520, 540):
            b.l([(472, y), (528, y)], (205, 208, 214), 3)


def mascara_semi(b):
    c = b.c
    for sgn in (-1, 1):
        x = 500 + sgn * 330
        b.l([(x, 480), (x + sgn * 120, 420), (x + sgn * 110, 600), (x, 600)], tom(c, 0.5), 6)
    b.p([(300, 360), (700, 360), (760, 520), (700, 690), (500, 780), (300, 690), (240, 520)], c, True, 5)
    for sgn in (-1, 1):
        cx = 500 + sgn * 260
        er(b, (cx - 95, 450, cx + 95, 640), (60, 64, 72, 255), None, 5)
        er(b, (cx - 60, 485, cx + 60, 605), (150, 154, 162, 255), None, 3)
    er(b, (450, 600, 550, 690), (205, 208, 214, 255), None, 4)
    b.p([(300, 360), (700, 360), (690, 420), (310, 420)], tom(c, 1.15), False)


def mascara_facial(b):
    c = b.c
    for sgn in (-1, 1):
        x = 500 + sgn * 320
        b.l([(x, 380), (x + sgn * 110, 330), (x + sgn * 110, 600), (x, 650)], tom(c, 0.55), 6)
    b.p(arco(500, 480, 320, 380, 0, 360, 44), c, True, 6)
    b.p(arco(500, 410, 250, 200, 0, 360, 36), (186, 214, 236), True, 5)
    b.p([(330, 330), (440, 280), (420, 330), (350, 380)], (240, 248, 255), False)
    er(b, (410, 680, 590, 800), (205, 208, 214, 255), None, 4)
    er(b, (440, 705, 560, 775), (90, 94, 102, 255), None, 3)


def mascara_desc(b):
    c = b.c
    for sgn in (-1, 1):
        x = 500 + sgn * 250
        b.l([(x, 440), (x + sgn * 140, 410), (x + sgn * 160, 560), (x + sgn * 10, 560)], tom(c, 0.65), 6)
    b.p([(255, 380), (745, 380), (765, 580), (500, 660), (235, 580)], c, True, 5)
    for y in (450, 520, 580):
        b.l([(260, y), (500, y + 40), (740, y)], tom(c, 0.8), 4)
    b.p([(430, 365), (570, 365), (575, 385), (425, 385)], (190, 194, 200), True, 2)


def filtro(b, quimico):
    if quimico:
        corpo, topo = (52, 54, 60), (242, 197, 0)
    else:
        corpo, topo = (244, 244, 244), (232, 130, 170)
    er(b, (250, 620, 750, 780), corpo + (255,), None, 5)
    b.p([(250, 380), (750, 380), (750, 700), (250, 700)], corpo, False)
    b.l([(250, 380), (250, 700)], b.dk, 5)
    b.l([(750, 380), (750, 700)], b.dk, 5)
    er(b, (250, 290, 750, 470), topo + (255,), None, 5)
    er(b, (330, 320, 670, 440), tom(topo, 0.8) + (255,), None, 3)
    for x in range(330, 700, 70):
        b.l([(x, 480), (x, 660)], tom(corpo, 0.7 if quimico else 0.85), 3)
    b.p([(250, 560), (750, 560), (750, 610), (250, 610)], topo, False)


def perneira(b):
    c = b.c
    b.p([(390, 120), (610, 120), (655, 860), (345, 860)])
    b.l([(500, 150), (500, 840)], tom(c, 0.8), 3)
    for y in (260, 480, 700):
        b.p([(372, y), (628, y), (632, y + 70), (368, y + 70)], tom(c, 0.72), True, 4)
        b.p([(540, y + 14), (590, y + 14), (590, y + 56), (540, y + 56)], (200, 204, 210), True, 3)
    b.p([(345, 800), (655, 800), (660, 870), (340, 870)], tom(c, 0.85), True, 4)


def mangote(b):
    c = b.c
    b.p([(335, 150), (665, 150), (600, 850), (400, 850)])
    b.p([(335, 150), (665, 150), (660, 215), (340, 215)], tom(c, 0.62), True, 4)
    b.p([(405, 790), (595, 790), (600, 850), (400, 850)], tom(c, 0.62), True, 4)
    b.l([(480, 230), (470, 780)], tom(c, 0.85), 3)
    b.l([(540, 230), (535, 780)], tom(c, 0.85), 3)
    b.p([(360, 420), (640, 420), (630, 470), (370, 470)], tom(c, 0.75), True, 3)


def bainha(b):
    c = b.c
    b.p([(380, 160), (620, 160), (650, 800), (500, 900), (350, 800)])
    b.p([(380, 100), (620, 100), (620, 200), (380, 200)], tom(c, 0.7), True, 4)
    b.p([(430, 120), (570, 120), (570, 180), (430, 180)], tom(c, 0.45), False)
    b.l([(405, 230), (415, 790)], tom(c, 0.55), 3)
    b.l([(595, 230), (585, 790)], tom(c, 0.55), 3)


def oculos(b, lente, ampla=False):
    lentes = {"incolor": (205, 228, 246, 150), "escuro": (62, 66, 74, 235), "ambar": (238, 172, 40, 215)}[lente]
    quadro = (40, 44, 52)
    if ampla:
        for sgn in (-1, 1):
            b.l([(500 + sgn * 345, 490), (500 + sgn * 470, 520)], (60, 64, 72), 36)
        b.p([(150, 380), (850, 380), (880, 560), (820, 640), (180, 640), (120, 560)], quadro, True, 4)
        pts = [(185, 415), (815, 415), (840, 550), (790, 605), (210, 605), (160, 550)]
        b.d.polygon([(x * S, y * S) for x, y in pts], fill=lentes)
        for x in range(300, 720, 80):
            er(b, (x - 9, 392, x + 9, 408), (190, 194, 200, 255), None, 2)
        b.p([(230, 440), (420, 440), (370, 520), (210, 520)], (255, 255, 255), False)
        return
    for sgn in (-1, 1):
        b.l([(500 + sgn * 345, 450), (500 + sgn * 430, 470)], quadro, 14)
    for (x0, x1) in ((140, 480), (520, 860)):
        b.p([(x0, 390), (x1, 390), (x1 + (10 if x0 > 300 else 0), 560), (x1 - 80, 620), (x0 + 80, 620), (x0 - (10 if x0 < 300 else 0), 560)], quadro, True, 4)
        pts = [(x0 + 22, 410), (x1 - 22, 410), (x1 - 12, 555), (x1 - 90, 598), (x0 + 90, 598), (x0 + 12, 555)]
        b.d.polygon([(x * S, y * S) for x, y in pts], fill=lentes)
    b.l([(480, 450), (520, 450)], quadro, 16)
    for (x0, x1) in ((140, 480), (520, 860)):
        b.p([(x0 + 40, 430), (x0 + 150, 430), (x0 + 110, 500), (x0 + 36, 500)], (255, 255, 255), False)


def capacete(b, jugular):
    c = b.c
    dome = arco(500, 560, 300, 340, 180, 0, 36)
    b.p(dome + [(800, 560)], c, True, 6)
    b.p([(470, 230), (530, 230), (548, 560), (452, 560)], tom(c, 0.84), False)
    b.l([(470, 230), (452, 560)], tom(c, 0.62), 4)
    b.l([(530, 230), (548, 560)], tom(c, 0.62), 4)
    b.p([(175, 560), (825, 560), (870, 640), (130, 640)], tom(c, 0.8), True, 5)
    b.p(arco(440, 540, 210, 230, 130, 60, 12) + [(600, 540)], tom(c, 1.16), False)
    if jugular:
        b.l([(250, 640), (290, 800), (500, 860), (710, 800), (750, 640)], (40, 44, 52), 9)
        b.p([(470, 835), (530, 835), (530, 885), (470, 885)], (200, 204, 210), True, 3)


def render_epi(chave):
    t = chave.split("-")
    tipo = t[0]
    cor = t[1] if len(t) > 1 else "cinza"
    base = CORES.get(cor, CORES["cinza"])
    if tipo == "luva":
        mat, cor2, cano = t[1], t[2], t[3]
        base = CORES.get(cor2, CORES["cinza"])
        if mat == "vaqueta": base = (206, 170, 120)
        if mat == "raspa": base = (190, 150, 105)
        b = Pincel(base, 200 if mat == "descartavel" else 255)
        mao(b, mat, cano)
        return b.fim()
    if tipo in ("botapvc", "botacouro", "botina", "coturno", "sapato", "tenis", "babuche"):
        if tipo == "botacouro" and cor == "marrom": base = (112, 76, 50)
        b = Pincel(base)
        if tipo == "babuche": babuche(b)
        else: calcado(b, tipo, t[2] if tipo == "botacouro" else "x")
        return b.fim()
    if tipo == "pff":
        b = Pincel(base); mascara_pff(b, t[2] == "valv"); return b.fim()
    if tipo == "semifacial":
        b = Pincel((86, 96, 110)); mascara_semi(b); return b.fim()
    if tipo == "facial":
        b = Pincel((54, 58, 66)); mascara_facial(b); return b.fim()
    if tipo == "mascaradesc":
        b = Pincel(base); mascara_desc(b); return b.fim()
    if tipo == "filtro":
        b = Pincel(base); filtro(b, cor == "quimico"); return b.fim()
    if tipo == "perneira":
        b = Pincel((196, 162, 118) if cor == "bege" else (122, 82, 52) if cor == "marrom" else base); perneira(b); return b.fim()
    if tipo == "mangote":
        b = Pincel((196, 162, 118) if cor == "bege" else base); mangote(b); return b.fim()
    if tipo == "bainha":
        b = Pincel((122, 82, 52)); bainha(b); return b.fim()
    if tipo in ("oculos", "oculosampla"):
        b = Pincel((60, 64, 72)); oculos(b, cor, tipo == "oculosampla"); return b.fim()
    if tipo == "capacete":
        b = Pincel(base); capacete(b, t[2] == "j"); return b.fim()
    return None


def renderiza(chave):
    if chave.split("-")[0] in NOVOS:
        return render_epi(chave)
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
