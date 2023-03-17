/* eslint-disable prefer-template */
/* eslint-disable no-unused-expressions */

let board = [];
let ownBoard = [];
let maskedBoard = [];
const gamePhase = {
  phase: "placement",
  attackTurn: "ai",
  clicks: 0,
  level: "",
  maxShip: 0,
  mapSize: 0,
  aiHits: 0,
  playerHits: 0,
};

//data parsing input parameter data: size:4,s:{s1:a1,s2:c4}
function getSettings(data) {
  let [size, ...ste] = data.split(","); // ['size:4', 's:{s1:a1,s2:c4}']
  let steps = ste.join(",");

  size = size.split(":")[1]; // ['size', '4'] -> 4
  gamePhase.mapSize = size;

  steps = steps.slice(3, -1); // 's:{s1:a1,s2:c4}' -> 's1:a1,s2:c4'
  steps = steps.split(","); // ['s1:a1', 's2:c4']

  const stepsArray = getStepsByArray(steps);
  gamePhase.maxShip = stepsArray.length;

  displayMessage("Battleship", "black");
  displayTextMessage("Place your ships on the board.", "black");
  // displayTextMessage(data, 'black');
  // displayMessage('size:' + size + ', ai ships:' + JSON.stringify(stepsArray), 'black');

  generateMap(size, stepsArray); //stepsArray-->ships
}

function getStepsByArray(array) {
  const obj = []; /*arr=[] instead of obj={}?*/
  for (let i = 0; i < array.length; i++) {
    const splited = array[i].split(":")[1]; // ['s1:a1', 's2:c4'] -> ['s1' ,'a1', 's2', 'c4']
    const data = splited.split(""); // ['a1', 'c4'] -> ['a', '1']
    const row = data[0].charCodeAt(0) - 97; // ['a', '1'] -> (a->0, 1)
    //a: ASCII 97
    const column = data[1]; // 1, 4

    obj[i] = {
      row: row,
      column: Number(column) - 1,
    };
  }
  return obj;
}
//data parsing results: obj=[{column:0,row:0},{column:3},row:2] (getStepsByArray); size=4 (getSettings)

function generateMap(size, ships) {
  //clear the boards
  board = [];
  ownBoard = [];
  maskedBoard = [];
  //make an i x j (size x size) board and ownBoard array
  for (let i = 0; i < size; i++) {
    if (!board[i]) {
      board[i] = [];
    }
    if (!maskedBoard[i]) {
      maskedBoard[i] = [];
    }
    if (!ownBoard[i]) {
      ownBoard[i] = [];
    }
    for (let j = 0; j < size; j++) {
      if (!board[i][j]) {
        board[i][j] = [];
      }
      if (!maskedBoard[i][j]) {
        maskedBoard[i][j] = [];
      }
      if (!ownBoard[i][j]) {
        ownBoard[i][j] = [];
      }
      //clear ai board and fill in the ai ships ('o')
      board[i][j] = "🌊";
      maskedBoard[i][j] = "🌊";
      for (const el in ships) {
        i === ships[el].row && j === ships[el].column
          ? (board[i][j] = "🚢")
          : "🌊";
      }
      //clear ownBoard
      ownBoard[i][j] = "🌊";
    }
  }
  displayBoard({ boardnumber: 1, board: maskedBoard });
  displayBoard({ boardnumber: 2, board: ownBoard });
}

function selectGame(data) {
  resetGamePhase();
  getSettings(data);
  gamePhase.phase = "placement";
  gamePhase.clicks = 0;
  gamePhase.level = data;
}

function handleClick(data) {
  //count the enemy ships --> allowed clicks for the player at placement phase
  if (gamePhase.phase === "placement" && data.tableNumber === 2) {
    if (allowedCell(data)) {
      if (gamePhase.clicks < gamePhase.maxShip) {
        ownBoard[data.x.charCodeAt(0) - 65][data.y] = "🛳️"; //A ascii: 65-->A=0,B=1...
        gamePhase.clicks += 1;

        if (gamePhase.clicks == gamePhase.maxShip) {
          displayMessage("Click the AI shoot button", "red");
          gamePhase.phase = "shooting";
        }
      }
    }
  } else if (data.tableNumber === 1 && gamePhase.phase == "shooting") {
    {
      playerShoot(data);
    }
  }
  displayBoard({ boardnumber: 2, board: ownBoard });
}

function allowedCell(data) {
  let isAllowed = true;
  const datax = data.x.charCodeAt(0) - 65;
  //check if the cell is a ship --> not allowed
  if (ownBoard[datax][data.y] === "🛳️") {
    isAllowed = false;
  }
  /*else if its not the edge of the board towards this direction (cell+1 exists)
  && cell+1 in this direction is a ship --> not allowed*/
  //direction to check: up
  else if (datax !== 0 && ownBoard[datax - 1][data.y] === "🛳️") {
    isAllowed = false;
  }
  //direction to check:down
  else if (
    datax !== ownBoard.length - 1 &&
    ownBoard[datax + 1][data.y] === "🛳️"
  ) {
    isAllowed = false;
  }
  //direction to check:left
  else if (
    data.y !== 0 &&
    ownBoard[datax][Number(data.y) - Number(1)] === "🛳️"
  ) {
    isAllowed = false;
  }
  //direction to check:right
  else if (
    data.y != ownBoard[datax].length - 1 &&
    ownBoard[datax][Number(data.y) + Number(1)] === "🛳️"
  ) {
    isAllowed = false;
  }
  return isAllowed;
}

function resetGamePhase() {
  gamePhase.phase = "placement";
  gamePhase.attackTurn = "ai";
  gamePhase.clicks = 0;
  gamePhase.maxShip = 0;
  gamePhase.mapSize = 0;
  gamePhase.aiHits = 0;
  gamePhase.playerHits = 0;
}

function resetGame() {
  gamePhase.clicks = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = "🌊";
      ownBoard[i][j] = "🌊";
      maskedBoard[i][j] = "🌊";
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
    gamePhase.attackTurn === "player" &&
    gamePhase.phase === "shooting" &&
    data.tableNumber === 1
  ) {
    const x = data.x.charCodeAt(0) - 65;
    const y = data.y;
    if (board[x][y] === "🚢") {
      gamePhase.playerHits++;
      board[x][y] = "💥";
      maskedBoard[x][y] = "💥";

      displayTextMessage(
        `AI score: ${gamePhase.aiHits}, \n Player score: ${gamePhase.playerHits}`
      );

      if (gamePhase.playerHits === gamePhase.maxShip) {
        isOver = true;
        gamePhase.phase = "end";
      }
    } else if (board[x][y] === "🌊") {
      board[x][y] = "💦";
      maskedBoard[x][y] = "💦";
      displayTextMessage(`You missed!`);
    }

    if (isOver) {
      displayMessage(`WINNER WINNER CHICKN DINNER`);
    } else {
      gamePhase.attackTurn = "ai";
      displayMessage("Click the AI shoot button", "black");
    }
    displayBoard({ boardnumber: 1, board: maskedBoard });
  }
}

function aiShoot(data) {
  const x = data.x.charCodeAt(0) - 65;
  const y = data.y - 1;
  let isOver = false;

  if (ownBoard[x][y] !== "💥" && ownBoard[x][y] !== "💦") {
    if (
      gamePhase.attackTurn === "ai" &&
      gamePhase.phase === "shooting" &&
      gamePhase.aiHits < gamePhase.maxShip
    ) {
      if (ownBoard[x][y] === "🛳️") {
        gamePhase.aiHits++;
        ownBoard[x][y] = "💥";
        displayTextMessage(
          `AI score: ${gamePhase.aiHits}, \n Player score: ${gamePhase.playerHits}`
        );
        if (gamePhase.aiHits === gamePhase.maxShip) {
          isOver = true;
        }
      } else if (ownBoard[x][y] === "🌊") {
        ownBoard[x][y] = "💦";
        displayTextMessage(`AI missed!`);
      }

      if (isOver) {
        gamePhase.phase = "end";
        displayMessage(`AI wins`);
      } else {
        gamePhase.attackTurn = "player";
        displayMessage(`Player's turn`, "black");
      }
      displayBoard({ boardnumber: 2, board: ownBoard });
    }
  } else {
    aiShoot({
      x: String.fromCharCode(Math.floor(Math.random() * board.length + 65)),
      y: Math.floor(Math.random() * board.length + 1),
    });
  }
}
