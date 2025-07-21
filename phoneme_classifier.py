import torch
import torchaudio
import numpy as np

def detect_speech(waveform, sample_rate):
    # Mono, 16kHz conversion
    if waveform.shape[0] > 1:
        waveform = waveform.mean(dim=0, keepdim=True)
    if sample_rate != 16000:
        resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
        waveform = resampler(waveform)
        sample_rate = 16000

    samples = waveform.squeeze().numpy()
    energy = np.abs(samples).mean()

    if energy < 0.015:
        print("DEBUG: No voice detected (energy too low).")
        return 'neutral', None

    zero_crossings = np.where(np.diff(np.sign(samples)))[0]
    zcr = len(zero_crossings) / len(samples)
    pitch_bin = np.abs(np.fft.rfft(samples)).argmax()

    # --- Vowel mapping (by zcr) ---
    if zcr < 0.08:
        phoneme = 'aa'
    elif zcr < 0.13:
        phoneme = 'oh'
    elif zcr < 0.18:
        phoneme = 'ee'
    elif zcr < 0.22:
        phoneme = 'ih'
    else:
        phoneme = 'ou'

    # --- Emotion logic ---
    emotion = None
    if energy > 0.055 and zcr > 0.16:
        emotion = 'smile'
    elif energy > 0.065 and zcr < 0.13:
        emotion = 'angry'

    print(f"DEBUG: [energy={energy:.4f}, zcr={zcr:.4f}, pitch_bin={pitch_bin}, emotion={emotion}] -> {phoneme}")
    return phoneme, emotion
