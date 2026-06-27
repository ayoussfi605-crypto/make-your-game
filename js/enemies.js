import { state } from "./state.js";
import {
  getEnemyWidth,
  getEnemyHeight,
  getGameWidth,
  getGameHeight,
} from "./dom.js";
import { updateScoreDisplay, updateLevelDisplay, showGameOver } from "./ui.js";

export function buildEnemies() {
  state.enem = [];

  const rows = 4;
  const cols = 6;
  const spacingX = getGameWidth() / (cols + 4);
  const spacingY = 40;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      state.enem.push({
        left: spacingX + col * spacingX - getEnemyWidth() / 2,
        top: 30 + row * spacingY,
        type: row % state.enemySprites.length,
        alive: true,
      });
    }
  }
}

export function createEnemies() {
  const enemiesDiv = document.getElementById("enemies");
  enemiesDiv.innerHTML = "";

  for (let i = 0; i < state.enem.length; i++) {
    const el = document.createElement("div");
    el.className = "enemy";
    el.style.backgroundImage = `url('${state.enemySprites[state.enem[i].type]}')`;

    enemiesDiv.appendChild(el);
    state.enem[i].el = el;
  }
}

export function renderEnemies() {
  for (let i = 0; i < state.enem.length; i++) {
    if (!state.enem[i].alive) continue;
    state.enem[i].el.style.transform =
      `translate(${state.enem[i].left}px, ${state.enem[i].top}px)`;
  }
}

export function moveEnemies() {
  let hitWall = false;
  const gameWidth = getGameWidth();

  for (let i = 0; i < state.enem.length; i++) {
    if (!state.enem[i].alive) continue;

    state.enem[i].left += state.speed * state.direction;

    if (
      state.direction === 1 &&
      state.enem[i].left + getEnemyWidth() >= gameWidth
    ) {
      hitWall = true;
    }

    if (state.direction === -1 && state.enem[i].left <= 0) {
      hitWall = true;
    }
  }

  if (hitWall) {
    state.direction *= -1;
    for (let i = 0; i < state.enem.length; i++) {
      if (!state.enem[i].alive) continue;
      state.enem[i].top += state.dropDistance;
    }
  }
}

export function checkEnemiesReahedBottom(loseLicfe) {
  const gameHeight = getGameHeight();

  for (let i = 0; i < state.enem.length; i++) {
    if (!state.enem[i].alive) continue;

    if (state.enem[i].top + getEnemyHeight() >= gameHeight - 60) {
      loseLife();
      return;
    }
  }
}

export function nextLevel() {
  state.level += 1;
  updateLevelDisplay();

  for (let i = 0; i < state.bullets.length; i++) {
    state.bullets[i].el.remove();
  }
  state.bullets = [];

  for (let i = 0; i < state.enemyBullets.length; i++) {
    state.enemyBullets[i].el.remove();
  }
  state.enemyBullets = [];

  document.getElementById("enemies").innerHTML = "";
  buildEnemies();
  createEnemies();
  renderEnemies();

  state.speed = 2 + (state.level - 1) * 0.5;
}

export function checkWinCondition() {
  const aliveEnemies = state.enem.filter((enemy) => enemy.alive);

  if (aliveEnemies.length === 0) {
    nextLevel();
  }
}
