import { Ship } from "./ship.js";

class Cell {
  constructor() {
    this.hasShip = false;
    this.hit = false;
    this.miss = false;
    this.ship = null;
  }
  placeShip(ship) {
    this.hasShip = true;
    this.ship = ship;
  }
  markHits() {
    this.hit = true;
  }
  markMisses() {
    this.miss = true;
  }
}

export class Gameboard {
  #gameboard;
  #placedShips;
  #destroyedShips;
  constructor() {
    this.#gameboard = this.#createBoard();
    this.#placedShips = 0;
    this.#destroyedShips = 0;
  }
  #createBoard() {
    const grid = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(new Cell());
      }
      grid.push(row);
    }
    return grid;
  }
  getGameboard() {
    return this.#gameboard;
  }
  addShip(row, column, ship, direction) {
    let length = ship.getLength();
    if (row < 0 || row > 9 || column < 0 || column > 9) {
      throw new Error("The coordinates must be from 0 to 9");
    }
    if (direction === "horizontal") {
      if (column + length > 9) {
        throw new Error("Ship must be fully on the board");
      }
      for (let i = column; i < column + length; i++) {
        if (this.#gameboard[row][i].hasShip) {
          throw new Error("There is already a ship occupied try something");
        }
      }
      for (let i = column; i < column + length; i++) {
        const cell = this.#gameboard[row][i];
        cell.placeShip(ship);
      }
      this.#placedShips++;
    } else if (direction === "vertical") {
      if (row + length > 9) {
        throw new Error("Ship must be fully on the board");
      }
      for (let i = row; i < row + length; i++) {
        if (this.#gameboard[i][column].hasShip) {
          throw new Error("There is already a ship occupied try something");
        }
      }
      for (let i = row; i < row + length; i++) {
        const cell = this.#gameboard[i][column];
        cell.placeShip(ship);
      }
      this.#placedShips++;
    }
  }
  receiveAttack(row, column) {
    if (row < 0 || row > 9 || column < 0 || column > 9) {
      throw new Error("Attack coordinates must be 0 to 9");
    }
    const coordinate = this.#gameboard[row][column];
    if (coordinate.hit || coordinate.miss) {
      throw new Error("The spot is already attacked");
    }
    const shipCheck = this.#gameboard[row][column].hasShip;
    if (shipCheck) {
      coordinate.markHits();
      coordinate.ship.hit();
      if (coordinate.ship.isSunk()) {
        this.#destroyedShips++;
      }
    } else {
      coordinate.markMisses();
    }
  }
  allShipSunk() {
    while (this.#placedShips > 0) {
      if (this.#placedShips === this.#destroyedShips) {
        return true;
      }
      return false;
    }
  }
  placeRandomShip(ship) {
    const row = Math.floor(Math.random() * 10);
    const column = Math.floor(Math.random() * 10);
    const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
    this.addShip(row, column, ship, direction);
  }
  retryTillSuccess(callback) {
    while (true) {
      try {
        callback();
        break;
      } catch (error) {
        console.log(error);
      }
    }
  }
  placeFiveRandomShips() {
    this.retryTillSuccess(() => this.placeRandomShip(new Ship(5)));
    this.retryTillSuccess(() => this.placeRandomShip(new Ship(4)));
    this.retryTillSuccess(() => this.placeRandomShip(new Ship(3)));
    this.retryTillSuccess(() => this.placeRandomShip(new Ship(2)));
    this.retryTillSuccess(() => this.placeRandomShip(new Ship(2)));
  }
  getIndexWithShips() {
    const array = [];
    for(let i = 0; i < 10; i++) {
      for(let j = 0; j < 10; j++) {
        if(this.#gameboard[i][j].hasShip) {
          array.push(`${i}${j}`);
        }
      }
    }
    return array;
  }
  resetGameboard() {
    this.#gameboard = this.#createBoard();
    this.#placedShips = 0;
    this.#destroyedShips = 0;
  }
}
