import { Player } from "./player.js";

export class DOMcontroller {
  gameStartBtn = document.querySelector(".start-game");
  gameRestartBtn = document.querySelector(".restart-game");
  shipPlacementBtn = document.querySelector(".place-ships");
  hiddenBtn = document.querySelector(".hide-button");
  container = document.querySelector(".container");
  playerBoard = document.querySelector(".player-board");
  computerBoard = document.querySelector(".computer-board");
  alertDialog = document.querySelector(".alert-dialog");
  alertMessage = document.querySelector(".alert-message");
  closeAlertBtn = document.querySelector(".alert-close");
  winnerDialog = document.querySelector(".winner-dialog");
  winnerMessage = document.querySelector(".winner-message");
  startNewGameBtn = document.querySelector(".new-game");
  isShipPlacementBtnClicked = false;
  constructor() {
    this.player = new Player("player");
    this.computer = new Player("computer");
    this.#createBoard();
    this.computerAttacks = new Set();
  }
  #createBoard() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const divPlayer = document.createElement("div");
        divPlayer.classList.add("cell");
        const divComputer = divPlayer.cloneNode(true);
        divPlayer.setAttribute("player", `${i}${j}`);
        divComputer.setAttribute("computer", `${i}${j}`);
        this.playerBoard.appendChild(divPlayer);
        this.computerBoard.appendChild(divComputer);
      }
    }
  }
  #resetBoardRender() {
    const playerCells = this.playerBoard.querySelectorAll("div");
    playerCells.forEach((cell) => {
      cell.removeAttribute("board");
    });
    this.player.gameboard.resetGameboard();
    this.computer.gameboard.resetGameboard();
  }
  #renderShips() {
    this.player.gameboard.placeFiveRandomShips();
    this.computer.gameboard.placeFiveRandomShips();
    // this.computer.gameboard.addShip(0, 0, new Ship(3), "horizontal");
    const shipCoordinates = this.player.gameboard.getIndexWithShips();
    shipCoordinates.forEach((point) => {
      const targetElement = document.querySelector(`[player="${point}"]`);
      targetElement.setAttribute("board", "ship");
    });
  }
  #attackComputerBoard(target, row, column) {
    this.computer.gameboard.receiveAttack(row, column);
    if (this.computer.gameboard.getGameboard()[row][column].miss) {
      target.setAttribute("board", "miss");
    } else if (this.computer.gameboard.getGameboard()[row][column].hit) {
      target.setAttribute("board", "hit");
    }
  }
  #createRandomCoordinate() {
    const row = Math.floor(Math.random() * 10);
    const column = Math.floor(Math.random() * 10);
    return `${row}${column}`;
  }
  #attackPlayerBoard() {
    let coordinate = this.#createRandomCoordinate();
    while (this.computerAttacks.has(coordinate)) {
      coordinate = this.#createRandomCoordinate();
    }
    this.computerAttacks.add(coordinate);
    const coordinateArray = coordinate.split("");
    const target = document.querySelector(`[player="${coordinate}"]`);
    this.player.gameboard.receiveAttack(coordinateArray[0], coordinateArray[1]);
    if (
      this.player.gameboard.getGameboard()[coordinateArray[0]][
        coordinateArray[1]
      ].miss
    ) {
      target.setAttribute("board", "miss");
    } else if (
      this.player.gameboard.getGameboard()[coordinateArray[0]][
        coordinateArray[1]
      ].hit
    ) {
      target.setAttribute("board", "hit");
    }
    if (this.player.gameboard.allShipSunk()) {
      this.winnerDialog.showModal();
      this.winnerMessage.textContent = "The Computer Won";
    }
  }
  #resetGame() {
    this.player = new Player("player");
    this.computer = new Player("computer");
    this.computerAttacks = new Set();
    const computerCells = this.computerBoard.querySelectorAll("div");
    computerCells.forEach((cell) => {
      cell.removeAttribute("board");
    });
    this.#renderShips();
  }
  onClickFunctions() {
    this.shipPlacementBtn.addEventListener("click", () => {
      this.#resetBoardRender();
      this.#renderShips();
      this.isShipPlacementBtnClicked = true;
    });
    this.gameStartBtn.addEventListener("click", () => {
      if (!this.isShipPlacementBtnClicked) {
        this.alertDialog.showModal();
        this.alertMessage.textContent = "Please place the ships first";
        return;
      }
      this.shipPlacementBtn.classList.add("disable-button-click");
      this.computerBoard.classList.remove("disable-button-click");
    });
    this.computerBoard.addEventListener("click", (event) => {
      const targetElement = event.target.closest(".cell");
      if (!targetElement) {
        return;
      }
      const coordinate = targetElement.getAttribute("computer").split("");
      try {
        this.#attackComputerBoard(targetElement, coordinate[0], coordinate[1]);
        if (this.computer.gameboard.allShipSunk()) {
          this.winnerDialog.showModal();
          this.winnerMessage.textContent = "The Player Won";
          return;
        }
      } catch (error) {
        this.alertDialog.showModal();
        this.alertMessage.textContent = error.message;
        return;
      }
      this.#attackPlayerBoard();
    });
    this.closeAlertBtn.addEventListener("click", () => {
      this.alertDialog.close();
    });
    this.startNewGameBtn.addEventListener("click", () => {
      this.winnerDialog.close();
      this.#resetGame();
      this.#resetBoardRender();
      this.isShipPlacementBtnClicked = false;
      this.shipPlacementBtn.classList.remove("disable-button-click");
      this.computerBoard.classList.add("disable-button-click");
      this.hiddenBtn.classList.add("hide-button");
    });
    this.gameRestartBtn.addEventListener("click", () => {
      this.hiddenBtn.classList.remove("hide-button");
      this.winnerDialog.showModal();
      this.winnerMessage.textContent = "Are You sure to restart the game?";
    });
    this.hiddenBtn.addEventListener("click", () => {
      this.winnerDialog.close();
      this.hiddenBtn.classList.add("hide-button");
    });
  }
}
