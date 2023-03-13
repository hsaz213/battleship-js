let board = [];
let ownBoard = []

function getSettings(data){
  let [size, ...ste] = data.split(',') // ['size:4', 's:{s1:a1,s2:c4}']
  let steps = ste.join(',')

  size = size.split(':')[1] // ['size', '4'] -> 4
  steps = steps.slice(3, -1) // 's:{s1:a1,s2:c4}' -> 's1:a1,s2:c4'
  steps = steps.split(',') // ['s1:a1', 's2:c4']

  let stepsArray = getStepsByArray(steps)

  generateMap(size)
}

function getStepsByArray(array){
  let obj = {}

  for(let i = 0; i< array.length; i++){
    let splited = array[i].split(':')[1] // ['s1:a1', 's2:c4'] -> ['s1' ,'a1', 's2', 'c4']
    let data = splited.split('') // ['a1', 'c4'] -> ['a', '1']
    let key = data[0].charCodeAt(0)-97 // ['a', '1'] -> (a->0, 1)
    let pos = data[1] // 1, 4

    obj[key+1] = pos
    /*
      {
        1: "1",
        3: "4" 
      }
    */
  }
  
  return obj
}

function generateMap(size){
  board = []
  ownBoard = []

  for(let i = 0; i < size; i++){
    if(!board[i]) {board[i] = []}
    if(!ownBoard[i]) {ownBoard[i] = []}

    for(let j = 0; j < size; j++){
      if(!board[i][j]){board[i][j] = []}
      if(!ownBoard[i][j]){ownBoard[i][j] = []}

      board[i][j] = ""
      ownBoard[i][j] = ""
    }
  }

  displayBoard({boardnumber: 1,board: board});
  displayBoard({boardnumber: 2,board: ownBoard});
}


function selectGame(data) {
  displayMessage(data, "black");
  getSettings(data)
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
displayBoard({boardnumber: 2,board: ownBoard});
displayMessage("message", "green");
displayTextMessage("text message", "red");