// -----------------------------
// BASIC GAME SETTINGS
// -----------------------------

// Different settings for each difficulty mode
const difficultySettings = {
  easy: {
    label: "Easy",
    targetScore: 8,      // how many drops you need to win
    time: 30,            // seconds
    spawnRate: 900       // how often a new drop appears (milliseconds)
  },
  normal: {
    label: "Normal",
    targetScore: 12,
    time: 25,
    spawnRate: 700
  },
  hard: {
    label: "Hard",
    targetScore: 18,
    time: 20,
    spawnRate: 550
  }
};

// -----------------------------
// SELECT ELEMENTS FROM THE PAGE
// -----------------------------

const difficultyButtons = document.querySelectorAll(".difficulty-button");
const difficultyLabel = document.getElementById("difficulty-label");
const goalDisplay = document.getElementById("goal-display");
const scoreDisplay = document.getElementById("score-display");
const timerDisplay = document.getElementById("timer-display");
const message = document.getElementById("message");
const startButton = document.getElementById("start-button");
const gameArea = document.getElementById("game-area");

// -----------------------------
// GAME STATE (THINGS THAT CHANGE)
// -----------------------------

let currentDifficultyKey = "easy";
let score = 0;
let timeLeft = difficultySettings[currentDifficultyKey].time;
let gameIsActive = false;

let spawnIntervalId = null;
let timerIntervalId = null;

// -----------------------------
// HELPER: UPDATE STATS TEXT
// -----------------------------

function updateStatsDisplay() {
  const settings = difficultySettings[currentDifficultyKey];
  difficultyLabel.textContent = settings.label;
  goalDisplay.textContent = `${settings.targetScore} drops`;
  scoreDisplay.textContent = score.toString();
  timerDisplay.textContent = `${timeLeft}s`;
}

// -----------------------------
// SET DIFFICULTY
// -----------------------------

function setDifficulty(newDifficultyKey) {
  if (gameIsActive) {
    // You can only change difficulty when the game is NOT running
    return;
  }

  currentDifficultyKey = newDifficultyKey;
  const settings = difficultySettings[currentDifficultyKey];

  // Highlight the active button
  difficultyButtons.forEach((btn) => {
    const btnDifficulty = btn.getAttribute("data-difficulty");
    btn.classList.toggle("active", btnDifficulty === currentDifficultyKey);
  });

  // Reset score and timer for the new difficulty
  score = 0;
  timeLeft = settings.time;
  message.textContent = `You selected ${settings.label}. Press "Start Game" to begin.`;

  // Clear any remaining drops just in case
  clearGameArea();

  updateStatsDisplay();
}

// -----------------------------
// CLEAR GAME AREA (REMOVE DROPS)
// -----------------------------

function clearGameArea() {
  // Remove all elements with the class "drop"
  const drops = gameArea.querySelectorAll(".drop");
  drops.forEach((drop) => drop.remove());
}

// -----------------------------
// START GAME
// -----------------------------

function startGame() {
  if (gameIsActive) {
    return; // Already playing
  }

  const settings = difficultySettings[currentDifficultyKey];

  gameIsActive = true;
  score = 0;
  timeLeft = settings.time;
  updateStatsDisplay();

  message.textContent =
    "Game started! Click as many blue water drops as you can before time runs out.";

  // Disable difficulty buttons while game is running
  difficultyButtons.forEach((btn) => {
    btn.disabled = true;
  });
  startButton.disabled = true;

  clearGameArea();

  // Start spawning drops
  spawnIntervalId = setInterval(createDrop, settings.spawnRate);

  // Start timer that counts down every second
  timerIntervalId = setInterval(() => {
    timeLeft--;
    updateStatsDisplay();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// -----------------------------
// END GAME
// -----------------------------

function endGame() {
  if (!gameIsActive) return;

  gameIsActive = false;

  const settings = difficultySettings[currentDifficultyKey];

  // Stop timer & drop spawns
  clearInterval(spawnIntervalId);
  clearInterval(timerIntervalId);
  spawnIntervalId = null;
  timerIntervalId = null;

  // Remove any leftover drops
  clearGameArea();

  // Check win or lose
  if (score >= settings.targetScore) {
    message.textContent =
      `Amazing! You collected ${score} drops and reached the goal for the ${settings.label} level. ` +
      "Imagine the impact of bringing clean water to a whole community!";
  } else {
    message.textContent =
      `You collected ${score} drops, but the goal was ${settings.targetScore}. ` +
      "You're close—try again and see if you can beat your best score!";
  }

  // Re-enable controls
  difficultyButtons.forEach((btn) => {
    btn.disabled = false;
  });
  startButton.disabled = false;
}

// -----------------------------
// CREATE A SINGLE WATER DROP
// -----------------------------

function createDrop() {
  if (!gameIsActive) return;

  const drop = document.createElement("div");
  drop.classList.add("drop");

  // Get the size of the game area so we can place the drop inside it
  const areaRect = gameArea.getBoundingClientRect();

  // Keep some padding so drops don't get cut off at the edges
  const padding = 10;
  const maxX = areaRect.width - 40 - padding;
  const maxY = areaRect.height - 80 - padding; // leave space at bottom

  // Random x and y positions inside the game area
  const x = Math.random() * maxX + padding;
  const y = Math.random() * maxY + padding;

  drop.style.left = `${x}px`;
  drop.style.top = `${y}px`;

  // When the player clicks the drop:
  drop.addEventListener("click", () => {
    if (!gameIsActive) return;

    // Increase score by 1 each time you click a drop
    score++;
    updateStatsDisplay();

    // Remove the drop from the page
    drop.remove();
  });

  // Add the drop to the game area
  gameArea.appendChild(drop);

  // Auto-remove the drop after a few seconds so the screen doesn't fill up
  setTimeout(() => {
    if (drop.parentElement) {
      drop.remove();
    }
  }, 2600);
}

// -----------------------------
// EVENT LISTENERS
// -----------------------------

// Change difficulty when clicking those buttons
difficultyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const level = btn.getAttribute("data-difficulty");
    setDifficulty(level);
  });
});

// Start game button
startButton.addEventListener("click", startGame);

// Initialize the display when the page first loads
setDifficulty("easy");
updateStatsDisplay();
