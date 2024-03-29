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
  aiHits: 0,
  playerHits: 0,
  shipUnits: 0
};

function selectGame(data) {
  resetGamePhase();
  gamePhase.currentLevel = data;
  displayMessage('Place your ships on the right board!');
  displayTextMessage('');
  //
  generateSettings(data);
  gamePhase.shipUnits = countNotEmpty();
}

function resetGame() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = '';
      ownBoard[i][j] = '';
    }
  }
  resetGamePhase();
  displayBoard({ boardnumber: 1, board: board });
  displayBoard({ boardnumber: 2, board: ownBoard });
  selectGame(gamePhase.currentLevel);
}

function resetGamePhase() {
  gamePhase.phase = 'placement';
  gamePhase.attackTurn = 'ai';
  gamePhase.maxShips = 0;
  gamePhase.shipTypes = [];
  gamePhase.shipUnits = 0;
  gamePhase.mapSize = 0;
  gamePhase.clicks = 0;
  gamePhase.aiHits = 0;
  gamePhase.playerHits = 0;
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

  displayBoard({ boardnumber: 1, board: board });
  displayBoard({ boardnumber: 2, board: ownBoard });
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

  displayBoard({ boardnumber: 1, board: board });
}

function countNotEmpty() {
  let counter = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== '' && board[i][j] !== 'm' && board[i][j] !== 'h') {
        counter++;
      }
    }
  }
  return counter;
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
  let isOver = false;
  if (
    gamePhase.attackTurn === 'player' &&
    gamePhase.phase === 'shooting' &&
    data.tableNumber === 1
  ) {
    const x = data.x.charCodeAt(0) - 65;
    const y = data.y;
    if (board[x][y] !== '' && board[x][y] !== 'm' && board[x][y] !== 'h') {
      gamePhase.playerHits++;
      board[x][y] = 'h';
      //maskedBoard[x][y] = 'h';
      displayTextMessage(
        `You hit a ship! AI score: ${gamePhase.aiHits}, Player score: ${gamePhase.playerHits}`
      );

      if (gamePhase.playerHits === gamePhase.shipUnits) {
        isOver = true;
        gamePhase.phase = 'end';
      }
    } else {
      board[x][y] = 'm';
      //maskedBoard[x][y] = 'm';
      displayTextMessage(
        `You missed! AI score: ${gamePhase.aiHits}, Player score: ${gamePhase.playerHits}`
      );
    }

    if (isOver) {
      displayMessage(`Player wins`);
    } else {
      gamePhase.attackTurn = 'ai';
      displayMessage('Click the AI shoot button', 'black');
    }
    displayBoard({ boardnumber: 1, board: /*maskedBoard*/ board });
  }
}

//AI Logic

//megszámolja a h betűket a player táblán
function countAIHits() {
  let counter = 0;
  for (let i = 0; i < ownBoard.length; i++) {
    for (let j = 0; j < ownBoard[i].length; j++) {
      if (ownBoard[i][j] === 'h') {
        counter++;
      }
    }
  }
  return counter;
}
//minden h-t x-re cserél a player táblán
function destroyPlayerShip() {
  for (let i = 0; i < ownBoard.length; i++) {
    for (let j = 0; j < ownBoard[i].length; j++) {
      if (ownBoard[i][j] === 'h') {
        ownBoard[i][j] = 'x';
      }
    }
  }
}
function aiShoot(originalData) {
  let isOver = false;
  const aiCurrentHits = countAIHits();
  oldAiShoot(isOver);
  /*
    aiCurrentHits(), süllyedt=destroyPlayerShip()
    globális... számláló a körbelövéshez, kiindulási mező a 2. 3. részhez, irány a 3. részhez

    ha aiCurrentHits===0, akkor firstAiShoot(isOver)
      ha süllyedt (itt: mező===1) destroyPlayerShip() vagy mező=x simán
      ha nem süllyedt, de talált: mező[i][j]=[i][j]
      return

    ha aiCurrentHits===1: secondAiShoot(isOver,számláló,mező[i][j])

      (ha nem: óramutató szerint pl. lőjön körbe körök alatt:
      adott mező nem létezik: ugorjon a következőre még ezen a körön belül, ameddig létezőre nem jut (mert "láthatja" a táblát),
      amikor létezőre jutott: lőjön oda):
        ha nem talált: számláló ++, return

        ha talált: számláló 0, irány megjegyez, return
          (itt egy destroyPlayerShip-pel idáig már csak 1-2-es hajós mapon letesztelhető)

    ha aiCurrentHits>1: thirdAiShoot(isOver,mező[i][j].irány)
      ha adott irányban (kiindulási mező + aiCurrentHits). mező létezik és nem üres vagy miss:
        oda lő és ha irány+1 ekkor létezik és üres vagy miss és kiindulási mező -irány - 1 nem létezik vagy üres vagy miss:
        destroyPlayerShip()
        return

      ha nem létezik (kiindulási mező + aiCurrentHits). mező és/vagy kiindulási mező -irány - 1 nem üres vagy miss:
        kiindulási mező -irány-ba lőjön addig, ameddig -irány -1 nem lenne üres vagy miss:
        destroyPlayerShip()
        return    
  */
}
function oldAiShoot(isOver) {
  let x = Math.floor(Math.random() * board.length);
  let y = Math.floor(Math.random() * board.length);
  if (ownBoard[x][y] !== 'h' && ownBoard[x][y] !== 'm') {
    if (
      gamePhase.attackTurn === 'ai' &&
      gamePhase.phase === 'shooting' &&
      gamePhase.aiHits < gamePhase.shipUnits
    ) {
      if (
        ownBoard[x][y] !== '' &&
        ownBoard[x][y] !== 'm' &&
        ownBoard[x][y] !== 'h'
      ) {
        gamePhase.aiHits++;
        ownBoard[x][y] = 'h';
        displayTextMessage(
          `AI hit a ship! AI score: ${gamePhase.aiHits}, Player score: ${gamePhase.playerHits}`
        );
        if (gamePhase.aiHits === gamePhase.shipUnits) {
          isOver = true;
        }
      } else {
        ownBoard[x][y] = 'm';
        displayTextMessage(
          `AI missed! AI score: ${gamePhase.aiHits}, Player score: ${gamePhase.playerHits}`
        );
      }

      if (isOver) {
        gamePhase.phase = 'end';
        displayMessage(`AI wins`);
      } else {
        gamePhase.attackTurn = 'player';
        displayMessage(`Player's turn`, 'black');
      }
      displayBoard({ boardnumber: 2, board: ownBoard });
    }
  } else {
    aiShoot(data);
  }
}
