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

let hero = {
  left: 0,
  top: 20,
  speed: 5,
};

for (let row = 0; row < 10; row++) {
  for (let col = 0; col < 8; col++) {
    enem.push({
      left: 50 + col * 50,
      top: 30 + row * 50,
      type: row,
    });
  }
}

function drawEnemeis() {
    const enemiesDiv = document.getElementById("enemies");

    enemiesDiv.innerHTML = "";

    for (let i = 0; i < enem.length; i++) {

        enemiesDiv.innerHTML += `
    <div
        class="enemy"
        style="
            left:${enem[i].left}px;
            top:${enem[i].top}px;
            background-image:url('${enemySprites[enem[i].type]}');
        ">
    </div>
`;
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

  const playerWidth = 70;

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
  if (hero.left > gameWidth - playerWidth) {
    hero.left = gameWidth - playerWidth;
  }

  document.getElementById("player").style.left = hero.left + "px";
}

function initPlayer() {
  hero.left = getGameWidth() / 2;

  document.getElementById("player").style.left = hero.left + "px";
}

function gameLoop() {
  moveEnemies();

  movePlayer();

  drawEnemeis();

  requestAnimationFrame(gameLoop);
}

initPlayer();

drawEnemeis();

gameLoop();
