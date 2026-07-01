"""
Partum Brasil - Auto Remove Background + Otimizacao
Fica a monitorizar a pasta public/produtos/
Quando detecta uma imagem nova:
  1. Remove o fundo automaticamente (rembg)
  2. Redimensiona para no maximo 800px (foto de produto nao precisa mais)
  3. Salva como WebP transparente comprimido (leve, sem perda visivel)

Como usar: execute este script e deixe rodando em segundo plano.
Para parar: pressione Ctrl+C
"""

import sys
import os
import time

sys.stdout.reconfigure(encoding='utf-8')

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from rembg import remove
from PIL import Image

PASTA = os.path.join(os.path.dirname(__file__), '..', 'public', 'produtos')
EXTENSOES = {'.webp', '.jpg', '.jpeg', '.png'}

# Configuracao de otimizacao
MAX_LADO = 800        # px - lado maximo da imagem
WEBP_QUALIDADE = 85   # 0-100 - 85 fica identico a olho nu

# Guarda ficheiros que o proprio script acabou de escrever,
# para nao os reprocessar (evita loop infinito ao gravar .webp).
_escritos_recentemente = {}


def foi_escrito_por_nos(caminho):
    agora = time.time()
    for k in list(_escritos_recentemente):
        if agora - _escritos_recentemente[k] > 15:
            del _escritos_recentemente[k]
    return caminho in _escritos_recentemente


def marcar_escrito(caminho):
    _escritos_recentemente[caminho] = time.time()


def redimensionar(img):
    if max(img.width, img.height) <= MAX_LADO:
        return img
    escala = MAX_LADO / max(img.width, img.height)
    novo = (round(img.width * escala), round(img.height * escala))
    return img.resize(novo, Image.LANCZOS)


def processar(caminho):
    nome, ext = os.path.splitext(caminho)
    if ext.lower() not in EXTENSOES:
        return
    if foi_escrito_por_nos(caminho):
        return

    print(f'Nova imagem detectada: {os.path.basename(caminho)}')
    print('Removendo fundo e otimizando...')

    try:
        # Espera o ficheiro estar completamente escrito
        time.sleep(1)

        img = Image.open(caminho)
        resultado = remove(img)          # remove fundo -> RGBA
        resultado = redimensionar(resultado)

        saida = nome + '.webp'
        marcar_escrito(saida)
        resultado.save(saida, 'webp', quality=WEBP_QUALIDADE, method=6)

        # Remove o original se tiver extensao diferente do output
        if os.path.abspath(caminho) != os.path.abspath(saida) and os.path.exists(caminho):
            os.remove(caminho)

        kb = os.path.getsize(saida) / 1024
        print(f'Concluido! Salvo como: {os.path.basename(saida)} ({kb:.0f}KB, {resultado.width}x{resultado.height})')
        print('-' * 40)
    except Exception as e:
        print(f'Erro ao processar {os.path.basename(caminho)}: {e}')


class Handler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory:
            processar(event.src_path)

    def on_moved(self, event):
        if not event.is_directory:
            processar(event.dest_path)


if __name__ == '__main__':
    os.makedirs(PASTA, exist_ok=True)

    print('=' * 40)
    print('  Partum Brasil - Auto Remove BG + Otimizacao')
    print('=' * 40)
    print(f'Monitorando: {os.path.abspath(PASTA)}')
    print('Salve imagens na pasta produtos/')
    print('Fundo removido + otimizado para WebP automaticamente!')
    print('Pressione Ctrl+C para parar.')
    print('-' * 40)

    observer = Observer()
    observer.schedule(Handler(), PASTA, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print('\nScript encerrado.')

    observer.join()
