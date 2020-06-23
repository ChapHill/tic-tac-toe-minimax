let board;
const player_token = 'X';
const computer_token = 'O';

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }


const cells = document.getElementsByClassName('grid-item');
const reset = document.getElementById('myButton');
reset.addEventListener('click', resetGame);
onStartGame();

function resetGame() {
    onStartGame();
}

function onStartGame() {


  board = Array.from(Array(9).keys());
  document.getElementById("winner").innerHTML = "Click a Square!";
  document.getElementById("myButton").style.display = "none";


  for (let i = 0; i < 9; i++) {
    cells[i].innerText = '';
    cells[i].addEventListener('click', onTurnClick, false)
  }
};

function onTurnClick(e) {

  const squareId = e.target.id;

  //game is over... dont do anything
  if(calculateWinner(board)) {
    return;
  }
  
  if (typeof board[squareId] === 'number') {
    onTurn(squareId, player_token);
    if(tieGame()) {
        document.getElementById("winner").innerHTML = "It's a tie!"
        document.getElementById("myButton").style.display = "inline-block";
        return;
    } else {
        onTurn(moveComputer(), computer_token);
    }
    
  } else {
    //spot is already occupied... don't do anything
    return;
  }
}

function onTurn(squareId, player) {
  board[squareId] = player;
  document.getElementById(squareId).innerText = player;

    if(calculateWinner(board)) {
        //impossible for human player to win
        document.getElementById("winner").innerHTML = "Computer Wins!";
        document.getElementById("myButton").style.display = "inline-block";
    }
  
}

function onCheckWin(board, player) {
  let gameWon = calculateWinner(board);

  if(gameWon === player) { 
    gameWon = true;
  } else {
    gameWon = false;
  }

  return gameWon;
}


function tieGame() {
    if(!calculateWinner(board) && emptySquares().length === 0) {
        return true;
    } else {
        return false;
    }
}

function emptySquares() {
  return board.filter(item => typeof item === 'number');
}

function moveComputer() {
  return minimax(board, computer_token).index;
}

function minimax(newBoard, player) {
  let availableSpots = emptySquares();

  if (onCheckWin(newBoard, player_token)) {
    return { score: -10 }
  } else if (onCheckWin(newBoard, computer_token)) {
    return { score: 10 }
  } else if (availableSpots.length === 0) {
    return { score: 0 } 
  }

  let moves = [];

  for (let i=0; i<availableSpots.length; i++) {
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player === computer_token) {
      let result = minimax(newBoard, player_token);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, computer_token);
      move.score = result.score;
    } 

    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  } 

  let bestMove;

  if (player === computer_token) {
    let bestScore = -10000;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    } 
  } else {
    let bestScore = 10000;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
} 