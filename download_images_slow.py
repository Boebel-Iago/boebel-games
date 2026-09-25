import urllib.request
import urllib.parse
import time
import os

base_prompt = ", cartoon 2D educational style, solid light blue background, bright colors, high quality, kid-friendly"

images = {
    "bola_futebol.jpg": "A cute soccer ball",
    "violao.jpg": "A cute acoustic guitar",
    "liquidificador.jpg": "A cute kitchen blender",
    "maquiagem.jpg": "A cute makeup kit",
    "cenario_filme.jpg": "A cute bucket of popcorn for watching an animated movie",
    "cenario_jogar.jpg": "A cute video game controller",
    "cenario_programar.jpg": "A cute computer monitor with code on it",
    "cenario_musica.jpg": "Cute over-ear headphones",
    "cenario_videochamada.jpg": "A cute webcam and a tie for a video call",
    "cenario_ebook.jpg": "A cute digital tablet showing an e-book",
    "cenario_estoque.jpg": "A cute dress and clipboard for store inventory",
    "cenario_desenho.jpg": "A cute digital drawing tablet with a colorful drawing"
}

for filename, prompt in images.items():
    filepath = f"frontend/src/assets/images/professions/{filename}"
    if os.path.exists(filepath) and os.path.getsize(filepath) > 10000:
        print(f"Skipping {filename}, already exists.")
        continue

    full_prompt = prompt + base_prompt
    encoded = urllib.parse.quote(full_prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true"
    
    success = False
    retries = 3
    while not success and retries > 0:
        print(f"Downloading {filename}... (retries left: {retries})")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=30) as response, open(filepath, 'wb') as out_file:
                data = response.read()
                out_file.write(data)
            success = True
            print(f"Success: {filename}")
            time.sleep(5)
        except Exception as e:
            print(f"Failed: {filename} - {e}")
            retries -= 1
            time.sleep(10)
