import { state } from "./state.js";
import { updateScoreDisplay } from "./ui.js";
import { getEnemyWidth, getEnemyHeight } from "./dom.js";

export function isColliding(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function checkCollisions() {
  const enemyWidth = getEnemyWidth();
  const enemyHeight = getEnemyHeight();

  for (let i = state.bullets.length - 1; i >= 0; i--) {
    const b = state.bullets[i];
    let bulletHit = false;

    for (let j = 0; j < state.enem.length; j++) {
      const e = state.enem[j];
      if (!e.alive) continue;

      if (
        isColliding(
          b.left,
          b.top,
          4,
          14,
          e.left,
          e.top,
          enemyWidth,
          enemyHeight,
        )
      ) {
        e.alive = false;
        e.el.remove();
        state.score += 10;
        updateScoreDisplay();
        bulletHit = true;
        break;
      }
    }

    if (bulletHit) {
      b.el.remove();
      state.bullets.splice(i, 1);
    }
  }
}
