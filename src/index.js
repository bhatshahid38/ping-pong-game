import "./styles.css";

// gets elements with specified ids from the HTML DOM
var ball = document.getElementById("ball");
var rod1 = document.getElementById("rod1");
var rod2 = document.getElementById("rod2");

// constants for the names of the rods and the storage keys for the scores
const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";
// variables for score, maximum score, interval for movement, and rod names
let score,
  maxScore,
  movement,
  rod,
  ballSpeedX = 2,
  ballSpeedY = 2;

let gameOn = false; // variable for the game being on or off

let windowWidth = window.innerWidth,
  windowHeight = window.innerHeight;

// IIFE to initialize the game
(function () {
  // gets the item stored in local storage with key 'storeName'
  rod = localStorage.getItem(storeName);
  // gets the item stored in local storage with key 'storeScore'
  maxScore = localStorage.getItem(storeScore);

  // if the stored rod or score is null, then it is the first time playing the game

  if (rod === "null" || maxScore === "null") {
    alert("This is the first time you are playing this game. LET'S START");
    maxScore = 0;
    rod = "Rod1";
  } else {
    // else, display the stored rod and score
    alert(rod + " has maximum score of " + maxScore * 100);
  }

  resetBoard(rod); // reset the board
})();

var rodAudio = new Audio("./sounds/rodSound.wav");
var wallAudio = new Audio("./sounds/wallHitSound.wav");

// function to reset the board and set the ball and rods to their starting positions
function resetBoard(rodName) {
  // set rod1 to the center of the window
  rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + "px";
  // set rod2 to the center of the window
  rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + "px";
  // set ball to the center of the window
  ball.style.left = (windowWidth - ball.offsetWidth) / 2 + "px";

  // if rodName is rod2, set ball below rod1
  if (rodName === rod2Name) {
    ball.style.top = rod1.offsetTop + rod1.offsetHeight + "px";
    ballSpeedY = 4;
  } else if (rodName === rod1Name) {
    // else if rodName is rod1, set ball above rod2
    ball.style.top = rod2.offsetTop - rod2.offsetHeight + "px";
    ballSpeedY = -4;
  }

  score = 0; // reset score to 0
  gameOn = false; // set gameOn to false
}
// function to store the win and update the maximum score if the score is higher than the previous maximum
function storeWin(rod, score) {
  if (score > maxScore) {
    maxScore = score;
    // store the rod name in local storage with key 'storeName'
    localStorage.setItem(storeName, rod);
    // store the maximum score in local storage with key 'storeScore'
    localStorage.setItem(storeScore, maxScore);
  }

  clearInterval(movement); // clear the interval for movement
  resetBoard(rod); // reset the board
  // display the rod name, score, and maximum score in an alert
  alert(
    rod +
      " wins with a score of " +
      score * 100 +
      ". Max score is: " +
      maxScore * 100
  );
}
// event listener for key press
window.addEventListener("keypress", function () {
  let rodSpeed = 20; //speed at which the rods move
  // get the bounding rectangle for rod1
  let rodRect = rod1.getBoundingClientRect();

  // if the key pressed is 'D' and the rod is not at the edge of the window, move rod1 to the right
  if (event.code === "KeyD" && rodRect.x + rodRect.width < window.innerWidth) {
    rod1.style.left = rodRect.x + rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  } else if (event.code === "KeyA" && rodRect.x > 0) {
    rod1.style.left = rodRect.x - rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  }

  if (event.code === "Enter") {
    if (!gameOn) {
      gameOn = true;
      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      let ballDia = ballRect.width;

      let rod1Height = rod1.offsetHeight;
      let rod2Height = rod2.offsetHeight;
      let rod1Width = rod1.offsetWidth;
      let rod2Width = rod2.offsetWidth;

      movement = setInterval(function () {
        // Move ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        let rod1X = rod1.getBoundingClientRect().x;
        let rod2X = rod2.getBoundingClientRect().x;

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        if (ballX + ballDia > windowWidth || ballX < 0) {
          ballSpeedX = -ballSpeedX; // Reverses the direction
        }

        // It specifies the center of the ball on the viewport
        let ballPos = ballX + ballDia / 2;

        // Check for Rod 1
        if (ballY <= rod1Height) {
          ballSpeedY = -ballSpeedY; // Reverses the direction
          score++;

          // Check if the game ends
          if (ballPos < rod1X || ballPos > rod1X + rod1Width) {
            storeWin(rod2Name, score);
          }
        }

        // Check for Rod 2
        else if (ballY + ballDia >= windowHeight - rod2Height) {
          ballSpeedY = -ballSpeedY; // Reverses the direction
          score++;

          // Check if the game ends
          if (ballPos < rod2X || ballPos > rod2X + rod2Width) {
            storeWin(rod1Name, score);
          }
        }
      }, 10);
    }
  }
});
