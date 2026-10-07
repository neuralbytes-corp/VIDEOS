#!/usr/bin/env python3
"""Genera la voz del video 4 con ElevenLabs (una línea de voz = un mp3).

Requisitos (se configuran en el ENTORNO de la sesión, nunca en el chat):
  - Variable de entorno ELEVENLABS_API_KEY  (clave de API de ElevenLabs)
  - Variable de entorno ELEVENLABS_VOICE_ID (ID de la voz en español que elijas)
  - Red: permitir el dominio api.elevenlabs.io

Uso (desde my-video/):  python3 tools/make_voice.py
Lee src/byker/voice04.json y escribe public/byker/voz-v04/<id>.mp3.
Después pon V04_VOICE_READY = true en src/byker/video04.ts y vuelve a renderizar.
"""
import json
import os
import sys
import urllib.request

key = os.environ.get("ELEVENLABS_API_KEY")
voice = os.environ.get("ELEVENLABS_VOICE_ID")
if not key or not voice:
    sys.exit("Faltan ELEVENLABS_API_KEY y/o ELEVENLABS_VOICE_ID en el entorno.")

os.makedirs("public/byker/voz-v04", exist_ok=True)
lines = json.load(open("src/byker/voice04.json", encoding="utf-8"))

for line in lines:
    body = json.dumps(
        {
            "text": line["text"],
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.35},
        }
    ).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128",
        data=body,
        headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        out = f"public/byker/voz-v04/{line['id']}.mp3"
        open(out, "wb").write(r.read())
    print("ok", out)
