import urllib.request
import urllib.parse
import time

base_prompt = ", cartoon 2D educational style, solid light blue background, bright colors, high quality, kid-friendly"

images = {
    "microfone.jpg": "A cute stage microphone",
    "prancha_surf.jpg": "A cute colorful surfboard",
    "bola_futebol.jpg": "A cute soccer ball",
    "violao.jpg": "A cute acoustic guitar",
    "liquidificador.jpg": "A cute kitchen blender",
    "maquiagem.jpg": "A cute makeup kit",
    "cenario_filme.jpg": "A cute bucket of popcorn for watching an animated movie",
    "cenario_relatorio.jpg": "A cute office document report with charts",
    "cenario_jogar.jpg": "A cute video game controller",
    "cenario_programar.jpg": "A cute computer monitor with code on it",
    "cenario_musica.jpg": "Cute over-ear headphones",
    "cenario_videochamada.jpg": "A cute webcam and a tie for a video call",
    "cenario_ebook.jpg": "A cute digital tablet showing an e-book",
    "cenario_estoque.jpg": "A cute dress and clipboard for store inventory",
    "cenario_desenho.jpg": "A cute digital drawing tablet with a colorful drawing",
    "cenario_motorista.jpg": "A cute yellow car for a ride app"
}

for filename, prompt in images.items():
    full_prompt = prompt + base_prompt
    encoded = urllib.parse.quote(full_prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true"
    filepath = f"frontend/src/assets/images/professions/{filename}"
    print(f"Downloading {filename}...")
    try:
        urllib.request.urlretrieve(url, filepath)
        time.sleep(1)
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
