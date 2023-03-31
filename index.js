/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-expressions */
let board = [];
let ownBoard = [];
//let maskedBoard=[];
const gamePhase = {
  phase: 'placement',
  attackTurn: 'ai',
  currentLevel: '',
  maxShips: 0,
  clicks: 0,
  mapSize: 0,
  shipTypes: [],
  aiScore: 0,
  playerScore: 0,
  shipCount: 0
};

function selectGame(data) {
  resetGamePhase();
  gamePhase.currentLevel = data;
  displayMessage('Place your ships on the right board!');
  displayTextMessage('');
  //
  generateSettings(data);
  gamePhase.shipCount = countShips();
}

function resetGame() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = '';
      ownBoard[i][j] = '';
    }
  }
  resetGamePhase();
  displayBoard({ boardnumber: 1, board: maskAiBoard(board) });
  displayBoard({ boardnumber: 2, board: maskBoard(ownBoard) });
  selectGame(gamePhase.currentLevel);
}

function resetGamePhase() {
  gamePhase.phase = 'placement';
  gamePhase.attackTurn = 'ai';
  gamePhase.maxShips = 0;
  gamePhase.shipTypes = [];
  gamePhase.shipCount = 0;
  gamePhase.mapSize = 0;
  gamePhase.clicks = 0;
  gamePhase.aiScore = 0;
  gamePhase.playerScore = 0;
}

function countShips() {
  const levelSettings = gamePhase.currentLevel;
  const shipString = levelSettings.match(/s:{([^}]*)}/)[1];
  const ships = shipString.split(',');
  return ships.length;
}

function generateSettings(data) {
  let [size, ...positions] = data.split(',');
  let stringShipArray = positions.join(',').slice(3, -1).split(',');
  let shipArray = [];
  for (let i = 0; i < stringShipArray.length; i++) {
    shipArray.push(stringShipArray[i].split(':')[1]);
  }
  gamePhase.mapSize = size.split(':')[1];
  gamePhase.maxShips = shipArray.length;
  generateMap(shipArray, gamePhase.mapSize);
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
      board[i][j] = '';
      ownBoard[i][j] = '';
    }
  }

  displayBoard({ boardnumber: 1, board: maskAiBoard(board) });
  displayBoard({ boardnumber: 2, board: maskBoard(ownBoard) });
  placeAiShip(ship);
}
function placeAiShip(ship) {
  for (let i = 0; i < ship.length; i++) {
    gamePhase.shipTypes.push(ship[i].length / 2);
    let start_x = ship[i].split('')[0].charCodeAt(0) - 97;
    let start_y = Number(ship[i].split('')[1]) - 1;
    let end_x = ship[i][ship[i].length - 2].charCodeAt(0) - 97;
    let end_y = Number(ship[i][ship[i].length - 1]) - 1;
    for (let x = start_x; x <= end_x; x++) {
      for (let y = start_y; y <= end_y; y++) {
        board[x][y] = `${ship[i].length / 2}`;
      }
    }
  }

  displayBoard({ boardnumber: 1, board: maskAiBoard(board) });
}

function handleClick(data) {
  console.log('click: ' + data.x + data.y + data.clickType + data.tableNumber);
  if (gamePhase.phase == 'placement' && data.tableNumber === 2) {
    let x = data.x.charCodeAt(0) - 65;
    let y = Number(data.y);
    if (gamePhase.clicks < gamePhase.maxShips) {
      let currentShipSize = gamePhase.shipTypes.sort()[0];

      if (data.clickType == 'left') {
        if (checkLeftDirection({ x: x, y: y }, currentShipSize)) {
          gamePhase.clicks++;
          placePlayerShip(x, y, currentShipSize, data.clickType);
        }
      } else if (data.clickType == 'right') {
        if (checkRightDirection({ x: x, y: y }, currentShipSize)) {
          gamePhase.clicks++;
          placePlayerShip(x, y, currentShipSize, data.clickType);
        }
      }
      if (gamePhase.clicks === gamePhase.maxShips) {
        displayTextMessage(``, 'black');
        displayMessage('Click the AI shoot button', 'black');
        gamePhase.phase = 'shooting';
      }
      console.log(gamePhase);
    }
  } else if (data.tableNumber === 1 && gamePhase.phase == 'shooting') {
    {
      playerShoot(data);
    }
  }
}
function placePlayerShip(x, y, shipSize, clickType) {
  gamePhase.shipTypes.shift();
  for (let i = 0; i < shipSize; i++) {
    if (clickType == 'left') {
      ownBoard[x + i][y] = `${shipSize}`;
    } else {
      ownBoard[x][y + i] = `${shipSize}`;
    }
  }
  displayBoard({ boardnumber: 2, board: maskBoard(ownBoard) });
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
  if (ownBoard[x][y + (size - 1)] != '') result = false;
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

function playerShoot(data) {
  if (
    gamePhase.attackTurn === 'player' &&
    gamePhase.phase === 'shooting' &&
    data.tableNumber === 1
  ) {
    const x = data.x.charCodeAt(0) - 65;
    const y = data.y;
    if (board[x][y] !== '' && board[x][y] !== 'm' && board[x][y] !== 'h') {
      board[x][y] = 'h';
      //maskedBoard[x][y] = 'h';
      displayTextMessage(
        `You hit a ship! AI score: ${gamePhase.aiScore}, Player score: ${gamePhase.playerScore}`
      );
    } else {
      board[x][y] = 'm';
      //maskedBoard[x][y] = 'm';
      displayTextMessage(
        `You missed! AI score: ${gamePhase.aiScore}, Player score: ${gamePhase.playerScore}`
      );
    }
    destroyAiShip();
    if (gamePhase.playerScore === gamePhase.shipCount) {
      gamePhase.phase = 'end';
      displayMessage(`YOU WON!!!1 🏆`);
    } else {
      gamePhase.attackTurn = 'ai';
      displayMessage('Click the AI shoot button', 'black');
    }
    displayBoard({ boardnumber: 1, board: /*maskedBoard*/ maskAiBoard(board) });
  }
}

function aiShoot() {
  let validShot = false;

  while (!validShot) {
    let x = Math.floor(Math.random() * board.length);
    let y = Math.floor(Math.random() * board.length);

    if (
      ownBoard[x][y] !== 'h' &&
      ownBoard[x][y] !== 'm' &&
      ownBoard[x][y] !== 'n' &&
      ownBoard[x][y] !== 'x'
    ) {
      validShot = true;

      if (
        gamePhase.attackTurn === 'ai' &&
        gamePhase.phase === 'shooting' &&
        gamePhase.aiScore < gamePhase.shipCount
      ) {
        if (
          ownBoard[x][y] !== '' &&
          ownBoard[x][y] !== 'm' &&
          ownBoard[x][y] !== 'h' &&
          ownBoard[x][y] !== 'n' &&
          ownBoard[x][y] !== 'x'
        ) {
          ownBoard[x][y] = 'h';
          markUnavailableCells();
          displayTextMessage(
            `AI hit a ship! AI score: ${gamePhase.aiScore}, Player score: ${gamePhase.playerScore}`
          );
        } else {
          ownBoard[x][y] = 'm';
          displayTextMessage(
            `AI missed! AI score: ${gamePhase.aiScore}, Player score: ${gamePhase.playerScore}`
          );
        }
        destroyPlayerShip();
        if (gamePhase.aiScore === gamePhase.shipCount) {
          gamePhase.phase = 'end';
          displayMessage(`AI wins 🤖🏆`);
        } else {
          gamePhase.attackTurn = 'player';
          displayMessage(`Player's turn`, 'black');
        }
        displayBoard({ boardnumber: 2, board: maskBoard(ownBoard) });
      }
    }
  }
}

function markUnavailableCells() {
  for (let i = 0; i < ownBoard.length; i++) {
    for (let j = 0; j < ownBoard[i].length; j++) {
      if (ownBoard[i][j] === 'h' || ownBoard[i][j] === 'x') {
        if (
          i + 1 < ownBoard.length &&
          (ownBoard[i + 1][j] === '' || ownBoard[i + 1][j] === 'm')
        ) {
          ownBoard[i + 1][j] = 'n';
        }
        if (
          i - 1 >= 0 &&
          (ownBoard[i - 1][j] === '' || ownBoard[i - 1][j] === 'm')
        ) {
          ownBoard[i - 1][j] = 'n';
        }
        if (
          j + 1 < ownBoard[i].length &&
          (ownBoard[i][j + 1] === '' || ownBoard[i][j + 1] === 'm')
        ) {
          ownBoard[i][j + 1] = 'n';
        }
        if (
          j - 1 >= 0 &&
          (ownBoard[i][j - 1] === '' || ownBoard[i][j - 1] === 'm')
        ) {
          ownBoard[i][j - 1] = 'n';
        }
      }
    }
  }
}

function destroyPlayerShip() {
  console.log('searchAndDestroy');
  for (let i = 0; i < ownBoard.length; i++) {
    for (let j = 0; j < ownBoard[i].length; j++) {
      if (ownBoard[i][j] === 'h') {
        let shipDestroyed = true;
        let horizontalCheck = j;
        let verticalCheck = i;

        // Check to the right
        while (
          horizontalCheck + 1 < ownBoard[i].length &&
          ownBoard[i][horizontalCheck + 1] !== '' &&
          ownBoard[i][horizontalCheck + 1] !== 'm' &&
          ownBoard[i][horizontalCheck + 1] !== 'n'
        ) {
          if (ownBoard[i][horizontalCheck + 1] !== 'h') {
            shipDestroyed = false;
            break;
          }
          horizontalCheck++;
        }

        // Check to the left
        horizontalCheck = j;
        while (
          horizontalCheck - 1 >= 0 &&
          ownBoard[i][horizontalCheck - 1] !== '' &&
          ownBoard[i][horizontalCheck - 1] !== 'm' &&
          ownBoard[i][horizontalCheck - 1] !== 'n'
        ) {
          if (ownBoard[i][horizontalCheck - 1] !== 'h') {
            shipDestroyed = false;
            break;
          }
          horizontalCheck--;
        }

        // Check downwards
        while (
          verticalCheck + 1 < ownBoard.length &&
          ownBoard[verticalCheck + 1][j] !== '' &&
          ownBoard[verticalCheck + 1][j] !== 'm' &&
          ownBoard[verticalCheck + 1][j] !== 'n'
        ) {
          if (ownBoard[verticalCheck + 1][j] !== 'h') {
            shipDestroyed = false;
            break;
          }
          verticalCheck++;
        }

        // Check upwards
        verticalCheck = i;
        while (
          verticalCheck - 1 >= 0 &&
          ownBoard[verticalCheck - 1][j] !== '' &&
          ownBoard[verticalCheck - 1][j] !== 'm' &&
          ownBoard[verticalCheck - 1][j] !== 'n'
        ) {
          if (ownBoard[verticalCheck - 1][j] !== 'h') {
            shipDestroyed = false;
            break;
          }
          verticalCheck--;
        }

        if (shipDestroyed) {
          gamePhase.aiScore++;
          displayTextMessage(
            `AI sunk a ship! AI score: ${gamePhase.aiScore}, Player score: ${gamePhase.playerScore}`
          );

          ownBoard[i][j] = 'x';
        }
      }
    }
  }
}

function destroyAiShip() {
  console.log('searchAndDestroy');
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 'h') {
        let shipDestroyed = true;
        let horizontalCheck = j;
        let verticalCheck = i;

        // Check to the right
        while (
          horizontalCheck + 1 < board[i].length &&
          board[i][horizontalCheck + 1] !== '' &&
          board[i][horizontalCheck + 1] !== 'm' &&
          board[i][horizontalCheck + 1] !== 'n'
        ) {
          if (board[i][horizontalCheck + 1] !== 'h') {
            shipDestroyed = false;
            break;
          }
          horizontalCheck++;
        }

        // Check to the left
        horizontalCheck = j;
        while (
          horizontalCheck - 1 >= 0 &&
          board[i][horizontalCheck - 1] !== '' &&
          board[i][horizontalCheck - 1] !== 'm' &&
          board[i][horizontalCheck - 1] !== 'n'
        ) {
          if (board[i][horizontalCheck - 1] !== 'h') {
            shipDestroyed = false;
            break;
          }
          horizontalCheck--;
        }

        // Check downwards
        while (
          verticalCheck + 1 < board.length &&
          board[verticalCheck + 1][j] !== '' &&
          board[verticalCheck + 1][j] !== 'm' &&
          board[verticalCheck + 1][j] !== 'n'
        ) {
          if (board[verticalCheck + 1][j] !== 'h') {
            shipDestroyed = false;
            break;
          }
          verticalCheck++;
        }

        // Check upwards
        verticalCheck = i;
        while (
          verticalCheck - 1 >= 0 &&
          board[verticalCheck - 1][j] !== '' &&
          board[verticalCheck - 1][j] !== 'm' &&
          board[verticalCheck - 1][j] !== 'n'
        ) {
          if (board[verticalCheck - 1][j] !== 'h') {
            shipDestroyed = false;
            break;
          }
          verticalCheck--;
        }

        if (shipDestroyed) {
          board[i][j] = 'x';
          gamePhase.playerScore++;

          displayTextMessage(
            `You sunk a ship! AI score: ${gamePhase.aiScore}, Player score: ${gamePhase.playerScore}`
          );
        }
      }
    }
  }
}

// function maskAiBoard(board) {
//   let maskedBoard = [];

//   for (let i = 0; i < board.length; i++) {
//     maskedBoard[i] = [];
//     for (let j = 0; j < board[i].length; j++) {
//       let cell = board[i][j];

//       if (board) {
//         if (cell === '') {
//           maskedBoard[i][j] = '🌊';
//         } else if (cell === 'm') {
//           maskedBoard[i][j] = '💦';
//         } else if (cell === 'n') {
//           maskedBoard[i][j] = '🌊';
//         } else if (cell === 'h') {
//           maskedBoard[i][j] = '💥';
//         } else if (cell === 'x') {
//           maskedBoard[i][j] = '💥';
//         } else {
//           maskedBoard[i][j] = cell;
//         }
//       }
//     }
//   }

//   return maskedBoard;
// }

function maskBoard(board) {
  let maskedBoard = [];

  for (let i = 0; i < board.length; i++) {
    maskedBoard[i] = [];
    for (let j = 0; j < board[i].length; j++) {
      let cell = board[i][j];

      if (board) {
        maskedBoard[i][j] =
          cell === ''
            ? '🌊'
            : cell === 'm'
            ? '💦'
            : cell === 'n'
            ? '🌊'
            : cell === 'h'
            ? '💥'
            : cell === 'x'
            ? '💥'
            : parseInt(cell) > 0
            ? '🚢'
            : cell;
      } else {
        maskedBoard[i][j] =
          cell === '' ? '🌊' : parseInt(cell) > 0 ? '🚢' : cell;
      }
    }
  }

  return maskedBoard;
}

function maskAiBoard(board) {
  let maskedBoard = [];

  for (let i = 0; i < board.length; i++) {
    maskedBoard[i] = [];
    for (let j = 0; j < board[i].length; j++) {
      let cell = board[i][j];

      if (board) {
        maskedBoard[i][j] =
          cell === ''
            ? '🌊'
            : cell === 'm'
            ? '💦'
            : cell === 'n'
            ? '🌊'
            : cell === 'h'
            ? '💥'
            : cell === 'x'
            ? '💥'
            : parseInt(cell) > 0
            ? '🌊'
            : cell;
      } else {
        maskedBoard[i][j] =
          cell === '' ? '🌊' : parseInt(cell) > 0 ? '🌊' : cell;
      }
    }
  }

  return maskedBoard;
}
