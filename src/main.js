import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import io from 'socket.io-client';
import { encodeWAV } from './wav-encoder.js';

let scene, camera, renderer, controls, model;
let socket;
let targetPhoneme = 'neutral';
let targetEmotion = null;
let lastChangeTime = 0;
let blinkTimeout = null;

window.addEventListener("DOMContentLoaded", () => {
  init();
  loadVRM('/Base.vrm').then(() => {
    setupMicrophone();
    setupSocket();
    startAutoBlink();
  });
});

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.4, 1.5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.4, 0);
  controls.update();

  animate();
}

async function loadVRM(path) {
  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));
  const gltf = await loader.loadAsync(path);
  VRMUtils.removeUnnecessaryVertices(gltf.scene);
  VRMUtils.removeUnnecessaryJoints(gltf.scene);
  model = gltf.userData.vrm;
  scene.add(model.scene);
  console.log("✅ VRM loaded");
  window.expressions = model.expressionManager;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (model) model.update(1 / 60);
}

function setupMicrophone() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    function processChunk() {
      if (chunks.length === 0) return;
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const audioContext = new AudioContext();
        audioContext.decodeAudioData(reader.result, (audioBuffer) => {
          const wavBlob = encodeWAV(audioBuffer);
          const wavReader = new FileReader();
          wavReader.onloadend = () => {
            socket.emit('audio', { blob: wavReader.result });
          };
          wavReader.readAsDataURL(wavBlob);
        });
      };
      reader.readAsArrayBuffer(blob);
      chunks = [];
    }

    setInterval(() => {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
      setTimeout(() => {
        if (mediaRecorder.state !== "recording") mediaRecorder.start();
      }, 60);
    }, 400); // Smoother/faster response

    mediaRecorder.onstop = processChunk;
    mediaRecorder.start();
  }).catch(e => {
    alert("Microphone access denied or failed! " + e);
    console.error("Microphone access error", e);
  });
}

function setupSocket() {
  socket = io('http://127.0.0.1:5001');
  socket.on('connect', () => {
    console.log('🟢 Connected to backend');
    document.getElementById('phoneme-display').textContent = "🟢 Connected!";
  });
  socket.on('viseme', (data) => {
    updateExpressionFromPhoneme(data.phoneme, data.emotion || null);
  });
  socket.on('disconnect', () => {
    document.getElementById('phoneme-display').textContent = "⚠️ Backend disconnected!";
  });
}

function updateExpressionFromPhoneme(phoneme, emotion = null) {
  const now = Date.now();
  document.getElementById('phoneme-display').textContent = `🗣️ Phoneme: ${phoneme}${emotion ? ` | 😃 Emotion: ${emotion}` : ''}`;
  targetPhoneme = phoneme;
  targetEmotion = emotion;
  lastChangeTime = now;
}

function smoothExpressions() {
  if (!model?.expressionManager) return;
  const expressions = ['aa', 'ee', 'ih', 'oh', 'ou', 'neutral', 'smile', 'angry', 'blink'];
  const speed = 0.4;
  if (Date.now() - lastChangeTime > 1200) targetPhoneme = 'neutral';

  expressions.forEach((exp) => {
    let val = model.expressionManager.getValue(exp) || 0;
    let target = 0;
    if (exp === targetPhoneme) target = 1;
    if (exp === targetEmotion) target = 1;
    if (exp === "blink" && targetEmotion === "blink") target = 1;
    let smoothed = val + (target - val) * speed;
    smoothed = Math.max(0, Math.min(1, smoothed));
    model.expressionManager.setValue(exp, smoothed);
  });
  model.expressionManager.update();
}

setInterval(smoothExpressions, 30);

window.triggerExpression = (name) => {
  targetPhoneme = name;
  lastChangeTime = Date.now();
};

window.clearExpressions = () => {
  targetPhoneme = 'neutral';
  targetEmotion = null;
  lastChangeTime = Date.now();
};

// --- Auto-Blink Logic ---
function startAutoBlink() {
  function blink() {
    targetEmotion = "blink";
    setTimeout(() => {
      targetEmotion = null;
    }, 200); // Blink duration
    blinkTimeout = setTimeout(blink, 3200 + Math.random() * 1800);
  }
  blinkTimeout = setTimeout(blink, 2000 + Math.random() * 1200);
}
