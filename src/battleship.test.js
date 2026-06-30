import { Gameboard } from "./gameBoard.js";
import { Ship } from "./ship.js";
import { Player } from "./player.js";

test("basic test", function () {
  expect(1 + 1).toBe(2);
});

describe("Ship Class", function () {
  let newShip;
  beforeEach(function () {
    newShip = new Ship(5);
  });

  it("should be falsy when whole ship isn't hit", function () {
    newShip.hit();
    expect(newShip.isSunk()).toBe(false);
  });
  it("should be truthy when whole ship is hit", function () {
    for (let i = 0; i < 5; i++) {
      newShip.hit();
    }
    expect(newShip.isSunk()).toBe(true);
  });
});

function getCellsWithShipsCounts(board) {
  let count = 0;
  board.getGameboard().forEach((row) => {
    row.forEach((cell) => {
      if (cell.hasShip) {
        count++;
      }
    });
  });
  return count;
}
describe("Gameboard Class", function () {
  let gameboard;
  beforeEach(function () {
    gameboard = new Gameboard();
  });
  it("should build gameboard with 10 x 10 cells", function () {
    expect(Gameboard).toBeDefined();
    expect(gameboard.getGameboard().length).toBe(10);
  });

  it("should place ship on board as expected horizontally or vertically", function () {
    gameboard.addShip(0, 0, new Ship(3), "horizontal");
    for (let i = 0; i < 3; i++) {
      expect(gameboard.getGameboard()[0][i].hasShip).toBe(true);
    }
    gameboard.addShip(2, 2, new Ship(5), "vertical");
    for (let i = 2; i < 7; i++) {
      expect(gameboard.getGameboard()[i][2].hasShip).toBe(true);
    }
  });

  it("should throw error for out of range attacks", function () {
    const testCases = [
      { row: 13, column: 7 },
      { row: -4, column: 8 },
      { row: 5, column: 48 },
      { row: 6, column: -33 },
    ];
    testCases.forEach((t) => {
      expect(() => gameboard.receiveAttack(t.row, t.column)).toThrow(
        new Error("Attack coordinates must be 0 to 9"),
      );
    });
  });

  it("should throw error when try to attack the same cell more than once", function () {
    gameboard.addShip(2, 2, new Ship(4), "vertical");
    gameboard.receiveAttack(3, 2);
    expect(() => gameboard.receiveAttack(3, 2)).toThrow(
      new Error("The spot is already attacked"),
    );
  });

  it("should throw error for out of range ship placement", function () {
    const testCases = [
      { row: 13, column: 7, direction: "horizontal" },
      { row: -4, column: 8, direction: "vertical" },
      { row: 5, column: 48, direction: "vertical" },
      { row: 6, column: -33, direction: "horizontal" },
    ];
    testCases.forEach((t) => {
      expect(() =>
        gameboard.addShip(t.row, t.column, new Ship(4), t.direction),
      ).toThrow(new Error("The coordinates must be from 0 to 9"));
    });
    expect(() => gameboard.addShip(9, 9, new Ship(3), "horizontal")).toThrow(
      new Error("Ship must be fully on the board"),
    );
    expect(() => gameboard.addShip(8, 3, new Ship(4), "vertical")).toThrow(
      new Error("Ship must be fully on the board"),
    );
  });

  it("should throw error if coordinate is already occupied by ship", function () {
    gameboard.addShip(4, 4, new Ship(4), "horizontal");
    expect(() => gameboard.addShip(4, 1, new Ship(4), "horizontal")).toThrow(
      new Error("There is already a ship occupied try something"),
    );
    expect(() => gameboard.addShip(2, 5, new Ship(5), "vertical")).toThrow(
      new Error("There is already a ship occupied try something"),
    );
  });

  it("should place 5 ships on the board with no errors", function () {
    gameboard.placeFiveRandomShips();
    const counts = getCellsWithShipsCounts(gameboard);
    expect(counts).toBe(16);
  });
});

describe("Player Class", function () {
  let player;
  let computer;
  beforeEach(function () {
    player = new Player("player");
    computer = new Player("computer");
  });
  it("should place ships in players' boards", function () {
    player.gameboard.placeFiveRandomShips();
    computer.gameboard.placeFiveRandomShips();
    const countForPlayer = getCellsWithShipsCounts(player.gameboard);
    const countForComputer = getCellsWithShipsCounts(computer.gameboard);
    expect(countForPlayer).toBe(16);
    expect(countForComputer).toBe(16);
  });
  it("should have correct logic for all ships sunk or not", function () {
    player.gameboard.placeFiveRandomShips();
    computer.gameboard.placeFiveRandomShips();
    for (let i = 0; i < 10; i++) {
      player.gameboard.receiveAttack(0, i);
      computer.gameboard.receiveAttack(0, i);
    }
    expect(player.gameboard.allShipSunk()).toBe(false);
    expect(computer.gameboard.allShipSunk()).toBe(false);
    for (let i = 1; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        player.gameboard.receiveAttack(i, j);
        computer.gameboard.receiveAttack(i, j);
      }
    }
    expect(player.gameboard.allShipSunk()).toBe(true);
    expect(computer.gameboard.allShipSunk()).toBe(true);
  });
});
