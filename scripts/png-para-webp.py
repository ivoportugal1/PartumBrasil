"""
Converte as imagens de public/produtos para WebP mantendo a transparencia.

    python scripts/png-para-webp.py

WebP com alpha fica visualmente igual ao PNG e ocupa bem menos.
O site ja procura .webp primeiro, entao tambem carrega mais rapido.
Pode parar com Ctrl+C e rodar de novo: continua de onde parou.
"""
import sys, os
sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image

PASTA = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                     '..', 'public', 'produtos'))
ORIGEM = {'.png', '.jpg', '.jpeg'}
QUALIDADE = 85

def mb(n):
    return n / (1024 * 1024)

def main():
    alvos = [f for f in sorted(os.listdir(PASTA))
             if os.path.splitext(f)[1].lower() in ORIGEM]
    total = len(alvos)
    antes = sum(os.path.getsize(os.path.join(PASTA, f)) for f in os.listdir(PASTA))
    print(f'Pasta: {PASTA}')
    print(f'{total} imagens para converter. Tamanho atual: {mb(antes):.0f} MB\n')
    if not total:
        return

    feitos = erros = pulados = 0
    for i, nome in enumerate(alvos, 1):
        caminho = os.path.join(PASTA, nome)
        base, _ = os.path.splitext(caminho)
        saida = base + '.webp'
        if os.path.exists(saida):
            os.remove(caminho)          # ja existe webp, o outro e sobra
            pulados += 1
            continue
        try:
            img = Image.open(caminho)
            if img.mode not in ('RGBA', 'RGB'):
                img = img.convert('RGBA' if 'A' in img.mode or img.mode == 'P' else 'RGB')
            if max(img.size) > 1000:
                img.thumbnail((1000, 1000), Image.LANCZOS)
            img.save(saida, 'WEBP', quality=QUALIDADE, method=4)
            os.remove(caminho)
            feitos += 1
            if i % 25 == 0 or i == total:
                print(f'[{i}/{total}] convertidas...', flush=True)
        except Exception as e:
            erros += 1
            print(f'[{i}/{total}] {nome} -> ERRO: {e}', flush=True)

    depois = sum(os.path.getsize(os.path.join(PASTA, f)) for f in os.listdir(PASTA))
    print(f'\nPronto. {feitos} convertidas, {pulados} duplicatas removidas, {erros} erros.')
    print(f'Tamanho: {mb(antes):.0f} MB -> {mb(depois):.0f} MB')
    print('Agora: git add -A ; git commit -m "Fotos em WebP" ; git push')

if __name__ == '__main__':
    main()
