let enem = [];

const enemySprites = [
    "assets/red.png",
    "assets/enemy2.png",
    "assets/enemy3.png"
];

const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 32;

const PLAYER_WIDTH = 70;

let hero = {
    left: 0,
    top: 20,
    speed: 5,
};

function getGameWidth() {
    return document.getElementById("game").offsetWidth;
}

function getGameHeight() {
    return document.getElementById("game").offsetHeight;
}

// =========================
// BUILD ENEMIES
// =========================

function buildEnemies() {

    enem = [];

    const rows = 4;
    const cols = 6;

    const gameWidth = getGameWidth();
  
    const spacingX = gameWidth / (cols +4);
    const spacingY = 40; 

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            enem.push({

                left: spacingX + col * spacingX - ENEMY_WIDTH / 2,

                top: 30 + row * spacingY,

                type: row % enemySprites.length,

                alive: true

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

        el.style.backgroundImage =
            `url('${enemySprites[enem[i].type]}')`;

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

        if (
            direction === 1 &&
            enem[i].left + ENEMY_WIDTH >= gameWidth
        ) {
            hitWall = true;
        }

        if (
            direction === -1 &&
            enem[i].left <= 0
        ) {
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

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

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

    hero.left =
        getGameWidth() / 2 -
        PLAYER_WIDTH / 2;

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

function shoot(now) {

    if (!keys[" "]) return;

    if (
        now - lastShotTime <
        SHOOT_COOLDOWN_MS
    ) return;

    lastShotTime = now;

    const el =
        document.createElement("div");

    el.className = "bullet";

    document
        .getElementById("bullets")
        .appendChild(el);

    bullets.push({

        left:
            hero.left +
            PLAYER_WIDTH / 2 -
            BULLET_WIDTH / 2,

        top:
            getGameHeight() - 60,

        el

    });

}

function moveBullets() {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        bullets[i].top -= BULLET_SPEED;

        if (
            bullets[i].top +
            BULLET_HEIGHT < 0
        ) {

            bullets[i].el.remove();

            bullets.splice(i, 1);

        }

    }

}

function renderBullets() {

    for (
        let i = 0;
        i < bullets.length;
        i++
    ) {

        bullets[i].el.style.transform =
            `translate(${bullets[i].left}px, ${bullets[i].top}px)`;

    }

}

// =========================
// COLLISIONS
// =========================

let score = 0;

function isColliding(
    ax, ay, aw, ah,
    bx, by, bw, bh
) {

    return (

        ax < bx + bw &&
        ax + aw > bx &&
        ay < by + bh &&
        ay + ah > by

    );

}

function checkCollisions() {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const b = bullets[i];

        let bulletHit = false;

        for (
            let j = 0;
            j < enem.length;
            j++
        ) {

            const e = enem[j];

            if (!e.alive) continue;

            if (
                isColliding(
                    b.left,
                    b.top,
                    BULLET_WIDTH,
                    BULLET_HEIGHT,
                    e.left,
                    e.top,
                    ENEMY_WIDTH,
                    ENEMY_HEIGHT
                )
            ) {

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

    document.getElementById("score").textContent =
        `Score: ${score}`;

}

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

    moveEnemies();

    renderEnemies();

    movePlayer();

    shoot(now);

    moveBullets();

    renderBullets();

    checkCollisions();

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