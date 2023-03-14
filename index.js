/* eslint-disable no-unused-expressions */
let board = []; //define ai board
let ownBoard = []; //define player board
let gamePhase={
  phase:"placement",
  attackTurn: "ai",
  clicks:0,
  level: "",
  maxShip: 0,
  mapSize: 0
};  /*game phases:
placement (initial phase):
  ai placement called from selectGame,
  player placement called from handleClick.
shooting: both from handleClick: player shoots then call aiShoot
noClicks: don't log the clicks, don't put P on the board (after restart)
clicks: count the player clicks, after the 2nd click, set phase to shooting*/

//data parsing input parameter data: size:4,s:{s1:a1,s2:c4}
function getSettings(data){
  let [size, ...ste] = data.split(',') // ['size:4', 's:{s1:a1,s2:c4}']
  let steps = ste.join(',')

  size = size.split(':')[1] // ['size', '4'] -> 4
  gamePhase.mapSize = size

  //Number(size)? / Int.parse??
  steps = steps.slice(3, -1) // 's:{s1:a1,s2:c4}' -> 's1:a1,s2:c4'
  steps = steps.split(',') // ['s1:a1', 's2:c4']

  let stepsArray = getStepsByArray(steps)
  gamePhase.maxShip = stepsArray.length

  displayTextMessage(data,"black");
  displayMessage("size:"+size+", ai ships:"+JSON.stringify(stepsArray),"black");

  generateMap(size, stepsArray) //stepsArray-->ships
}

function getStepsByArray(array){
  let obj = [];  /*arr=[] instead of obj={}?*/
  for(let i = 0; i< array.length; i++){
    let splited = array[i].split(':')[1] // ['s1:a1', 's2:c4'] -> ['s1' ,'a1', 's2', 'c4']
    let data = splited.split('') // ['a1', 'c4'] -> ['a', '1']
    let row = data[0].charCodeAt(0)-97 // ['a', '1'] -> (a->0, 1)
    //a: ASCII 97
    let column = data[1] // 1, 4

    obj[i] = {
      row: row,
      column: Number(column)-1,
    }
  }
  console.log(obj)
  return obj
}
//data parsing results: obj=[{column:0,row:0},{column:3},row:2] (getStepsByArray); size=4 (getSettings)
// --> generateMap input size, ships for ai board, ship placement:
function generateMap(size, ships){ //stepsArray-->ships
  //clear the boards
  board = []
  ownBoard = []
  //make an i x j (size x size) board and ownBoard array
  for(let i = 0; i < size; i++){
    if(!board[i]) {board[i] = []}
    if(!ownBoard[i]) {ownBoard[i] = []}
    for(let j = 0; j < size; j++){
      if(!board[i][j]){board[i][j] = []}
      if(!ownBoard[i][j]){ownBoard[i][j] = []}

      //clear ai board and fill in the ai ships ("o")
      board[i][j] = ""
      for(el in ships){
        i === ships[el].row && j === ships[el].column ? board[i][j] = 'o' : ''
      }
      //clear ownBoard
      ownBoard[i][j] = ""
    }
  }
  //display the boards
  displayBoard({boardnumber: 1,board: board});
  displayBoard({boardnumber: 2,board: ownBoard});
}


function selectGame(data) {
  getSettings(data)
  gamePhase.phase="placement";/*set phase*/
  gamePhase.clicks=0;/*click counter to 0*/
  gamePhase.level = data
  //console.log(gamePhase.phase,gamePhase.clicks);
}

function handleClick(data) {
  //input parameter: data: x:"B",y:"3",clickType:"left"
  console.log("table number: "+data.tableNumber)

  if(gamePhase.phase=="player"){
    
  }else if(gamePhase.phase == "ai"){

  }
  /*count the enemy ships --> allowed clicks for the player at placement phase*/
 // console.log("ai board:",board);
  //console.log("allowedClicks initial",gamePhase.maxShip,"data.y=",data.y,"data.y-1=",data.y-1,"data.y+1=",data.y+1);

  /*place player ships*/
  if(gamePhase.phase === 'placement' && data.tableNumber === 2){
    if(allowedCell(data)){
      if(gamePhase.clicks < gamePhase.maxShip){
        ownBoard[data.x.charCodeAt(0)-65][data.y]="p";/*A ascii: 65-->A=0,B=1...*/
        gamePhase.clicks+=1;

        if(gamePhase.clicks == gamePhase.maxShip){
          gamePhase.phase = "shooting"
        }
      }
    }
  }
  else{
    if(data.tableNumber === 1){
      
      gamePhase.attackTurn = "ai"
    }
  }
  displayBoard({boardnumber: 2,board: ownBoard});/**/

  //console.log("\ngamePhase.phase:",gamePhase.phase,"\ngamePhase.clicks:",gamePhase.clicks);
  //console.log("\nownBoard",ownBoard);
}

function allowedCell(data){
  let allowedCell=true;
  /*check cell according to placement rules --> allowed cells at placement phase
  did we click on p
    ?set allowed to false
    :are we at the edge from this direction
      ?do nothing
      :is this direction+1 p
        ?allowed to false
        :do nothing*/
  /* direction to check:up */
  ownBoard[data.x.charCodeAt(0)-65][data.y]==="p"
    ?allowedCell=false
    :data.x.charCodeAt(0)-65===0
      ?undefined
      :ownBoard[data.x.charCodeAt(0)-65-1][data.y]==="p"  //y-1
        ?allowedCell=false
        :undefined;
  /* direction to check:down */
  ownBoard[data.x.charCodeAt(0)-65][data.y]==="p"
    ?allowedCell=false
    :data.x.charCodeAt(0)-65===ownBoard.length-1
      ?undefined
      :ownBoard[data.x.charCodeAt(0)-65+1][data.y]==="p"  //y+1
        ?allowedCell=false
        :undefined;
  /* direction to check:left */
  ownBoard[data.x.charCodeAt(0)-65][data.y]==="p"
    ?allowedCell=false
    :data.y===0
      ?undefined
      :ownBoard[data.x.charCodeAt(0)-65][Number(data.y)-Number(1)]==="p"  //x
        ?allowedCell=false
        :undefined;
  /* direction to check:right */
  ownBoard[data.x.charCodeAt(0)-65][data.y]==="p"
    ?allowedCell=false
    :data.y===ownBoard[data.x.charCodeAt(0)-65].length-1
      ?undefined
      :ownBoard[data.x.charCodeAt(0)-65][Number(data.y)+Number(1)]==="p"
        ?allowedCell=false
        :undefined;
  //console.log("allowedClicks:",allowedClicks,"\nallowedCell:",allowedCell,"\ndata:",data);

  return allowedCell
}

/*reset both boards*/
function resetGame() {
  gamePhase.clicks=0;/*click counter to 0*/
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = "";
      ownBoard[i][j] = "";
    }
  }
  displayBoard({ boardnumber: 1, board: board });
  displayBoard({ boardnumber: 2, board: ownBoard });

  selectGame(gamePhase.level)
}

function aiShoot(data) {
  if(gamePhase.attackTurn === "ai" && gamePhase.phase === "shooting"){
    
    const x = randomShootx(gamePhase.mapSize)
    const y = randomShooty(gamePhase.mapSize)

    console.log(x, y)

    gamePhase.attackTurn = "player"
  }
}

function randomShootx(num){
  return Math.floor(Math.random() * num)
}

function randomShooty(num){
  return Math.floor(Math.random() * num)
}
