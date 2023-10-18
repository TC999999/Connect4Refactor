/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.player1 = new Player(color1.value);
    this.player2 = new Player(color2.value);
    this.currPlayer = this.player1;
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById("board");
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    board.append(top);
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.colorStr;
    piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  handleClick(e) {
    if (!this.gameOver) {
      const x = +e.target.id;
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);
      if (this.checkForWin()) {
        this.gameOver = true;
        if (this.currPlayer === this.player1) {
          return this.endGame("Player 1 won!");
        } else {
          return this.endGame("Player 2 won!");
        }
      }
      if (this.board.every((row) => row.every((cell) => cell))) {
        this.gameOver = true;
        return this.endGame("Tie!");
      }
      this.currPlayer =
        this.currPlayer === this.player1 ? this.player2 : this.player1;
    }
  }

  checkForWin() {
    function _win(cells) {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];
        if (
          _win.bind(this)(horiz) ||
          _win.bind(this)(vert) ||
          _win.bind(this)(diagDR) ||
          _win.bind(this)(diagDL)
        ) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(colorStr) {
    this.colorStr = colorStr;
  }
}

const start = document.querySelector("#start");
const color1 = document.querySelector("#color1");
const color2 = document.querySelector("#color2");
start.addEventListener("click", function () {
  const board = document.getElementById("board");
  while (board.hasChildNodes()) {
    board.removeChild(board.firstChild);
  }
  if (color1.value === "" || color2.value === "") {
    alert("WILL BOTH PLAYERS PLEASE CHOOSE A COLOR");
  } else if (color1.value === color2.value) {
    alert("PLEASE CHOOSE DIFFERENT COLORS");
  } else {
    new Game(6, 7);
  }
});
