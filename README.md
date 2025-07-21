# VRM Waifu LipSync

**A live 3D VRM avatar app that syncs your voice to mouth shapes and emotions in real time using Python, Three.js, and WebSockets.**

---

![Demo GIF](demo.gif)

## 🚀 Features

- 🎤 **Real-time voice-driven lipsync** (vowel mouth shapes: aa, ee, ih, oh, ou)
- 😄 **Emotion detection** (smile/angry) from your voice, visualized on avatar
- 👀 **Natural random blinking** for lifelike effect
- 🖥️ **3D anime-style VRM avatar** rendered in browser (Three.js)
- 🔄 **Instant feedback**—see your avatar move as you speak
- 🐍 **Python backend** with WebSockets for fast data streaming

---

## 🛠️ Quickstart

### **Requirements**

- Python 3.9+
- Node.js 18+
- Chrome (recommended for mic support)
- VRM file (try [VRoid Hub](https://hub.vroid.com/) or use provided sample)

### **1. Install Backend (Python)**

```bash
python -m venv venv
source venv/bin/activate         # or venv\Scripts\activate on Windows
pip install flask flask-socketio torchaudio numpy
2. Install Frontend (Node.js)
bash
Copy
Edit
npm install
3. Run Both Servers
Backend:

bash
Copy
Edit
python app.py
Frontend:

bash
Copy
Edit
npm run dev
Visit http://localhost:5173 in Chrome and allow microphone.

🧑‍💻 How it Works
Your mic input is chunked and sent to Python backend over WebSockets

Backend extracts features from your voice to estimate vowels and emotion (no heavy ML needed)

Data is streamed back instantly to animate the VRM avatar's mouth and face

Avatar blinks and animates in real time!

📷 Demo

Or record your own! See below for GIF instructions.

📦 Project Structure
bash
Copy
Edit
app.py                   # Python backend server
phoneme_classifier.py    # Voice analysis & phoneme detection
/src/main.js             # Three.js + VRM frontend, real-time animation
/index.html       # HTML UI
/public/Base.vrm         # VRM 3D model (add your own for more avatars!)
🎬 How to Record a GIF
Screen capture your browser window while talking (try ShareX for Windows, or ScreenToGif).

Trim/convert to GIF. Aim for 5–15 seconds showing you talking and the avatar animating.

Add the GIF to your repo as demo.gif and link in README.

🤝 Credits
Built by [Your Name]
Prompt & code design by [ChatGPT xAI Fullstack Realtime Guide]