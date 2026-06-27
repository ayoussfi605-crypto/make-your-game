import { state } from "./state.js";

export function getEnemyWidth() {
  return document.querySelector(".enemy")?.offsetWidth || 40;
}

export function getEnemyHeight() {
  return document.querySelector(".enemy")?.offsetHeight || 32;
}

export function getPlayerWidth() {
  return document.querySelector("#player img")?.offsetWidth || 70;
}

export function getGameWidth() {
  return document.getElementById("game").offsetWidth;
}

export function getGameHeight() {
  return document.getElementById("game").offsetHeight;
}
