import { Gameboard } from "./gameBoard.js";

export class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
  }
}
