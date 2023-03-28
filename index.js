/* eslint-disable prefer-template */
/* eslint-disable no-unused-expressions */

let board = [];
let ownBoard = [];

const gamePhase = {
  phase: "placement",
  attackTurn: "ai",
  currentLevel: "",
  maxShip: 0,
  mapSize: 0,
  shipTypes: [],
};

function generateSettings(data) {
  let [size, ...positions] = data.split(",");
  let stringShipArray = positions.join(",").slice(3, -1).split(",");

  let shipArray = [];
  for (let i = 0; i < stringShipArray.length; i++) {
    shipArray.push(stringShipArray[i].split(":")[1]);
  }

  gamePhase.mapSize = size.split(":")[1];
  gamePhase.maxShips = shipArray.length;

  generateMap(shipArray, gamePhase.mapSize);
}

function placeAiShip(ship) {
  for (let i = 0; i < ship.length; i++) {
    //-------------------------------
    gamePhase.shipTypes.push(ship[i].length / 2);
    //-------------------------------

    let start_x = ship[i].split("")[0].charCodeAt(0) - 97;
    let start_y = Number(ship[i].split("")[1]) - 1;

    let end_x = ship[i][ship[i].length - 2].charCodeAt(0) - 97;
    let end_y = Number(ship[i][ship[i].length - 1]) - 1;

    for (let x = start_x; x <= end_x; x++) {
      for (let y = start_y; y <= end_y; y++) {
        board[x][y] = `${ship[i].length / 2}`;
      }
    }
  }

  displayBoard({ boardnumber: 1, board: board });
}

function generateMap(ship, size) {
  board = [];
  ownBoard = [];

  for (let i = 0; i < size; i++) {
    if (!board[i] || !ownBoard[i]) {
      board[i] = [];
      ownBoard[i] = [];
    }
    for (let j = 0; j < size; j++) {
      if (!board[i][j] || !ownBoard[i][j]) {
        board[i][j] = [];
        ownBoard[i][j] = [];
      }

      board[i][j] = "";
      ownBoard[i][j] = "";
    }
  }

  displayBoard({ boardnumber: 1, board: board });
  displayBoard({ boardnumber: 2, board: ownBoard });
  placeAiShip(ship);
}

function selectGame(data) {
  resetGamePhase();
  gamePhase.currentLevel = data;

  generateSettings(data);
}

function handleClick(data) {
  displayMessage(data.x + data.y + data.clickType + data.tableNumber);

  if (gamePhase.phase == "placement") {
    let x = data.x.charCodeAt(0) - 65;
    let y = Number(data.y);
    let currentShipSize = gamePhase.shipTypes.sort()[0];

    if (data.clickType == "left") {
      if (checkLeftDirection({ x: x, y: y }, currentShipSize)) {
        placePlayerShip(x, y, currentShipSize, data.clickType);
      }
    } else if (data.clickType == "right") {
      if (checkRightDirection({ x: x, y: y }, currentShipSize)) {
        placePlayerShip(x, y, currentShipSize, data.clickType);
      }
    }
  }
}

function placePlayerShip(x, y, shipSize, clickType) {
  gamePhase.shipTypes.shift();
  for (let i = 0; i < shipSize; i++) {
    if (clickType == "left") {
      ownBoard[x + i][y] = `${shipSize}`;
    } else {
      ownBoard[x][y + i] = `${shipSize}`;
    }
  }

  displayBoard({ boardnumber: 2, board: ownBoard });
}

function checkLeftDirection(coord, size) {
  let x = coord.x;
  let y = coord.y;

  let result = true;

  if (!ownBoard[x + (size - 1)]) result = false;

  for (let i = 0; i < size; i++) {
    if (
      ownBoard[x][y] ||
      (ownBoard[x - 1] && ownBoard[x - 1][y]) ||
      (ownBoard[x + i] && ownBoard[x + i][y]) ||
      (ownBoard[x + i + 1] && ownBoard[x + i + 1][y]) ||
      (ownBoard[x + i] && ownBoard[x + i][y + 1]) ||
      (ownBoard[x + i] && ownBoard[x + i][y - 1])
    ) {
      result = false;
    }
  }

  return result;
}

function checkRightDirection(coord, size) {
  let x = coord.x;
  let y = coord.y;

  let result = true;

  if (ownBoard[x][y + (size - 1)] != "") result = false;

  for (let i = 0; i < size; i++) {
    if (
      ownBoard[x][y] ||
      ownBoard[x][y - 1] ||
      ownBoard[x][y + i + 1] ||
      (ownBoard[x + 1] && ownBoard[x + 1][y + i]) ||
      (ownBoard[x - 1] && ownBoard[x - 1][y + i])
    ) {
      result = false;
    }
  }

  return result;
}

function resetGamePhase() {
  gamePhase.phase = "placement";
  gamePhase.attackTurn = "ai";
  gamePhase.maxShip = 0;
  gamePhase.mapSize = 0;
}

function resetGame() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = " ";
      ownBoard[i][j] = "";
    }
  }

  resetGamePhase();
  displayBoard({ boardnumber: 1, board: board });
  displayBoard({ boardnumber: 2, board: ownBoard });
  selectGame(gamePhase.currentLevel);
}

function playerShoot(data) {}

function aiShoot(data) {
  console.log(data);
}
