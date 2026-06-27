import { state } from "./state.js";
import { getGameWidth, getPlayerWidth } from "./dom.js";

export function initPlayer() {
  state.hero.left = getGameWidth() / 2 - getPlayerWidth() / 2;
  document.getElementById("player").style.transform =
    `translateX(${state.hero.left}px)`;
}

export function movePlayer() {
  const gameWidth = getGameWidth();

  if (state.keys["ArrowLeft"]) {
    state.hero.left -= state.hero.speed;
  }

  if (state.keys["ArrowRight"]) {
    state.hero.left += state.hero.speed;
  }

  if (state.hero.left < 0) {
    state.hero.left = 0;
  }

  if (state.hero.left > gameWidth - getPlayerWidth()) {
    state.hero.left = gameWidth - getPlayerWidth();
  }

  document.getElementById("player").style.transform =
    `translateX(${state.hero.left}px)`;
}
