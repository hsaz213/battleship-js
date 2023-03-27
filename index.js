/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-operators */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-expressions */

let board = [];
let ownBoard = [];
let maskedBoard = [];
const gamePhase = {
  phase: 'placement',
  attackTurn: 'ai',
  clicks: 0,
  level: '',
  maxShips: 0,
  mapSize: 0,
  aiHits: 0,
  playerHits: 0
};

//data format: size:4,s:{s1:a1,s2:c4}
function getSettings(data) {
  let [size, ...str] = data.split(','); //['size:4', 's:{s1:a1,s2:c4}']
  const ships = str.join(',').slice(3, -1).split(','); //-> ['s1:a1', 's2:c4']
  size = size.split(':')[1]; //['size', '4'] -> 4

  const shipsArray = [];
  for (let i = 0; i < ships.length; i++) {
    ships[i] = ships[i].split(':')[1].split(''); //s1:a1a2 -> ['a','1','a','2']

    const row = ships[i][0].charCodeAt(0) - 97; //['a', '1'] -> (a->0, 1), a: ASCII 97
    const column = ships[i][1]; //1, 4

    const endRow = ships[i][ships[i].length - 2].charCodeAt(0) - 97;
    const endColumn = ships[i][ships[i].length - 1];
    const shipSize = ships[i].length / 2;

    shipsArray[i] = {
      row: row,
      column: Number(column) - 1,
      endRow: endRow,
      endColumn: Number(endColumn) - 1,
      size: shipSize
    };
  }

  gamePhase.mapSize = size;
  gamePhase.maxShips = shipsArray.length;

  generateMap(shipsArray);
}

function generateMap(ships) {
  //clear the boards
  board = [];
  ownBoard = [];
  maskedBoard = [];
  //make an i x j (size x size) board and ownBoard array
  for (let i = 0; i < gamePhase.mapSize; i++) {
    if (!board[i]) {
      board[i] = [];
    }
    if (!maskedBoard[i]) {
      maskedBoard[i] = [];
    }
    if (!ownBoard[i]) {
      ownBoard[i] = [];
    }
    for (let j = 0; j < gamePhase.mapSize; j++) {
      if (!board[i][j]) {
        board[i][j] = [];
      }
      if (!maskedBoard[i][j]) {
        maskedBoard[i][j] = [];
      }
      if (!ownBoard[i][j]) {
        ownBoard[i][j] = [];
      }
      //clear ai board and fill in the ai ships
      board[i][j] = '🌊';
      maskedBoard[i][j] = '🌊';
      for (const el in ships) {
        i === ships[el].row && j === ships[el].column
          ? (board[i][j] = '🚢')
          : '🌊';
      }
      //clear ownBoard
      ownBoard[i][j] = '🌊';
    }
  }
}

function selectGame(data) {
  resetGamePhase();
  gamePhase.level = data;
  getSettings(data);
  displayBoard({ boardnumber: 1, board: maskedBoard });
  displayBoard({ boardnumber: 2, board: ownBoard });
  displayMessage('Battleship', 'black');
  displayTextMessage(
    `Place ${gamePhase.maxShips} ships on the board.`,
    'black'
  );
}

function handleClick(data) {
  //count the enemy ships -> allowed clicks for the player at placement phase
  if (gamePhase.phase === 'placement' && data.tableNumber === 2) {
    if (allowedCell(data)) {
      if (gamePhase.clicks < gamePhase.maxShips) {
        ownBoard[data.x.charCodeAt(0) - 65][data.y] = '🛳️'; //A ascii: 65->A=0,B=1...
        gamePhase.clicks++;

        displayTextMessage(
          `Place ${gamePhase.maxShips - gamePhase.clicks} ship${
            gamePhase.maxShips - gamePhase.clicks > 1 ? 's' : ''
          } on the board.`,
          'black'
        );

        if (gamePhase.clicks == gamePhase.maxShips) {
          displayTextMessage(``, 'black');
          displayMessage('Click the AI shoot button', 'black');
          gamePhase.phase = 'shooting';
        }
      }
    }
  } else if (data.tableNumber === 1 && gamePhase.phase == 'shooting') {
    {
      playerShoot(data);
    }
  }
  displayBoard({ boardnumber: 2, board: ownBoard });
}

function allowedCell(data) {
  let isAllowed = true;
  const datax = data.x.charCodeAt(0) - 65;

  //cell is a ship -> not allowed
  if (ownBoard[datax][data.y] === '🛳️') {
    isAllowed = false;
  }

  //else if cell+1 exists && cell+1 in this direction is a ship -> not allowed
  //up
  else if (datax !== 0 && ownBoard[datax - 1][data.y] === '🛳️') {
    isAllowed = false;
  }
  //down
  else if (
    datax !== ownBoard.length - 1 &&
    ownBoard[datax + 1][data.y] === '🛳️'
  ) {
    isAllowed = false;
  }
  //left
  else if (
    data.y !== 0 &&
    ownBoard[datax][Number(data.y) - Number(1)] === '🛳️'
  ) {
    isAllowed = false;
  }
  //right
  else if (
    data.y != ownBoard[datax].length - 1 &&
    ownBoard[datax][Number(data.y) + Number(1)] === '🛳️'
  ) {
    isAllowed = false;
  }

  return isAllowed;
}

function resetGamePhase() {
  gamePhase.phase = 'placement';
  gamePhase.attackTurn = 'ai';
  gamePhase.clicks = 0;
  gamePhase.maxShips = 0;
  gamePhase.mapSize = 0;
  gamePhase.aiHits = 0;
  gamePhase.playerHits = 0;
}

function resetGame() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = '🌊';
      ownBoard[i][j] = '🌊';
      maskedBoard[i][j] = '🌊';
    }
  }
  resetGamePhase();
  displayBoard({ boardnumber: 1, board: maskedBoard });
  displayBoard({ boardnumber: 2, board: ownBoard });
  selectGame(gamePhase.level);
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
    if (board[x][y] === '🚢') {
      gamePhase.playerHits++;
      board[x][y] = '💥';
      maskedBoard[x][y] = '💥';

      displayTextMessage(
        `AI score: ${gamePhase.aiHits}, \n Player score: ${gamePhase.playerHits}`
      );

      if (gamePhase.playerHits === gamePhase.maxShips) {
        isOver = true;
        gamePhase.phase = 'end';
      }
    } else if (board[x][y] === '🌊') {
      board[x][y] = '💦';
      maskedBoard[x][y] = '💦';
      displayTextMessage(`You missed!`);
    }

    if (isOver) {
      displayMessage(`WINNER WINNER CHICKN DINNER`);
    } else {
      gamePhase.attackTurn = 'ai';
      displayMessage('Click the AI shoot button', 'black');
    }
    displayBoard({ boardnumber: 1, board: maskedBoard });
  }
}

function aiShoot(data) {
  const x = data.x.charCodeAt(0) - 65;
  const y = data.y - 1;
  let isOver = false;

  if (ownBoard[x][y] !== '💥' && ownBoard[x][y] !== '💦') {
    if (
      gamePhase.attackTurn === 'ai' &&
      gamePhase.phase === 'shooting' &&
      gamePhase.aiHits < gamePhase.maxShips
    ) {
      if (ownBoard[x][y] === '🛳️') {
        gamePhase.aiHits++;
        ownBoard[x][y] = '💥';
        displayTextMessage(
          `AI score: ${gamePhase.aiHits}, \n Player score: ${gamePhase.playerHits}`
        );
        if (gamePhase.aiHits === gamePhase.maxShips) {
          isOver = true;
        }
      } else if (ownBoard[x][y] === '🌊') {
        ownBoard[x][y] = '💦';
        displayTextMessage(`AI missed!`);
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
    aiShoot({
      x: String.fromCharCode(Math.floor(Math.random() * board.length + 65)),
      y: Math.floor(Math.random() * board.length + 1)
    });
  }
}
