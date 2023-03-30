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
  shipUnits: 0,
  aiCounter: 0
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
  gamePhase.aiCounter = 0;
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
function shipDetector() {
  let counter = 0;
  for (let i = 0; i < ownBoard.length; i++) {
    for (let j = 0; j < ownBoard[i].length; j++) {
      if (
        ownBoard[i][j] != '' &&
        ownBoard[i][j] !== 'm' &&
        ownBoard[i][j] !== 'n' &&
        ownBoard[i][j] !== 'h' &&
        ownBoard[i][j] !== 'x'
      ) {
        counter++;
      }
    }
  }
  console.log('shipDetector detected', counter, 'ships');
  return counter;
}
function aiShoot(originalData) {
  //console.log(originalData);
  const aiCurrentHits = countAIHits();
  if (gamePhase.phase === 'shooting' && gamePhase.attackTurn === 'ai') {
    if (aiCurrentHits === 0) {
      oldAiShoot();
    } else if (aiCurrentHits === 1) {
      secondAiShoot();
    } else if (aiCurrentHits >= 2) {
      console.clear();
      thirdAiShoot();
    }
  } else {
    //
  }
  /*
    function: aiCurrentHits(), süllyedt=destroyPlayerShip()
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
function markUnavailableCells() {
  for (let i = 0; i < ownBoard.length; i++) {
    for (let j = 0; j < ownBoard[i].length; j++) {
      if (ownBoard[i][j] === 'h' || ownBoard[i][j] === 'x') {
        if (i + 1 < ownBoard.length && (ownBoard[i + 1][j] === '' || ownBoard[i + 1][j] === 'm')) {
          ownBoard[i + 1][j] = 'n';
        }
        if (i - 1 >= 0 && (ownBoard[i - 1][j] === '' || ownBoard[i - 1][j] === 'm')) {
          ownBoard[i - 1][j] = 'n';
        }
        if (
          j + 1 < ownBoard[i].length &&
          (ownBoard[i][j + 1] === '' || ownBoard[i][j + 1] === 'm')
        ) {
          ownBoard[i][j + 1] = 'n';
        }
        if (j - 1 >= 0 && (ownBoard[i][j - 1] === '' || ownBoard[i][j - 1] === 'm')) {
          ownBoard[i][j - 1] = 'n';
        }
      }
    }
  }
}

function oldAiShoot() {
  console.clear();
  let isOver = false;
  let x = Math.floor(Math.random() * board.length);
  let y = Math.floor(Math.random() * board.length);
  console.log(x, y, gamePhase.attackTurn);
  if (
    ownBoard[x][y] !== 'h' &&
    ownBoard[x][y] !== 'm' &&
    ownBoard[x][y] !== 'n' &&
    ownBoard[x][y] !== 'x'
  ) {
    if (
      gamePhase.attackTurn === 'ai' &&
      gamePhase.phase === 'shooting' &&
      gamePhase.maxShips !== 0
    ) {
      if (ownBoard[x][y] !== '') {
        if (ownBoard[x][y] === '1') {
          gamePhase.aiHits++;
          ownBoard[x][y] = 'x';
          gamePhase.maxShips--;
          markUnavailableCells();
          displayTextMessage(
            `AI destroyed a ship! AI score: ${gamePhase.aiHits}, Player score: ${gamePhase.playerHits}`
          );
        } else {
          ownBoard[x][y] = 'h';
          displayTextMessage(
            `AI hit a ship! AI score: ${gamePhase.aiHits}, Player score: ${gamePhase.playerHits}`
          );
          //current cell for second and third ai shoot logic
          gamePhase.currentCell = [x, y];
        }
        if (gamePhase.maxShips === 0) {
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
    oldAiShoot(false);
  }
}

function secondAiShoot() {
  console.clear();
  x = Number(gamePhase.currentCell[0]);
  y = Number(gamePhase.currentCell[1]);
  console.log(
    `current cell is ${gamePhase.currentCell}, ownBoard at this cell is${ownBoard[x][y]}`
  );
  let hitShip2Long = false;
  //jobbra
  if (gamePhase.aiCounter === 0) {
    console.log('jobb', gamePhase.aiCounter);
    if (
      (ownBoard[x][y + 1] && ownBoard[x][y + 1] !== 'n' && ownBoard[x][y + 1] !== 'm') ||
      (ownBoard[x][y + 1] != undefined && ownBoard[x][y + 1] == '')
    ) {
      if (ownBoard[x][y + 1] == '') {
        ownBoard[x][y + 1] = 'm';
        displayBoard({ boardnumber: 2, board: ownBoard });
        console.log('jobb-m');
      } else {
        if (ownBoard[x][y + 1] == 2) {
          hitShip2Long = true;
        }
        ownBoard[x][y + 1] = 'h';
        displayBoard({ boardnumber: 2, board: ownBoard });
        console.log('jobb-h');
      }
    } else {
      gamePhase.aiCounter++;
    }
    console.log('jobb', gamePhase.aiCounter);
  }
  //le
  if (gamePhase.aiCounter === 1) {
    console.log('le', gamePhase.aiCounter);
    if (
      (ownBoard[x + 1] && ownBoard[x + 1][y] !== 'n' && ownBoard[x + 1][y] !== 'm') ||
      (ownBoard[x + 1] != undefined && ownBoard[x + 1][y] == '')
    ) {
      if (ownBoard[x + 1][y] == '') {
        ownBoard[x + 1][y] = 'm';
        displayBoard({ boardnumber: 2, board: ownBoard });
        console.log('le-m');
      } else {
        if (ownBoard[x + 1][y] == 2) {
          hitShip2Long = true;
        }
        ownBoard[x + 1][y] = 'h';
        displayBoard({ boardnumber: 2, board: ownBoard });
        console.log('le-h');
      }
    } else {
      gamePhase.aiCounter++;
    }
    console.log('le', gamePhase.aiCounter);
  }
  //balra
  if (gamePhase.aiCounter === 2) {
    console.log('bal', gamePhase.aiCounter);
    if (
      (ownBoard[x][y - 1] && ownBoard[x][y - 1] !== 'n' && ownBoard[x][y - 1] !== 'm') ||
      (ownBoard[x][y - 1] != undefined && ownBoard[x][y - 1] == '')
    ) {
      if (ownBoard[x][y - 1] == '') {
        ownBoard[x][y - 1] = 'm';
        displayBoard({ boardnumber: 2, board: ownBoard });
        console.log('bal-m');
      } else {
        if (ownBoard[x][y - 1] == 2) {
          hitShip2Long = true;
        }
        ownBoard[x][y - 1] = 'h';
        displayBoard({ boardnumber: 2, board: ownBoard });
        console.log('bal-h');
      }
    } else {
      gamePhase.aiCounter++;
    }
    console.log('bal', gamePhase.aiCounter);
  }
  //fel
  if (gamePhase.aiCounter === 3) {
    console.log('fel', gamePhase.aiCounter);
    if (
      (ownBoard[x - 1] && ownBoard[x - 1][y] !== 'n' && ownBoard[x - 1][y] !== 'm') ||
      (ownBoard[x - 1] != undefined && ownBoard[x - 1][y] == '')
    ) {
      if (ownBoard[x - 1][y] == '') {
        ownBoard[x - 1][y] = 'm';
        displayBoard({ boardnumber: 2, board: ownBoard });
        console.log('fel-m');
      } else {
        if (ownBoard[x - 1][y] == 2) {
          hitShip2Long = true;
        }
        ownBoard[x - 1][y] = 'h';
        displayBoard({ boardnumber: 2, board: ownBoard });
        console.log('fel-h');
      }
    } else {
      gamePhase.aiCounter++;
    }
    console.log('fel', gamePhase.aiCounter);
  }

  displayBoard({ boardnumber: 2, board: ownBoard });

  //ha kettes hajó volt --> destroy
  let aiCurrentHits = countAIHits();
  if (aiCurrentHits === 2 && hitShip2Long == true) {
    destroyPlayerShip();
    markUnavailableCells();
    gamePhase.maxShips--;
    gamePhase.aiCounter = 0;
    console.log('destroyed');
    aiCurrentHits = 0;
  }

  //if over
  const shipCount = shipDetector();
  if (shipCount == 0) {
    gamePhase.phase = 'end';
    displayMessage(`AI wins`);
  } else if (aiCurrentHits === 1) {
    gamePhase.attackTurn = 'player';
    displayTextMessage('Ai missed in secondAiShoot');
    displayMessage(`Player's turn`, 'black');
  }

  //secondAiShoot successful, move on to thirdAiShoot
  else {
    gamePhase.attackTurn = 'player';
    gamePhase.aiCounter = 0;
    displayMessage(`Player's turn`, 'black');
    displayTextMessage('Ai hit in secondAiShoot');
  }
  displayBoard({ boardnumber: 2, board: ownBoard });
  console.clear();
}

//third part of ai logic
function thirdAiShoot() {
  const x = gamePhase.currentCell[0];
  const y = gamePhase.currentCell[1];
  let direction = [];
  //look around for second and possibly third 'h'
  if (ownBoard[x][y + 1] != undefined && ownBoard[x][y + 1] === 'h') {
    direction.push('r');
  }
  if (ownBoard[x + 1] != undefined && ownBoard[x + 1][y] === 'h') {
    direction.push('d');
  }
  if (ownBoard[x][y - 1] != undefined && ownBoard[x][y - 1] === 'h') {
    direction.push('l');
  }
  if (ownBoard[x - 1] != undefined && ownBoard[x - 1][y] === 'h') {
    direction.push('u');
  }
  let currentShipSize = 0;

  //start shooting in the first direction and then switch direction to opposite
  if (direction.length < 2 && gamePhase.attackTurn == 'ai') {
    //if it exists and is not a miss, shoot in direction[0]+aiCounter+2
    //right
    if (ownBoard[x][y + gamePhase.aiCounter + 2] != undefined && direction[0] == 'r') {
      if (
        ownBoard[x][y + gamePhase.aiCounter + 2] != 'm' &&
        ownBoard[x][y + gamePhase.aiCounter + 2] != 'n'
      ) {
        currentShipSize = Number(ownBoard[x][y + gamePhase.aiCounter + 2]);
        if (ownBoard[x][y + gamePhase.aiCounter + 2] == '') {
          ownBoard[x][y + gamePhase.aiCounter + 2] = 'm';
          gamePhase.aiCounter = 0;
          direction.push(changeDirection(direction[0]));
        } else {
          ownBoard[x][y + gamePhase.aiCounter + 2] = 'h';
          gamePhase.aiCounter++;
        }
        gamePhase.attackTurn = 'player';
        console.log('shot', direction);
      }
    } else if (ownBoard[x][y + gamePhase.aiCounter + 2] == undefined && direction[0] == 'r') {
      gamePhase.aiCounter = 0;
      direction.push(changeDirection(direction[0]));
      gamePhase.attackTurn = 'ai';
    }
    //down
    else if (ownBoard[x + gamePhase.aiCounter + 2] != undefined && direction[0] == 'd') {
      if (
        ownBoard[x + gamePhase.aiCounter + 2][y] != undefined &&
        ownBoard[x + gamePhase.aiCounter + 2][y] != 'm' &&
        ownBoard[x + gamePhase.aiCounter + 2][y] != 'n'
      ) {
        currentShipSize = Number(ownBoard[x + gamePhase.aiCounter + 2][y]);
        if (ownBoard[x + gamePhase.aiCounter + 2][y] == '') {
          ownBoard[x + gamePhase.aiCounter + 2][y] = 'm';
          gamePhase.aiCounter = 0;
          direction.push(changeDirection(direction[0]));
        } else {
          ownBoard[x + gamePhase.aiCounter + 2][y] = 'h';
          gamePhase.aiCounter++;
        }
        gamePhase.attackTurn = 'player';
        console.log('shot', direction);
      }
    } else if (ownBoard[x + gamePhase.aiCounter + 2] == undefined && direction[0] == 'd') {
      gamePhase.aiCounter = 0;
      direction.push(changeDirection(direction[0]));
      gamePhase.attackTurn = 'ai';
    }
    //left
    else if (ownBoard[x][y - gamePhase.aiCounter - 2] != undefined && direction[0] == 'l') {
      if (
        ownBoard[x][y - gamePhase.aiCounter - 2] != undefined &&
        ownBoard[x][y - gamePhase.aiCounter - 2] != 'm' &&
        ownBoard[x][y - gamePhase.aiCounter - 2] != 'n'
      ) {
        currentShipSize = Number(ownBoard[x][y - gamePhase.aiCounter - 2]);
        if (ownBoard[x][y - gamePhase.aiCounter - 2] == '') {
          ownBoard[x][y - gamePhase.aiCounter - 2] = 'm';
          gamePhase.aiCounter = 0;
          direction.push(changeDirection(direction[0]));
        } else {
          ownBoard[x][y - gamePhase.aiCounter - 2] = 'h';
          gamePhase.aiCounter++;
        }
        gamePhase.attackTurn = 'player';
        console.log('shot', direction);
      }
    } else if (ownBoard[x][y - gamePhase.aiCounter - 2] == undefined && direction[0] == 'l') {
      gamePhase.aiCounter = 0;
      direction.push(changeDirection(direction[0]));
      gamePhase.attackTurn = 'ai';
    }
    //up
    else if (ownBoard[x - gamePhase.aiCounter - 2] != undefined && direction[0] == 'u') {
      if (
        ownBoard[x - gamePhase.aiCounter - 2][y] != undefined &&
        ownBoard[x - gamePhase.aiCounter - 2][y] != 'm' &&
        ownBoard[x - gamePhase.aiCounter - 2][y] != 'n'
      ) {
        currentShipSize = Number(ownBoard[x - gamePhase.aiCounter - 2][y]);
        if (ownBoard[x - gamePhase.aiCounter - 2][y] == '') {
          ownBoard[x - gamePhase.aiCounter - 2][y] = 'm';
          gamePhase.aiCounter = 0;
          direction.push(changeDirection(direction[0]));
        } else {
          ownBoard[x - gamePhase.aiCounter - 2][y] = 'h';
          gamePhase.aiCounter++;
        }
        gamePhase.attackTurn = 'player';
        console.log('shot', direction);
      }
    } else if (ownBoard[x - gamePhase.aiCounter - 2] == undefined && direction[0] == 'u') {
      gamePhase.aiCounter = 0;
      direction.push(changeDirection(direction[0]));
      gamePhase.attackTurn = 'ai';
    }

    //if ship is destroyed
    let aiCurrentHits = countAIHits();
    if (aiCurrentHits == currentShipSize) {
      destroyPlayerShip();
      markUnavailableCells();
      gamePhase.maxShips--;
      gamePhase.aiCounter = 0;
    }
    if (gamePhase.attackTurn != 'player') {
      gamePhase.aiCounter = 0;
      direction.push(changeDirection(direction[0]));
      gamePhase.attackTurn = 'ai';
    }
  }

  //changed direction
  if (direction.length >= 2 && gamePhase.attackTurn === 'ai') {
    console.log('dirchange', direction);
    let isDestroyed = false;
    //try to shoot again...
    if (ownBoard[x][y + gamePhase.aiCounter + 1] != undefined && direction[1] == 'r') {
      if (
        ownBoard[x][y + gamePhase.aiCounter + 1] != 'm' &&
        ownBoard[x][y + gamePhase.aiCounter + 1] != 'n'
      ) {
        currentShipSize = Number(ownBoard[x][y + gamePhase.aiCounter + 1]);
        if (ownBoard[x][y + gamePhase.aiCounter + 1] == '') {
          ownBoard[x][y + gamePhase.aiCounter + 1] = 'm';
          isDestroyed = true;
        } else {
          ownBoard[x][y + gamePhase.aiCounter + 1] = 'h';
          gamePhase.aiCounter++;
        }
        console.log('shot', direction);
      }
    } else if (ownBoard[x][y + gamePhase.aiCounter + 1] == undefined && direction[1] == 'r') {
      gamePhase.aiCounter = 0;
      isDestroyed = true;
    } else if (ownBoard[x + gamePhase.aiCounter + 1] != undefined && direction[1] == 'd') {
      if (
        ownBoard[x + gamePhase.aiCounter + 1][y] != undefined &&
        ownBoard[x + gamePhase.aiCounter + 1][y] != 'm' &&
        ownBoard[x + gamePhase.aiCounter + 1][y] != 'n'
      ) {
        currentShipSize = Number(ownBoard[x + gamePhase.aiCounter + 1][y]);
        if (ownBoard[x + gamePhase.aiCounter + 1][y] == '') {
          ownBoard[x + gamePhase.aiCounter + 1][y] = 'm';
          isDestroyed = true;
        } else {
          ownBoard[x + gamePhase.aiCounter + 1][y] = 'h';
          gamePhase.aiCounter++;
        }
        console.log('shot', direction);
      }
    } else if (ownBoard[x + gamePhase.aiCounter + 1] == undefined && direction[1] == 'd') {
      gamePhase.aiCounter = 0;
      isDestroyed = true;
    } else if (ownBoard[x][y - gamePhase.aiCounter - 1] != undefined && direction[1] == 'l') {
      if (
        ownBoard[x][y - gamePhase.aiCounter - 1] != undefined &&
        ownBoard[x][y - gamePhase.aiCounter - 1] != 'm' &&
        ownBoard[x][y - gamePhase.aiCounter - 1] != 'n'
      ) {
        currentShipSize = Number(ownBoard[x][y - gamePhase.aiCounter - 1]);
        if (ownBoard[x][y - gamePhase.aiCounter - 1] == '') {
          ownBoard[x][y - gamePhase.aiCounter - 1] = 'm';
          isDestroyed = true;
        } else {
          ownBoard[x][y - gamePhase.aiCounter - 1] = 'h';
          gamePhase.aiCounter++;
        }
        console.log('shot', direction);
      }
    } else if (ownBoard[x][y - gamePhase.aiCounter - 1] == undefined && direction[1] == 'l') {
      gamePhase.aiCounter = 0;
      isDestroyed = true;
    } else if (ownBoard[x - gamePhase.aiCounter - 1] != undefined && direction[1] == 'u') {
      if (
        ownBoard[x - gamePhase.aiCounter - 1][y] != undefined &&
        ownBoard[x - gamePhase.aiCounter - 1][y] != 'm' &&
        ownBoard[x - gamePhase.aiCounter - 1][y] != 'n'
      ) {
        currentShipSize = Number(ownBoard[x - gamePhase.aiCounter - 1][y]);
        if (ownBoard[x - gamePhase.aiCounter - 1][y] == '') {
          ownBoard[x - gamePhase.aiCounter - 1][y] = 'm';
          isDestroyed = true;
        } else {
          ownBoard[x - gamePhase.aiCounter - 1][y] = 'h';
          gamePhase.aiCounter++;
        }
        console.log('shot', direction);
      }
    } else if (ownBoard[x - gamePhase.aiCounter - 1] == undefined && direction[1] == 'u') {
      gamePhase.aiCounter = 0;
      isDestroyed = true;
    }
    //if ship is destroyed
    let aiCurrentHits = countAIHits();
    if (aiCurrentHits == currentShipSize) {
      destroyPlayerShip();
      markUnavailableCells();
      gamePhase.maxShips--;
      gamePhase.aiCounter = 0;
    }
  }

  //if its over
  if (gamePhase.maxShips === 0) {
    destroyPlayerShip();
    markUnavailableCells();
    gamePhase.phase = 'end';
    displayMessage(`AI wins`);
  } else {
    gamePhase.attackTurn = 'player';
    displayMessage(`Player's turn`, 'black');
  }

  displayBoard({ boardnumber: 2, board: ownBoard });
}
function changeDirection(dir) {
  if (dir === 'r') return 'l';
  else if (dir === 'l') return 'r';
  else if (dir === 'd') return 'u';
  else if (dir === 'u') return 'd';
}
