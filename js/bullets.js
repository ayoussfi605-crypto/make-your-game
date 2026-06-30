import { state } from "./state.js";
import { getGameHeight, getPlayerWidth, getEnemyWidth, getEnemyHeight } from "./dom.js";
import { isColliding } from "./collisions.js";
import { loseLife } from "./lives.js";

const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 14;
const BULLET_SPEED = 8;
const ENEMY_BULLET_SPEED = 4;
export let ENEMY_SHOOT_INTERVAL = 1000;

export function resetEnemyShootInterval() {
  ENEMY_SHOOT_INTERVAL = 1000;
}

export function decreaseEnemyShootInterval() {
  ENEMY_SHOOT_INTERVAL = Math.max(200, ENEMY_SHOOT_INTERVAL - 300);
}
export function shoot(now) {
  if (!state.keys[" "]) return;
  if (now - state.lastShotTime < 250) return;

  state.lastShotTime = now;

  const el = document.createElement("div");
  el.className = "bullet";
  document.getElementById("bullets").appendChild(el);

  state.bullets.push({
    left: state.hero.left + getPlayerWidth() / 2 - BULLET_WIDTH / 2,
    top: getGameHeight() - 60,
    el,
  });
}

export function moveBullets() {
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    state.bullets[i].top -= BULLET_SPEED;

    if (state.bullets[i].top + BULLET_HEIGHT < 0) {
      state.bullets[i].el.remove();
      state.bullets.splice(i, 1);
    }
  }
}

export function renderBullets() {
  for (let i = 0; i < state.bullets.length; i++) {
    state.bullets[i].el.style.transform = `translate(${state.bullets[i].left}px, ${state.bullets[i].top}px)`;
  }
}

export function enemyShoot(now) {
  if (now - state.lastEnemyShotTime < ENEMY_SHOOT_INTERVAL) return;

  state.lastEnemyShotTime = now;
  const aliveEnemies = state.enem.filter((enemy) => enemy.alive);
  if (aliveEnemies.length === 0) return;

  const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
  const el = document.createElement("div");
  el.className = "enemy-bullet";
  document.getElementById("bullets").appendChild(el);

  state.enemyBullets.push({
    left: shooter.left + getEnemyWidth() / 2 - 2,
    top: shooter.top + getEnemyHeight(),
    el,
  });
}

export function moveEnemyBullets() {
  for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
    state.enemyBullets[i].top += ENEMY_BULLET_SPEED;

    if (state.enemyBullets[i].top > getGameHeight()) {
      state.enemyBullets[i].el.remove();
      state.enemyBullets.splice(i, 1);
      continue;
    }

    const playerBottom = getGameHeight() - 20;
    const playerTop = playerBottom - 50;

    if (isColliding(
      state.enemyBullets[i].left,
      state.enemyBullets[i].top,
      BULLET_WIDTH,
      BULLET_HEIGHT,
      state.hero.left,
      playerTop,
      getPlayerWidth(),
      50,
    )) {
      state.enemyBullets[i].el.remove();
      state.enemyBullets.splice(i, 1);
      loseLife();
      continue;
    }

    state.enemyBullets[i].el.style.transform = `translate(${state.enemyBullets[i].left}px, ${state.enemyBullets[i].top}px)`;
  }
}

export function removeAllProjectiles() {
  state.bullets.forEach((bullet) => bullet.el.remove());
  state.bullets = [];
  state.enemyBullets.forEach((bullet) => bullet.el.remove());
  state.enemyBullets = [];
}
