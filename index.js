const board = [["","","",""],["","","","0"],["q","","",""],["","","",""]];

function selectGame(data) {
  displayMessage(data, "black");
}

function handleClick(data) {
  displayMessage(data.x + data.y + data.clickType);
}

function resetGame() {
  for(let i = 0; i < board.length; i++) {
    for(let j = 0; j < board[i].length; j++) {
      board[i][j] = "";
    }
  }
  displayBoard({boardnumber: 1,board: board});
}

function aiShoot(data) {
  
}

displayBoard({boardnumber: 1,board: board});
displayBoard({boardnumber: 2,board: board});
displayMessage("message", "green");
displayTextMessage("text message", "red");