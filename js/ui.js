import { state } from "./state.js";

export function updateTimer(now) {
  if (state.startTime === null) state.startTime = now;

  state.elapsedSeconds = Math.floor((now - state.startTime) / 1000);

  const minutes = Math.floor(state.elapsedSeconds / 60);
  const seconds = state.elapsedSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  document.getElementById("timer").textContent = `${mm}:${ss}`;
}

export function updateScoreDisplay() {
  document.getElementById("score").textContent = `Score: ${state.score}`;
}

export function updateLivesDisplay() {
  const heartsMap = { 3: "❤️❤️❤️", 2: "❤️❤️", 1: "❤️", 0: "" };
  document.getElementById("lives").textContent =
    "Lives: " + (heartsMap[state.lives] ?? "");
}

export function updateLevelDisplay() {
  document.getElementById("level").textContent = `Level: ${state.level}`;
}

export function showPauseMenu() {
  document.getElementById("pause-menu").style.display = "flex";
}

export function hidePauseMenu() {
  document.getElementById("pause-menu").style.display = "none";
}

export function showGameOver() {
  state.isPaused = true;
  state.isGameOver = true;

  const minutes = Math.floor(state.elapsedSeconds / 60);
  const seconds = state.elapsedSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  document.getElementById("final-score").textContent =
    `Final Score: ${state.score}`;
  document.getElementById("final-time").textContent = `Time: ${mm}:${ss}`;
  document.getElementById("game-over").style.display = "flex";
}
