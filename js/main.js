import { state } from "./state.js";
import { setupControls, startGame } from "./game.js";
import {
  updateScoreDisplay,
  updateLivesDisplay,
  updateLevelDisplay,
} from "./ui.js";
import { updateTimer } from "./ui.js";
import { movePlayer } from "./player.js";
import {
  shoot,
  moveBullets,
  renderBullets,
  enemyShoot,
  moveEnemyBullets,
} from "./bullets.js";
import {
  moveEnemies,
  renderEnemies,
  checkEnemiesReachedBottom,
  checkWinCondition,
} from "./enemies.js";
import { checkCollisions } from "./collisions.js";
import { loseLife } from "./lives.js";

function gameLoop(now) {
  if (!state.isPaused) {
    updateTimer(now);
    moveEnemies();
    renderEnemies();
    movePlayer();
    shoot(now);
    moveBullets();
    renderBullets();
    checkCollisions();
    checkEnemiesReachedBottom(loseLife);
    enemyShoot(now);
    moveEnemyBullets();
    checkWinCondition();
  }

  requestAnimationFrame(gameLoop);
}

setupControls();
updateScoreDisplay();
updateLivesDisplay();
updateLevelDisplay();
startGame();
requestAnimationFrame(gameLoop);
