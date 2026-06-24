let enem = [];

const enemySprites = [
  "assets/red.png",
  "assets/enemy2.png",
  "assets/enemy3.png",
];

const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 32;

const PLAYER_WIDTH = 70;

let hero = {
  left: 0,
  top: 20,
  speed: 5,
};

let startTime = null;
let elapsedSeconds = 0;

let lives = 3;
let level = 1;

function getGameWidth() {
  return document.getElementById("game").offsetWidth;
}

function getGameHeight() {
  return document.getElementById("game").offsetHeight;
}

function updateTimer(now) {
  if (startTime === null) startTime = now;

  elapsedSeconds = Math.floor((now - startTime) / 1000);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  document.getElementById("timer").textContent = `${mm}:${ss}`;
}

function updateLivesDisplay() {
  const heartsMap = { 3: "❤️❤️❤️", 2: "❤️❤️", 1: "❤️", 0: "" };
  document.getElementById("lives").textContent = "Lives: " + (heartsMap[lives] ?? "");
}

function loseLife() {
  lives -= 1;
  updateLivesDisplay();

  if (lives <= 0) {
    showGameOver();
  }
}

function checkEnemiesReachedBottom() {
  const gameHeight = getGameHeight();

  for (let i = 0; i < enem.length; i++) {
    if (!enem[i].alive) continue;

    if (enem[i].top + ENEMY_HEIGHT >= gameHeight - 60) {  // 60 = player area
      loseLife();
      return;  // one life lost per frame is enough
    }
  }
}

function checkWinCondition() {
  const aliveEnemies = enem.filter(e => e.alive);

  if (aliveEnemies.length === 0) {
    nextLevel();
  }
}

function nextLevel() {
  level += 1;

  document.getElementById("level").textContent = `Level: ${level}`;

  // clear leftover bullets
  for (let i = 0; i < bullets.length; i++) bullets[i].el.remove();
  bullets = [];

  for (let i = 0; i < enemyBullets.length; i++) enemyBullets[i].el.remove();
  enemyBullets = [];

  // reset enemies
  document.getElementById("enemies").innerHTML = "";
  buildEnemies();
  createEnemies();
  renderEnemies();

  // make enemies faster each level
  speed = 2 + (level - 1) * 0.5;
}

// =========================
// BUILD ENEMIES
// =========================

function buildEnemies() {
  enem = [];

  const rows = 4;
  const cols = 6;

  const gameWidth = getGameWidth();

  const spacingX = gameWidth / (cols + 4);
  const spacingY = 40;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      enem.push({
        left: spacingX + col * spacingX - ENEMY_WIDTH / 2,

        top: 30 + row * spacingY,

        type: row % enemySprites.length,

        alive: true,
      });
    }
  }
}

// =========================
// CREATE ENEMIES
// =========================

function createEnemies() {
  const enemiesDiv = document.getElementById("enemies");

  enemiesDiv.innerHTML = "";

  for (let i = 0; i < enem.length; i++) {
    const el = document.createElement("div");

    el.className = "enemy";

    el.style.backgroundImage = `url('${enemySprites[enem[i].type]}')`;

    enemiesDiv.appendChild(el);

    enem[i].el = el;
  }
}

function renderEnemies() {
  for (let i = 0; i < enem.length; i++) {
    if (!enem[i].alive) continue;

    enem[i].el.style.transform =
      `translate(${enem[i].left}px, ${enem[i].top}px)`;
  }
}

// =========================
// MOVE ENEMIES
// =========================

let speed = 2;
let direction = 1;
let dropDistance = 20;

function moveEnemies() {
  let hitWall = false;

  const gameWidth = getGameWidth();

  for (let i = 0; i < enem.length; i++) {
    if (!enem[i].alive) continue;

    enem[i].left += speed * direction;

    if (direction === 1 && enem[i].left + ENEMY_WIDTH >= gameWidth) {
      hitWall = true;
    }

    if (direction === -1 && enem[i].left <= 0) {
      hitWall = true;
    }
  }

  if (hitWall) {
    direction *= -1;

    for (let i = 0; i < enem.length; i++) {
      if (!enem[i].alive) continue;

      enem[i].top += dropDistance;
    }
  }
}

// =========================
// PLAYER
// =========================

let keys = {};
let isPaused = false;

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key === "Escape" && !isGameOver) {

    isPaused = !isPaused;

    if (isPaused) {
      document.getElementById("pause-menu").style.display = "flex";
    } else {
      document.getElementById("pause-menu").style.display = "none";
    }
  }
});

const continueBtn = document.getElementById("continue-btn");

continueBtn.addEventListener("click", () => {

  document.getElementById("pause-menu").style.display = "none";
  isPaused = !isPaused;
});

const restartBtn = document.getElementById("restart-btn");

restartBtn.addEventListener("click", () => {

  document.getElementById("pause-menu").style.display = "none";
  isPaused = !isPaused;
  restartGame();
});

function restartGame() {
  //Reset timer
  startTime = null;
  elapsedSeconds = 0;
  // Reset score
  lives = 3;
  updateLivesDisplay();
  score = 0;
  updateScoreDisplay();

  // Reset bullets
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].el.remove();
  }

  bullets = [];

  // Reset enemies
  document.getElementById("enemies").innerHTML = "";

  buildEnemies();
  createEnemies();
  renderEnemies();
  // Reset Bullets
  for (let i = 0; i < enemyBullets.length; i++){
    enemyBullets[i].el.remove();
  }
  enemyBullets = [];
  lastEnemyShotTime = 0;
  // Reset player
  initPlayer();

  level = 1;
  speed = 2;
  document.getElementById("level").textContent = `Level: 1`;

  // Reset game variables
  direction = 1;
  lastShotTime = 0;
  keys = {};
  isPaused = false;
  isGameOver = false;
}

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});


function movePlayer() {
  const gameWidth = getGameWidth();

  if (keys["ArrowLeft"]) {
    hero.left -= hero.speed;
  }

  if (keys["ArrowRight"]) {
    hero.left += hero.speed;
  }

  if (hero.left < 0) {
    hero.left = 0;
  }

  if (hero.left > gameWidth - PLAYER_WIDTH) {
    hero.left = gameWidth - PLAYER_WIDTH;
  }

  document.getElementById("player").style.transform =
    `translateX(${hero.left}px)`;
}

function initPlayer() {
  hero.left = getGameWidth() / 2 - PLAYER_WIDTH / 2;

  document.getElementById("player").style.transform =
    `translateX(${hero.left}px)`;
}

// =========================
// BULLETS
// =========================

let bullets = [];

const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 14;
const BULLET_SPEED = 8;

const SHOOT_COOLDOWN_MS = 250;

let lastShotTime = 0;

let enemyBullets = [];

const ENEMY_BULLET_SPEED = 4;
const ENEMY_SHOOT_INTERVAL = 1000; // every 1 second

let lastEnemyShotTime = 0;

function shoot(now) {
  if (!keys[" "]) return;

  if (now - lastShotTime < SHOOT_COOLDOWN_MS) return;

  lastShotTime = now;

  const el = document.createElement("div");

  el.className = "bullet";

  document.getElementById("bullets").appendChild(el);

  bullets.push({
    left: hero.left + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,

    top: getGameHeight() - 60,

    el,
  });
}

function moveBullets() {
  // Loop backwards so we can safely remove items while iterating.
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].top -= BULLET_SPEED;

    // Remove bullet once it goes above the screen.
    if (bullets[i].top + BULLET_HEIGHT < 0) {
      bullets[i].el.remove(); // take it out of the DOM

      bullets.splice(i, 1); // take it out of our array
    }
  }
}

function renderBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].el.style.transform =
      `translate(${bullets[i].left}px, ${bullets[i].top}px)`;
  }
}

function enemyShoot(now) {
  if (now - lastEnemyShotTime < ENEMY_SHOOT_INTERVAL) return;

  lastEnemyShotTime = now;

  // collect only alive enemies
  const aliveEnemies = enem.filter(e => e.alive);

  if (aliveEnemies.length === 0) return;

  // pick a random one
  const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];

  const el = document.createElement("div");
  el.className = "enemy-bullet";
  document.getElementById("bullets").appendChild(el);

  enemyBullets.push({
    left: shooter.left + ENEMY_WIDTH / 2 - 2,  // center of the enemy
    top: shooter.top + ENEMY_HEIGHT,            // bottom of the enemy
    el,
  });
}

function moveEnemyBullets() {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    enemyBullets[i].top += ENEMY_BULLET_SPEED;  // move downward

    // remove if it goes off screen
    if (enemyBullets[i].top > getGameHeight()) {
      enemyBullets[i].el.remove();
      enemyBullets.splice(i, 1);
      continue;
    }

    // check if it hit the player
    const playerBottom = getGameHeight() - 20;         // matches #player bottom: 20px
    const playerTop = playerBottom - 50;               // approximate player height

    if (isColliding(
      enemyBullets[i].left, enemyBullets[i].top, 4, 14,   // bullet box
      hero.left, playerTop, PLAYER_WIDTH, 50               // player box
    )) {
      enemyBullets[i].el.remove();
      enemyBullets.splice(i, 1);
      loseLife();  // reuse the function you already have!
      continue;
    }

    // render
    enemyBullets[i].el.style.transform =
      `translate(${enemyBullets[i].left}px, ${enemyBullets[i].top}px)`;
  }
}

// =========================
// COLLISIONS
// =========================

let score = 0;

function isColliding(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function checkCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];

    let bulletHit = false;

    for (let j = 0; j < enem.length; j++) {
      const e = enem[j];

      if (!e.alive) continue;

      if (isColliding(b.left, b.top, BULLET_WIDTH, BULLET_HEIGHT, e.left, e.top, ENEMY_WIDTH, ENEMY_HEIGHT,)) {
        e.alive = false;

        e.el.remove();

        score += 10;

        updateScoreDisplay();

        bulletHit = true;

        break;
      }
    }

    if (bulletHit) {
      bullets[i].el.remove();

      bullets.splice(i, 1);
    }
  }
}

function updateScoreDisplay() {
  document.getElementById("score").textContent = `Score: ${score}`;
}
let isGameOver = false;
function showGameOver() {
  isPaused = true;
  isGameOver = true;
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  document.getElementById("final-score").textContent = `Final Score: ${score}`;
  document.getElementById("final-time").textContent = `Time: ${mm}:${ss}`;

  document.getElementById("game-over").style.display = "flex";
}

document.getElementById("play-again").addEventListener("click", () => {
  document.getElementById("game-over").style.display = "none";
  restartGame();
});

// =========================
// RESIZE
// =========================

window.addEventListener("resize", () => {
  document.getElementById("enemies").innerHTML = "";

  buildEnemies();

  createEnemies();

  renderEnemies();

  initPlayer();
});

// =========================
// GAME LOOP
// =========================

function gameLoop(now) {

  if (!isPaused) {
    updateTimer(now);

    moveEnemies();

    renderEnemies();

    movePlayer();

    shoot(now);

    moveBullets();

    renderBullets();

    checkCollisions();

    checkEnemiesReachedBottom();

    enemyShoot(now);
    
    moveEnemyBullets();

    checkWinCondition(); 
  }
  requestAnimationFrame(gameLoop);
}

// =========================
// START
// =========================

buildEnemies();

initPlayer();

createEnemies();

renderEnemies();

requestAnimationFrame(gameLoop);
