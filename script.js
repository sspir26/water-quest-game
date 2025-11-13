// This little popup is just to check if JavaScript is working.
// When you reload the page, you SHOULD see this pop up once.
alert("Game ready! If you see this message, your JavaScript file is working.");

// Wait for the page HTML to be fully loaded before we touch it
window.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // BASIC GAME SETTINGS
  // -----------------------------

  const difficultySettings = {
    easy: {
      label: "Easy",
      targetScore: 8,
      time: 30,
      spawnRate: 900
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
  // GAME STATE
  // -----------------------------

  let currentDifficultyKey = "easy";
  let score = 0;
  let timeLeft = difficultySettings[currentDifficultyKey].time;
  let gameIsActive = false;

  let spawnIntervalId = null;
  let timerIntervalId = null;

  // -----------------------------
  // UPDATE STATS TEXT
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
      return;
    }

    currentDifficultyKey = newDifficultyKey;
    const settings = difficultySettings[currentDifficultyKey];

    difficultyButtons.forEach((btn) => {
      const btnDifficulty = btn.getAttribute("data-difficulty");
      btn.classList.toggle("active", btnDifficulty === currentDifficultyKey);
    });

    score = 0;
    timeLeft = settings.time;
    message.textContent = `You selected ${settings.label}. Press "Start Game" to begin.`;

    clearGameArea();
    updateStatsDisplay();
  }

  // -----------------------------
  // CLEAR GAME AREA
  // -----------------------------

  function clearGameArea() {
    const drops = gameArea.querySelectorAll(".drop");
    drops.forEach((drop) => drop.remove());
  }

  // -----------------------------
  // START GAME
  // -----------------------------

  function startGame() {
    if (gameIsActive) return;

    const settings = difficultySettings[currentDifficultyKey];

    gameIsActive = true;
    score = 0;
    timeLeft = settings.time;
    updateStatsDisplay();

    message.textContent =
      "Game started! Click as many blue water drops as you can before time runs out.";

    difficultyButtons.forEach((btn) => {
      btn.disabled = true;
    });
    startButton.disabled = true;

    clearGameArea();

    // make drops appear again and again
    spawnIntervalId = setInterval(createDrop, settings.spawnRate);

    // countdown timer
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

    clearInterval(spawnIntervalId);
    clearInterval(timerIntervalId);
    spawnIntervalId = null;
    timerIntervalId = null;

    clearGameArea();

    if (score >= settings.targetScore) {
      message.textContent =
        `Amazing! You collected ${score} drops and reached the goal for the ${settings.label} level. ` +
        "Imagine the impact of bringing clean water to a whole community!";
    } else {
      message.textContent =
        `You collected ${score} drops, but the goal was ${settings.targetScore}. ` +
        "You're close—try again and see if you can beat your best score!";
    }

    difficultyButtons.forEach((btn) => {
      btn.disabled = false;
    });
    startButton.disabled = false;
  }

  // -----------------------------
  // CREATE A WATER DROP
  // -----------------------------

  function createDrop() {
    if (!gameIsActive) return;

    const drop = document.createElement("div");
    drop.classList.add("drop");

    const areaRect = gameArea.getBoundingClientRect();

    const padding = 10;
    const maxX = areaRect.width - 40 - padding;
    const maxY = areaRect.height - 80 - padding;

    const x = Math.random() * maxX + padding;
    const y = Math.random() * maxY + padding;

    drop.style.left = `${x}px`;
    drop.style.top = `${y}px`;

    drop.addEventListener("click", () => {
      if (!gameIsActive) return;

      score++;
      updateStatsDisplay();
      drop.remove();
    });

    gameArea.appendChild(drop);

    setTimeout(() => {
      if (drop.parentElement) {
        drop.remove();
      }
    }, 2600);
  }

  // -----------------------------
  // EVENT LISTENERS
  // -----------------------------

  difficultyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const level = btn.getAttribute("data-difficulty");
      setDifficulty(level);
    });
  });

  startButton.addEventListener("click", startGame);

  // -----------------------------
  // INITIAL SETUP
  // -----------------------------

  setDifficulty("easy");
  updateStatsDisplay();
});
