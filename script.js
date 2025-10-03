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
  { scenario: "You feel anxious after a disaster alert. What do you do?", tip: "Take slow deep breaths to calm yourself." },
  { scenario: "You feel isolated after an emergency. What now?", tip: "Reach out to a friend or support group." },
  { scenario: "Stress keeps you awake. What could help?", tip: "Practice mindfulness or write your thoughts down." }
];
let currentScenario = null;

// ⭐ Star rating system
function createStars(containerId, isBefore) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.innerHTML = "★";
    star.classList.add("star");
    star.onclick = () => {
      if (isBefore) happinessBefore = i;
      else happinessAfter = i;
      updateStars(containerId, i);
    };
    container.appendChild(star);
  }
}
function updateStars(containerId, count) {
  const stars = document.querySelectorAll(`#${containerId} .star`);
  stars.forEach((star, i) => {
    star.classList.toggle("selected", i < count);
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

  document.getElementById("score").innerText = `Stars Collected: ${starsCollected}`;
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
  }, 1000);
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
