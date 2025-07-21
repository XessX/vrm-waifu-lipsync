# VRM Waifu Realtime Lip Sync

Live, browser-based 3D waifu avatar with AI-powered real-time lip sync!  
Built using Three.js, VRM, Flask, torchaudio, and (optionally) Silero STT + phonemizer.

[![Front.png](https://i.postimg.cc/gJksc0Pw/Front.png)](https://postimg.cc/R3yKX4h9)

## 🚀 Demo

- [Live demo video/gif here!](https://jmp.sh/s/jmiNPM6UnldatUDUaRKP)

## Features

- Upload and view your own VRM avatar in 3D
- Realtime microphone-based mouth animation (lip sync)
- AI-driven phoneme detection (supports "aa", "ee", "ih", "oh", "ou")
- Fully local (all processing on your machine)

## How It Works

- Frontend: Vite + Three.js loads VRM, captures mic, sends audio via Socket.IO
- Backend: Flask + Flask-SocketIO receives audio, runs phoneme inference (Silero STT + phonemizer)
- Detected phonemes are mapped to VRM blendshapes for expressive, anime-style lip sync

## Getting Started

### 1. Clone the repo

git clone https://github.com/YOUR_USERNAME/vrm-waifu-lipsync.git
cd vrm-waifu-lipsync
2. Install Python dependencies

python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
# Also install espeak and ffmpeg as needed for phonemizer support
3. Install frontend dependencies


npm install

4. Run backend


python app.py

5. Run frontend

npm run dev

6. Open http://localhost:5173

File Structure
app.py - Flask backend

phoneme_classifier.py - AI phoneme detection logic

src/main.js - Frontend logic (Three.js, VRM, mic, Socket.IO)

public/Base.vrm - Sample VRM avatar

Credits
Silero VAD or STT

phonemizer

VRM & Three.js

VRoid Studio for base

License
MIT

Copyright@XessX
