let gameActive = true;
let currentPlayer = "X";
//gameState array motsvarar de olika fälten på spelplanen. I början på spelet är alla tomma
let gameState = ["", "", "", "", "", "", "", "", ""];
//functioner eftersom de har dynamisk data i sig där currentPlayer förändras genom spelet.
const winningMessage = () => `Spelare ${currentPlayer} har vunnit!`;
const drawMessage = () => `Oavgjort!`;
const currentPlayerTurn = () => `Det är ${currentPlayer}'s tur`;
//Visar vems tur det är genom att stoppa in currentPlayerTurn() i div med klassen .game---status
const statusDisplay = document.querySelector(".game--status");
statusDisplay.innerHTML = currentPlayerTurn();

let pointsX = 0;
let points0 = 0;
const scoreBoard = document.querySelector(".score");
scoreBoard.innerHTML = `Poäng X: ${pointsX} <br>
Poäng 0: ${points0}`;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

//Lägger till eventListeners till alla celler samt restart game-button
document
  .querySelectorAll(".cell")
  .forEach((cell) => cell.addEventListener("click", handleCellClick));
document
  .querySelector(".game--restart")
  .addEventListener("click", handleRestartGame);

//STEG 1 - Hantera klicket. Identifiera vart det sker genom att hämta dess data-cell-index
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );
  //redan tagen cell? gör ingeting
  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  //annars kallar vi på nästa function i spelflowet samt uppdaterar resultatet
  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

//Hantera datorns spel

/* for (let i = 0; i <= 7; i++) {
  const winCondition = winningConditions[i];
  let a = gameState[winCondition[0]];
  let b = gameState[winCondition[1]];
  let c = gameState[winCondition[2]];
  if (a === "" || b === "" || c === "") {
    continue;
  }
  if (a === b && b === c) {
    roundWon = true;
    break;
  } */
async function handleComputerClick() {
  await delay(800);

  //Kollar om det finns 2 i rad någonstans
  /* for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === "X" && b === "X") {
      gameState[winCondition[2]] = "0";
      for (let state of gameState) {
        console.log(state);
      }
    }
    if (b === "X" && c === "X") {
      gameState[winCondition[0]] = "0";
      for (let state of gameState) {
        console.log(state);
      }
    }
    if (c === "X" && a === "X") {
      gameState[winCondition[1]] = "0";
      for (let state of gameState) {
        console.log(state);
      }
    }
  } */
  /* if()
      (b === "X" && c === "X") ||
      (c === "X" && a === "X")
    ) {
     
    } */
  /*  for (let i = 0; i <= 7; i++) {
    if (gameState[winningConditions[0]] === "X") {
      console.log("Hej");
    }
  } */
  let computerClickedCellIndex = Math.floor(Math.random() * 9) + 1;

  while (gameState[computerClickedCellIndex] !== "" || !gameActive) {
    computerClickedCellIndex = Math.floor(Math.random() * 9) + 1;
  }
  const cellDivs = document.querySelectorAll("[data-cell-index]");
  let computerClickedCell = null;

  cellDivs.forEach((el) => {
    //console.log(el);
    const dataCellIndex = parseInt(el.getAttribute("data-cell-index"));

    if (dataCellIndex === computerClickedCellIndex) {
      computerClickedCell = el;
    }
  });

  //annars kallar vi på nästa function i spelflowet samt uppdaterar resultatet
  handleCellPlayed(computerClickedCell, computerClickedCellIndex);
  handleResultValidation();
}

//Steg 2 - uppdatera gameState arrayen med X eller Y och brädet med detsamma. Tar in clickedCell (som är even.target)
//och clickedCellIndex som hämtas via data-cell-index.
function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}

//Steg 3 - stämmer av om vinst, oavgjort eller nytt drag
function handleResultValidation() {
  let roundWon = false;

  //Vi går igenom varje array i arrayen winningConditions ovan och stämmer av dem mot
  //indexen i vår 'game state array' matchar.
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }
  if (roundWon) {
    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
    updateScore();
    return; //Här stannar vårt script om en spelare har vunnit.
  }
  //Om inget av värderna i vår game state array är "" längre - då är det oavgjort.
  let roundIsTie = !gameState.includes("");
  if (roundIsTie) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
  }
  //Kommer vi ända hit har ingen vunnit och det har inte blivit oavgjort.
  //Fler drag ska alltså göras.

  handlePlayerChange();
}

//Steg 4 - byt spelare och uppdatera statusDisplay meddelande
function handlePlayerChange() {
  //Är nuvarande spelare X? - byt till 0! Annars byt till "X"
  currentPlayer = currentPlayer === "X" ? "0" : "X";
  statusDisplay.innerHTML = currentPlayerTurn();
  if (currentPlayer === "0") {
    handleComputerClick();
  }
}

function updateScore() {
  if (currentPlayer === "X") {
    pointsX += 1;
  }
  if (currentPlayer === "0") {
    points0 += 1;
  }

  const scoreBoard = document.querySelector(".score");
  scoreBoard.innerHTML = `Poäng X: ${pointsX} <br>
Poäng 0: ${points0}`;
}

//Sätter defaultläget
function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.innerHTML = currentPlayerTurn();
  //Rensar alla celler genom att plocka fram alla divar med klassen cell och sätta dem till "".
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));
}

//Hjälpfunktion, motvsrande Thread.Sleep(ms) i C#
function delay(ms) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
  return promise;
}
