let enem = [];
const enemySprites = [
    "assets/red.png",
    "assets/enemy2.png",
    "assets/enemy3.png",
    "assets/red.png",
    "assets/enemy2.png",
    "assets/enemy3.png",   
];
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 32;

let hero = {
  left: 0,
  top: 20,
  speed: 5,
};
const PLAYER_WIDTH = 70;

for (let row = 0; row < 6; row++) {
  for (let col = 0; col < 8; col++) {
    enem.push({
      left: 50 + col * 50,
      top: 30 + row * 50,
      type: row,
      alive: true,
    });
  }
}

function createEnemies() {
  const enemiesDiv = document.getElementById("enemies");

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

function getGameWidth() {
  return document.getElementById("game").offsetWidth;
}

let speed = 2;
let direction = 1;
let dropDistance = 20;

function moveEnemies() {
  let hitWall = false;

  const gameWidth = getGameWidth();

  for (let i = 0; i < enem.length; i++) {
    enem[i].left += speed * direction;

    // right wall
    if (direction === 1 && enem[i].left + ENEMY_WIDTH >= gameWidth) {
      hitWall = true;
    }

    // left wall
    if (direction === -1 && enem[i].left <= 0) {
      hitWall = true;
    }
  }

  if (hitWall) {
    direction *= -1;

    for (let i = 0; i < enem.length; i++) {
      enem[i].top += dropDistance;
    }
  }
}

let keys = {};

document.addEventListener("keydown", function (e) {
  keys[e.key] = true;
});

document.addEventListener("keyup", function (e) {
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

  // left limit
  if (hero.left < 0) {
    hero.left = 0;
  }

  // right limit
  if (hero.left > gameWidth - PLAYER_WIDTH) {
    hero.left = gameWidth - PLAYER_WIDTH;
  }

  document.getElementById("player").style.transform =
    `translateX(${hero.left}px)`;
}

function initPlayer() {
  hero.left = getGameWidth() / 2;

  document.getElementById("player").style.transform =
    `translateX(${hero.left}px)`;
}

// ---------- BULLETS ----------

let bullets = []; // each bullet: { left, top, el }

const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 14;
const BULLET_SPEED = 8;       // px moved per frame, going up (negative top)
const SHOOT_COOLDOWN_MS = 250; // min time between shots while holding space

let lastShotTime = 0;

function shoot(now) {
  // Only fire if space is held AND enough time passed since last shot.
  // This keeps fire rate steady even if the browser's key-repeat is
  // inconsistent, and prevents "spam the key" style shooting.
  if (!keys[" "]) return;

  if (now - lastShotTime < SHOOT_COOLDOWN_MS) return;

  lastShotTime = now;

  const el = document.createElement("div");
  el.className = "bullet";
  document.getElementById("bullets").appendChild(el);

  // Spawn the bullet centered on top of the player.
  const startLeft = hero.left + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2;
  const startTop = getGameHeight() - 20 - 40; // near player's top edge

  bullets.push({
    left: startLeft,
    top: startTop,
    el: el,
  });
}

function getGameHeight() {
  return document.getElementById("game").offsetHeight;
}

function moveBullets() {
  // Loop backwards so we can safely remove items while iterating.
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].top -= BULLET_SPEED;

    // Remove bullet once it goes above the screen.
    if (bullets[i].top + BULLET_HEIGHT < 0) {
      bullets[i].el.remove();   // take it out of the DOM
      bullets.splice(i, 1);     // take it out of our array
    }
  }
}

function renderBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].el.style.transform =
      `translate(${bullets[i].left}px, ${bullets[i].top}px)`;
  }
}

// ---------- COLLISIONS ----------

let score = 0;

// Simple rectangle-overlap check (AABB = Axis-Aligned Bounding Box).
// Two rectangles overlap if they overlap on BOTH the x-axis and y-axis.
function isColliding(ax, ay, aw, ah, bx, by, bw, bh) {
  return (
    ax < bx + bw &&
    ax + aw > bx &&
    ay < by + bh &&
    ay + ah > by
  );
}

function checkCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    let bulletHit = false;

    for (let j = 0; j < enem.length; j++) {
      const e = enem[j];

      if (!e.alive) continue;

      const hit = isColliding(
        b.left, b.top, BULLET_WIDTH, BULLET_HEIGHT,
        e.left, e.top, ENEMY_WIDTH, ENEMY_HEIGHT
      );

      if (hit) {
        // enemy dies
        e.alive = false;
        e.el.remove();

        // award points
        score += 10;
        updateScoreDisplay();

        bulletHit = true;
        break; // one bullet can only hit one enemy
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

// ---------- GAME LOOP ----------

function gameLoop(now) {
  moveEnemies();
  renderEnemies();

  movePlayer();

  shoot(now);
  moveBullets();
  renderBullets();

  checkCollisions();

  requestAnimationFrame(gameLoop);
}

initPlayer();

createEnemies();   // build the 80 enemy divs ONCE
renderEnemies();   // position them before the loop starts

requestAnimationFrame(gameLoop);