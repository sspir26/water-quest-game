// ===== Water Quest Game Logic =====

const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const messageElement = document.getElementById("message");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const spots = document.querySelectorAll(".spot");
const confettiContainer = document.getElementById("confetti-container");

let score = 0;
let timeLeft = 30;
let gameActive = false;
let countdownTimerId = null;
let canTimerId = null;

// Update displays
function updateScore() {
  scoreElement.textContent = score;
}

function updateTime() {
  timeElement.textContent = timeLeft + "s";
}

function clearSpots() {
  spots.forEach((spot) => {
    spot.classList.remove("good", "bad", "empty");
  });
}

function showRandomCan() {
  clearSpots();
  const randomIndex = Math.floor(Math.random() * spots.length);
  const randomSpot = spots[randomIndex];
  const isGood = Math.random() < 0.7;

  if (isGood) randomSpot.classList.add("good");
  else randomSpot.classList.add("bad");
}

function startCountdown() {
  countdownTimerId = setInterval(() => {
    timeLeft -= 1;
    updateTime();
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function startCanMovement() {
  showRandomCan();
  canTimerId = setInterval(showRandomCan, 800);
}

function endGame() {
  gameActive = false;
  startBtn.disabled = false;
  clearInterval(countdownTimerId);
  clearInterval(canTimerId);
  clearSpots();

  let finalMessage = "";
  if (score >= 100) {
    finalMessage =
      "Amazing! You collected enough clean water for a whole community! 🎉";
    launchConfetti();
  } else if (score >= 50) {
    finalMessage = "Good job! You helped several families get clean water!";
  } else {
    finalMessage = "Keep trying! Every clean can helps someone!";
  }

  messageElement.textContent = finalMessage;
}

function resetGame() {
  gameActive = false;
  clearInterval(countdownTimerId);
  clearInterval(canTimerId);

  score = 0;
  timeLeft = 30;
  updateScore();
  updateTime();
  clearSpots();
  clearConfetti();

  messageElement.textContent =
    "Game reset! Press Start Game to play again.";
  startBtn.disabled = false;
}

function launchConfetti() {
  clearConfetti();
  const colors = ["#ffd200", "#0a4e9b", "#ffffff", "#ff8a00"];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confetti-piece");

    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.animationDelay = Math.random() * 0.8 + "s";

    confettiContainer.appendChild(piece);
    setTimeout(() => piece.remove(), 2000);
  }
}

function clearConfetti() {
  confettiContainer.innerHTML = "";
}

// Click behavior
spots.forEach((spot) => {
  spot.addEventListener("click", () => {
    if (!gameActive) return;
    if (spot.classList.contains("good")) {
      score += 10;
      updateScore();
      messageElement.textContent = "Nice! Clean water collected! 💧";
      clearSpots();
    } else if (spot.classList.contains("bad")) {
      score -= 5;
      if (score < 0) score = 0;
      updateScore();
      messageElement.textContent = "Yikes! That was dirty water!";
      clearSpots();
    }
  });
});

// Start
startBtn.addEventListener("click", () => {
  if (gameActive) return;
  resetGame();
  gameActive = true;
  startBtn.disabled = true;

  messageElement.textContent =
    "Game on! Tap the yellow cans quickly!";
  startCountdown();
  startCanMovement();
});

// Reset
resetBtn.addEventListener("click", resetGame);

// Initialize
resetGame();
