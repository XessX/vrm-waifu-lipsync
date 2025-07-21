from flask import Flask
from flask_socketio import SocketIO, emit
import base64, io, torchaudio
from phoneme_classifier import detect_speech

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

@socketio.on("audio")
def handle_audio(data):
    print("DEBUG: Received /audio event.")
    try:
        if "blob" not in data:
            print("ERROR: No 'blob' in data!")
            return
        b64 = data["blob"]
        if "," in b64:
            b64 = b64.split(",")[1]
        audio_bytes = base64.b64decode(b64)
        print(f"DEBUG: Decoded {len(audio_bytes)} bytes.")
        waveform, sr = torchaudio.load(io.BytesIO(audio_bytes))
        print(f"DEBUG: waveform.shape={waveform.shape}, sr={sr}")
        phoneme, emotion = detect_speech(waveform, sr)
        print(f"DEBUG: Detected phoneme: {phoneme}, emotion: {emotion}")
        emit("viseme", {"phoneme": phoneme, "emotion": emotion})
    except Exception as e:
        print("ERROR: Exception during audio handling:", str(e))

if __name__ == "__main__":
    print("🚀 Backend running at http://127.0.0.1:5001")
    socketio.run(app, host="127.0.0.1", port=5001)
