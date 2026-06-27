import { state } from "./state.js";
import { buildEnemies, createEnemies, renderEnemies } from "./enemies.js";
import { initPlayer } from "./player.js";
import {
  updateLivesDisplay,
  updateScoreDisplay,
  updateLevelDisplay,
  hidePauseMenu,
} from "./ui.js";
import { removeAllProjectiles } from "./bullets.js";
import { loseLife } from "./lives.js";

export function restartGame() {
  state.startTime = null;
  state.elapsedSeconds = 0;

  state.lives = 3;
  updateLivesDisplay();

  state.score = 0;
  updateScoreDisplay();

  removeAllProjectiles();

  document.getElementById("enemies").innerHTML = "";
  buildEnemies();
  createEnemies();
  renderEnemies();

  state.enemyBullets = [];
  state.lastEnemyShotTime = 0;
  initPlayer();

  state.level = 1;
  state.speed = 2;
  updateLevelDisplay();

  state.direction = 1;
  state.lastShotTime = 0;
  state.keys = {};
  state.isPaused = false;
  state.isGameOver = false;
  hidePauseMenu();
}

export function setupControls() {
  document.addEventListener("keydown", (e) => {
    state.keys[e.key] = true;

    if (e.key === "Escape" && !state.isGameOver && !e.repeat) {
      state.isPaused = !state.isPaused;
      if (state.isPaused) {
        document.getElementById("pause-menu").style.display = "flex";
      } else {
        document.getElementById("pause-menu").style.display = "none";
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    state.keys[e.key] = false;
  });

  document.getElementById("continue-btn").addEventListener("click", () => {
    document.getElementById("pause-menu").style.display = "none";
    state.isPaused = false;
  });

  document.getElementById("restart-btn").addEventListener("click", () => {
    document.getElementById("pause-menu").style.display = "none";
    restartGame();
  });

  document.getElementById("play-again").addEventListener("click", () => {
    document.getElementById("game-over").style.display = "none";
    restartGame();
  });
}

export function startGame() {
  buildEnemies();
  createEnemies();
  renderEnemies();
  initPlayer();
}
