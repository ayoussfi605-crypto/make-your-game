import { state } from "./state.js";
import { updateLivesDisplay, showGameOver } from "./ui.js";

export function loseLife() {
  state.lives -= 1;
  updateLivesDisplay();

  if (state.lives <= 0) {
    showGameOver();
  }
}
