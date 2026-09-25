"""
Passa o removedor de fundo em TODAS as imagens que ja estao em public/produtos.
Diferente do remove-bg-watch.py, que so pega arquivo novo.

    python scripts/remover-fundo-tudo.py

Pode parar com Ctrl+C e rodar de novo depois: ele continua de onde parou.
"""
import sys, os, time
sys.stdout.reconfigure(encoding='utf-8')

from rembg import remove
from PIL import Image

PASTA = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'produtos')
PASTA = os.path.abspath(PASTA)
EXTENSOES = {'.jpg', '.jpeg', '.webp'}

def main():
    alvos = [f for f in sorted(os.listdir(PASTA))
             if os.path.splitext(f)[1].lower() in EXTENSOES]
    total = len(alvos)
    print(f'Pasta: {PASTA}')
    print(f'{total} imagens para processar.\n')
    if not total:
        return

    feitos = erros = 0
    t0 = time.time()
    for i, nome in enumerate(alvos, 1):
        caminho = os.path.join(PASTA, nome)
        base, _ = os.path.splitext(caminho)
        saida = base + '.png'
        if os.path.exists(saida):
            print(f'[{i}/{total}] {nome} - ja tem png, pulando')
            continue
        try:
            img = Image.open(caminho)
            resultado = remove(img)
            resultado.save(saida, 'png')
            os.remove(caminho)
            feitos += 1
            resta = (time.time() - t0) / feitos * (total - i)
            print(f'[{i}/{total}] {nome} -> OK  (faltam ~{int(resta/60)} min)', flush=True)
        except Exception as e:
            erros += 1
            print(f'[{i}/{total}] {nome} -> ERRO: {e}', flush=True)

    print(f'\nPronto. {feitos} imagens tratadas, {erros} erros.')
    print('Agora: git add -A ; git commit -m "Remove fundo das fotos" ; git push')

if __name__ == '__main__':
    main()
