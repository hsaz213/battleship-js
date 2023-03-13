function initGame() {
  document.querySelector("#reset").addEventListener("click", resetGame);
  document.querySelector("#aiShoot").addEventListener("click", () => {
    aiShoot({
      x: String.fromCharCode(Math.floor(Math.random() * board.length + 65)),
      y: Math.floor(Math.random() * board.length + 1),
    })
  });
  for (const gameNumber in data) {
    console.log(data[gameNumber]);
    document.getElementById("mode").insertAdjacentHTML("beforeend", `
      <option value=${data[gameNumber]}>${gameNumber}</option>
    `)
  }
  document.querySelector('.mode > select').addEventListener('input', (e) => selectGame(e.target.value));
}

function displayBoard(data) {
  const grid = data.board;
  const containerElement = document.querySelector(`.container${data.boardnumber}`);
  containerElement.innerHTML = "";
  containerElement.insertAdjacentHTML("afterbegin", creatHeadRow(grid.length))
  for (let x = 0; x < grid.length; x++) {
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");
    rowElement.insertAdjacentHTML(
      "afterbegin",
      `<div class="head-cell" style='heigth: ${90 / (grid.length + 1)}vh; width: 3vh'>${String.fromCharCode(65 + x)}</div>`,
    )
    for (let y = 0; y < grid[x].length; y++) {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.innerHTML = grid[x][y];
      cellElement.style.width = `${80 / (grid[x].length + 1)}vh`;
      cellElement.style.height = `${80 / (grid[x].length + 1)}vh`;
      cellElement.style.fontSize = `${(80 / (grid[x].length + 1)) - 5}vh`;
      cellElement.dataset.x = String.fromCharCode(65 + x);
      cellElement.dataset.y = y;
      cellElement.addEventListener("click", (e) => {
        handleClick({
          x: cellElement.dataset.x,
          y: cellElement.dataset.y,
          clickType: "left",
        });
      });
      cellElement.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        handleClick({
          x: cellElement.dataset.x,
          y: cellElement.dataset.y,
          clickType: "right",
        });
      });
      rowElement.appendChild(cellElement);
    }
    containerElement.appendChild(rowElement);
  }
}

function creatHeadRow(length) {
  let result = `<div class='head-row'><div style='width: ${80 / (length + 1)}vh'></div>`;
  for (let i = 1; i <= length; i++) {
    console.log(length);
    result += `<div class="head-cell" style='width: ${80 / (length + 1)}vh'>${i}</div>`
  }
  return result + "</div>";
}

function displayMessage(message, color) {
  document.getElementById("display").style.color = color;
  document.getElementById("display").innerHTML = message;
}

function displayTextMessage(message, color) {
  document.getElementById("textDisplay").style.color = color;
  document.getElementById("textDisplay").innerHTML = message;
}

window.addEventListener("load", () => {
  initGame();
});
