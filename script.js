// ✔ VERY SIMPLE WORKING GAME

let difficulty = "easy";
let goal = 5;
let timeLeft = 20;
let score = 0;

let spawnRate = 1000; // milliseconds
let spawnInterval;
let timerInterval;

const difficultyText = document.getElementById("difficulty");
const goalText = document.getElementById("goal");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const message = document.getElementById("message");
const gameArea = document.getElementById("game-area");

document.getElementById("easy").onclick = () => setDifficulty("easy");
document.getElementById("normal").onclick = () => setDifficulty("normal");
document.getElementById("hard").onclick = () => setDifficulty("hard");
document.getElementById("start").onclick = startGame;

function setDifficulty(level) {
  difficulty = level;

  if (level === "easy") {
    goal = 5;
    timeLeft = 20;
    spawnRate = 1000;
  } else if (level === "normal") {
    goal = 8;
    timeLeft = 20;
    spawnRate = 700;
  } else if (level === "hard") {
    goal = 12;
    timeLeft = 20;
    spawnRate = 500;
  }

  difficultyText.textContent = level;
  goalText.textContent = goal;
  timeText.textContent = timeLeft;

  message.textContent = "Difficulty set to " + level;
}

function startGame() {
  clearGame();
  score = 0;
  timeLeft = parseInt(timeText.textContent);
  scoreText.textContent = score;

  message.textContent = "Game Started! Click blue circles!";

  spawnInterval = setInterval(createDrop, spawnRate);

  timerInterval = setInterval(() => {
    timeLeft--;
    timeText.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  clearGame();

  if (score >= goal) {
    message.textContent = "YOU WIN! Score: " + score;
  } else {
    message.textContent = "YOU LOST. Score: " + score;
  }
}

function clearGame() {
  gameArea.innerHTML = "";
}

function createDrop() {
  const drop = document.createElement("div");
  drop.className = "drop";

  const maxX = gameArea.clientWidth - 40;
  const maxY = gameArea.clientHeight - 40;

  drop.style.left = Math.random() * maxX + "px";
  drop.style.top = Math.random() * maxY + "px";

  drop.onclick = () => {
    score++;
    scoreText.textContent = score;
    drop.remove();
  };

  gameArea.appendChild(drop);

  setTimeout(() => drop.remove(), 2000);
}
