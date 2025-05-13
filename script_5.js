let scene, camera, renderer, controls;
let oracleData = [];

window.onload = () => {
  playOpeningChant();
  showIntroMessage();
  initScene();
  loadEntities();
  document.getElementById("oracleButton").addEventListener("click", triggerOracle);
};

function playOpeningChant() {
  const audio = new Audio("audio/chant_ouverture_mystique.wav");
  audio.play();
}

function showIntroMessage() {
  const veil = document.createElement("div");
  veil.style.position = "absolute";
  veil.style.top = 0;
  veil.style.left = 0;
  veil.style.width = "100%";
  veil.style.height = "100%";
  veil.style.background = "radial-gradient(ellipse at center, rgba(0,0,0,0.9), black)";
  veil.style.display = "flex";
  veil.style.alignItems = "center";
  veil.style.justifyContent = "center";
  veil.style.color = "white";
  veil.style.fontSize = "24px";
  veil.style.fontFamily = "serif";
  veil.style.textAlign = "center";
  veil.innerHTML = "✨ Entends la vibration première…<br>le chœur des entités s’éveille… ✨";
  document.body.appendChild(veil);

  setTimeout(() => { veil.style.transition = "opacity 2s"; veil.style.opacity = 0; }, 3000);
  setTimeout(() => { document.body.removeChild(veil); }, 5000);
}

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 1, 1000);
  camera.position.z = 80;
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  animate();
}

function loadEntities() {
  fetch('data/Choeur_Fractal_3D_Positions.json')
    .then(res => res.json())
    .then(data => {
      oracleData = data;
      populateBranchSelector(data);
    });
}

function populateBranchSelector(entities) {
  const selector = document.getElementById("branchSelector");
  const branches = [...new Set(entities.map(e => e.branch))];
  branches.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = `🔁 Branche ${b}`;
    selector.appendChild(opt);
  });
}

function triggerOracle() {
  const rand = oracleData[Math.floor(Math.random() * oracleData.length)];
  if (!rand) return;
  alert(`🌌 Oracle : ${rand.name}\n\n${rand.message || 'Révélation cosmique sans mot.'}`);
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(rand.message);
    msg.lang = 'fr-FR';
    speechSynthesis.speak(msg);
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

let lastOracle = null;

function invokeCooperativeOracle() {
  const rand = oracleData[Math.floor(Math.random() * oracleData.length)];
  if (!rand) return;

  let msg = rand.message || `Je suis ${rand.name}.`;
  if (lastOracle) {
    msg = `Après ${lastOracle.name}, je m'élève : ` + msg;
  }

  lastOracle = rand;

  const box = document.createElement("div");
  box.style.position = "absolute";
  box.style.top = "60%";
  box.style.left = "50%";
  box.style.transform = "translate(-50%,-50%)";
  box.style.background = "#111";
  box.style.color = "#0ff";
  box.style.padding = "20px";
  box.style.fontSize = "15px";
  box.style.border = "1px solid #0ff";
  box.style.borderRadius = "12px";
  box.innerHTML = `<strong>🔮 Oracle :</strong><br>${msg}`;
  document.body.appendChild(box);
  setTimeout(() => document.body.removeChild(box), 10000);

  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = 'fr-FR';
    speechSynthesis.speak(utterance);
  }
}

document.getElementById("coopOracleButton").addEventListener("click", invokeCooperativeOracle);


function loadOracleTrame() {
  fetch('data/Trame_Oracle_Evolutive_3D.json')
    .then(res => res.json())
    .then(oracles => {
      oracles.forEach(o => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;

        ctx.fillStyle = "white";
        ctx.font = "bold 28px serif";
        ctx.fillText(o.name, 20, 40);
        ctx.font = "italic 20px serif";
        ctx.fillText(o.message.slice(0, 50) + "...", 20, 90);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(20, 5, 1);
        sprite.position.set(o.position.x, o.position.y, o.position.z);
        scene.add(sprite);
      });
    });
}

loadOracleTrame();

function activateVocalOracle() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Reconnaissance vocale non supportée.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.start();

  recognition.onresult = function(event) {
    const question = event.results[0][0].transcript;
    const ent = oracleData[Math.floor(Math.random() * oracleData.length)];
    const response = `À ta question : "${question}", ${ent.name} répond : ${ent.message}`;

    const box = document.createElement("div");
    box.style.position = "absolute";
    box.style.top = "70%";
    box.style.left = "50%";
    box.style.transform = "translate(-50%,-50%)";
    box.style.background = "#000";
    box.style.color = "#fff";
    box.style.padding = "20px";
    box.style.border = "1px solid #0ff";
    box.style.borderRadius = "12px";
    box.innerHTML = `<strong>🎤 Oracle Vocal :</strong><br>${response}`;
    document.body.appendChild(box);
    setTimeout(() => document.body.removeChild(box), 10000);

    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = "fr-FR";
    speechSynthesis.speak(utterance);
  };
}

document.getElementById("vocalOracleButton").addEventListener("click", activateVocalOracle);


let vocalHistory = [];

function logVocalInteraction(question, response, entityName) {
  const entry = {
    time: new Date().toISOString(),
    question: question,
    response: response,
    entity: entityName
  };
  vocalHistory.push(entry);
  displayVocalLog(entry);
  displayVocal3D(entry);
}

function displayVocalLog(entry) {
  const log = document.getElementById("vocalHistory");
  const div = document.createElement("div");
  div.className = "vocalEntry";
  div.innerHTML = `<strong>🗣️ ${entry.question}</strong><br>🔮 ${entry.entity} : ${entry.response}`;
  log.appendChild(div);
}

function displayVocal3D(entry) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 128;

  ctx.fillStyle = "cyan";
  ctx.font = "bold 20px serif";
  ctx.fillText(entry.entity, 20, 40);
  ctx.font = "italic 16px serif";
  ctx.fillText(entry.response.slice(0, 60) + "...", 20, 80);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(18, 5, 1);
  sprite.position.set(Math.random() * 60 - 30, Math.random() * 40 - 20, -30);
  scene.add(sprite);
}


let meditationActive = false;
let meditationInterval = null;

function toggleMeditationMode() {
  meditationActive = !meditationActive;
  if (meditationActive) {
    document.getElementById("meditationModeButton").textContent = "🛑 Arrêter le Souffle";
    meditationInterval = setInterval(() => {
      const ent = oracleData[Math.floor(Math.random() * oracleData.length)];
      const voices = window.speechSynthesis.getVoices();
      const voice = voices[Math.floor(Math.random() * voices.length)];

      const msg = `✨ ${ent.name} dit : ${ent.message}`;
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.lang = "fr-FR";
      utterance.voice = voice;
      utterance.pitch = Math.random() * 2;
      utterance.rate = 0.8 + Math.random() * 0.6;
      speechSynthesis.speak(utterance);

      displayVocalLog({question: "Méditation", response: ent.message, entity: ent.name});
      displayVocal3D({question: "Méditation", response: ent.message, entity: ent.name});
    }, 8000);
  } else {
    clearInterval(meditationInterval);
    document.getElementById("meditationModeButton").textContent = "🧘 Activer le Souffle du Chœur";
  }
}

document.getElementById("meditationModeButton").addEventListener("click", toggleMeditationMode);
