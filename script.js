let playerName = "";
let starsCollected = 0;
let happinessBefore = 0;
let happinessAfter = 0;

let gameInterval;
let paused = false;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

// Cloud player (emoji)
let cloud = { x: 180, y: 350, w: 60, h: 30 };

// Raindrops
let raindrops = [];

// Scenarios and tips
const scenarios = [
  { scenario: "You feel nervous after hearing bad news.", tip: "Take a deep breath and remind yourself — you are safe right now." },
  { scenario: "You miss something you lost in the disaster.", tip: "Think of one small thing you still have that brings you comfort." },
  { scenario: "Everyone around you seems stressed.", tip:  "Stay calm and breathe slowly — your staying calm helps others too." },
  { scenario: "You haven’t smiled in a while.", tip: "Think of one kind or happy memory — let it make you smile again."  },
  { scenario: "A loud sound brings back scary memories.", tip:  "Close your eyes and say softly, ‘That moment was in the past. I’m safe now.’" },
  { scenario: "You’ve been helping others all day.", tip: "Pause, drink some water, and rest — you deserve care too."  },
  { scenario: "You feel tired of seeing sad news.", tip: "Take a short break. Look outside, stretch, or notice something peaceful."  },
  { scenario: "You can’t fall asleep easily.", tip: "Try slow breathing — in for 4 seconds, out for 4 seconds." },
  { scenario: "Crowds and noise make you uneasy.", tip: "Step aside for a moment and breathe quietly until you feel steady." },
  { scenario: "You feel like no one understands you.", tip: "Talk to someone you trust — sharing helps lighten your heart." },
  { scenario: "You miss your old routine.", tip: "Make one small new habit — a cup of tea, music, or a walk." },
  { scenario: "You’re surrounded by panic.", tip: "Repeat to yourself: ‘I am calm, I am safe.’" },
  { scenario: "You woke up feeling sad.", tip: "Be gentle with yourself — feelings change, calm will return."  },
  { scenario: "You miss your favorite peaceful place.", tip: "Close your eyes and imagine being there for a moment." },
  { scenario:  "You feel like you must fix everything.", tip: "You’re doing enough — even small help makes a difference."  },
  { scenario: "Waiting for updates makes you anxious.", tip: "Look around — name 3 things you see, 2 you hear, 1 you feel." },
  { scenario: "You suddenly feel like crying.", tip: "It’s okay to cry — tears help release stress." },
  { scenario: "You helped someone smile today.", tip: "Take a moment to smile too — you deserve that peace." },
  { scenario: "You keep watching for danger even when things are calm.", tip: "Tell yourself gently: ‘I am safe right now.’" },
  { scenario: "You feel bad for being calm when others are upset.", tip: "Peace is not selfish — it spreads calm around you." }
];
let currentScenario = null;

// ⭐ Star rating system
// 🎮 Function to show a random scenario
function showRandomScenario() {
  // Pause the game (set gameRunning = false or similar flag)
  gamePaused = true;

  // Select a random scenario
  const randomIndex = Math.floor(Math.random() * scenarios.length);
  const selected = scenarios[randomIndex];

  // Show popup with scenario and continue button
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
    <div class="popup-content">
      <h3>🧠 Scenario</h3>
      <p>${selected.scenario}</p>
      <button id="showTipBtn">Reflect</button>
    </div>
  `;
  document.body.appendChild(popup);

  // When player clicks "Reflect", show tip
  document.getElementById("showTipBtn").addEventListener("click", () => {
    popup.innerHTML = `
      <div class="popup-content">
        <h3>💡 Tip</h3>
        <p>${selected.tip}</p>
        <button id="continueGameBtn">Continue</button>
      </div>
    `;
    document.getElementById("continueGameBtn").addEventListener("click", () => {
      popup.remove();
      gamePaused = false; // Resume game
    });
  });
}

// Start Game
function startGame() {
  playerName = document.getElementById("player-name").value || "Player";
  if (happinessBefore === 0) { alert("Please rate your happiness!"); return; }

  document.getElementById("start-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");

  starsCollected = 0;
  raindrops = [];
  gameInterval = setInterval(updateGame, 100);
  setTimeout(quitGame, 5 * 60 * 1000); // Auto quit after 5 mins
}

// Game loop
function updateGame() {
  if (paused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw cloud (emoji)
  ctx.font = "80px Arial";
  ctx.fillText("☁", cloud.x, cloud.y + 25);
 

  // Create raindrops
  if (Math.random() < 0.05) {
    raindrops.push({ x: Math.random() * 380, y: 0, size: 5 });
  }

  // Move raindrops
  for (let i = 0; i < raindrops.length; i++) {
    let r = raindrops[i];
    r.y += 6;
    ctx.fillStyle = "blue";
    ctx.font = "20px Arial";
    ctx.beginPath();
    ctx.fillText("💧", r.x, r.y);
    ctx.fill();

    // Collision with cloud
    if (r.x > cloud.x && r.x < cloud.x + cloud.w && r.y > cloud.y && r.y < cloud.y + 40) {
      starsCollected++;
      raindrops.splice(i, 1);
      showScenario();
    }
  }

  document.getElementById("score").innerText = `Drops Collected: ${starsCollected}`;
}

function moveLeft() { if (!paused && cloud.x > 0) cloud.x -= 20; }
function moveRight() { if (!paused && cloud.x < 340) cloud.x += 20; }

function showScenario() {
  paused = true;
  currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  document.getElementById("scenario-text").innerText = currentScenario.scenario;
  document.getElementById("popup").classList.remove("hidden");
}

function nextTip() {
  document.getElementById("scenario-text").innerText = currentScenario.tip;
  setTimeout(() => {
    document.getElementById("popup").classList.add("hidden");
    paused = false;
  }, 10000);
}

// Quit game
function quitGame() {
  clearInterval(gameInterval);
  document.getElementById("game-screen").classList.remove("active");
  document.getElementById("result-screen").classList.add("active");
}

// Final results
function showFinal() {
  if (happinessAfter === 0) { alert("Please rate your happiness!"); return; }

  document.getElementById("result-screen").classList.remove("active");
  document.getElementById("final-screen").classList.add("active");
  document.getElementById("final-message").innerText =
    `${playerName}, before playing you rated your happiness as ${happinessBefore}★. 
    After playing, you rated it as ${happinessAfter}★. 
    You collected ${starsCollected} stars. Thank you for taking care of your mental health! 💙`;
}

// Initialize stars
createStars("before-rating", true);
createStars("after-rating", false);
