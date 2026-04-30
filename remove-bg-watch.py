"""
Partum Brasil - Auto Remove Background
Fica a monitorizar a pasta public/produtos/
Quando detecta uma imagem nova, remove o fundo automaticamente.

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
EXTENSOES = {'.webp', '.jpg', '.jpeg'}

def processar(caminho):
    nome, ext = os.path.splitext(caminho)
    if ext.lower() not in EXTENSOES:
        return
    if caminho.endswith('.png'):
        return

    print(f'Nova imagem detectada: {os.path.basename(caminho)}')
    print('Removendo fundo...')

    try:
        # Espera o ficheiro estar completamente escrito
        time.sleep(1)

        img = Image.open(caminho)
        resultado = remove(img)

        # Salva como PNG (suporta transparência)
        saida = nome + '.png'
        resultado.save(saida, 'png')

        # Remove o original
        os.remove(caminho)

        print(f'Concluido! Salvo como: {os.path.basename(saida)}')
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
    print('  Partum Brasil - Auto Remove Background')
    print('=' * 40)
    print(f'Monitorando: {os.path.abspath(PASTA)}')
    print('Salve imagens na pasta produtos/')
    print('O fundo sera removido automaticamente!')
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
