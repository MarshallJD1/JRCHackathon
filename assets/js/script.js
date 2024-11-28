console.log("Connected to script.js");

// Get references to DOM elements
const paddle = document.getElementById("paddle");
const ball = document.getElementById("ball");
const bricksContainer = document.getElementById("bricks");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const startButton = document.getElementById("start-game");

// Initialize game variables
let ballSpeed = { x: 2, y: -2 }; // Speed of the ball in x and y directions
let paddleSpeed = 10; // Speed of the paddle
let ballPosition = { x: 290, y: 370 }; // Initial position of the ball
let paddlePosition = 250; // Initial position of the paddle
let score = 0; // Initial score
let lives = 3; // Initial number of lives
let isGameRunning = false; // Game state

// Function to create bricks
function createBricks() {
  // Loop to create 20 bricks
  for (let i = 0; i < 20; i++) {
    // Create a new div element for each brick
    const brick = document.createElement("div");
    // Add the "brick" class to the new div element
    brick.classList.add("brick");

    // Assign an additional class based on the brick's position
    if (i < 5) {
      // First 5 bricks will have the "red-brick" class
      brick.classList.add("red-brick");
    } else if (i < 10) {
      // Next 5 bricks will have the "blue-brick" class
      brick.classList.add("blue-brick");
    } else if (i < 15) {
      // Next 5 bricks will have the "green-brick" class
      brick.classList.add("green-brick");
    } else {
      // Last 5 bricks will have the "yellow-brick" class
      brick.classList.add("yellow-brick");
    }

    // Append the newly created brick to the bricks container in the DOM
    bricksContainer.appendChild(brick);
  }
}

// Function to reset the ball and paddle position
function resetBallAndPaddle() {
  const gameBounds = document.getElementById("game-viewport").getBoundingClientRect();
  const paddleWidth = paddle.offsetWidth;

  // Reset paddle position to the middle
  const paddleX = (gameBounds.width - paddleWidth) / 2;
  paddle.style.left = `${paddleX}px`;

  // Reset ball position on top of the paddle
  const paddleRect = paddle.getBoundingClientRect();
  ballPosition = { x: paddleRect.left + paddleRect.width / 2 - ball.offsetWidth / 2, y: paddleRect.top - ball.offsetHeight };
  ball.style.left = `${ballPosition.x}px`;
  ball.style.top = `${ballPosition.y}px`;
  ballSpeed = { x: 0, y: 0 }; // Stop the ball
}

// Function to set the initial ball direction
function setInitialBallDirection() {
  // Set a random angle between 60 and 120 degrees
  const angle = (Math.random() * 60 + 60) * (Math.PI / 180);
  ballSpeed = { x: 2 * Math.cos(angle), y: -2 * Math.sin(angle) };
}

// Function to reset the game
function resetGame() {
  lives = 3;
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  livesDisplay.textContent = `Lives: ${lives}`;
  resetBallAndPaddle();
  createBricks();
}

// Event listener to move the paddle
document.addEventListener("mousemove", (e) => {
  const gameBounds = document.getElementById("game-viewport").getBoundingClientRect();
  const paddleWidth = paddle.offsetWidth;

  // Calculate new paddle position
  let newPaddleX = e.clientX - gameBounds.left - paddleWidth / 2;

  // Constrain paddle within the game bounds
  newPaddleX = Math.max(0, Math.min(newPaddleX, gameBounds.width - paddleWidth));

  // Update paddle position
  paddle.style.left = `${newPaddleX}px`;

  // Update ball position if the ball is not moving
  if (ballSpeed.x === 0 && ballSpeed.y === 0) {
    ballPosition.x = newPaddleX + paddleWidth / 2 - ball.offsetWidth / 2;
    ball.style.left = `${ballPosition.x}px`;
  }
});

// Event listener to start the ball movement
startButton.addEventListener("click", () => {
  if (ballSpeed.x === 0 && ballSpeed.y === 0) {
    setInitialBallDirection();
    if (!isGameRunning) {
      isGameRunning = true;
      gameLoop();
    }
  }
});

// Ball movement and collision
function moveBall() {
  ballPosition.x += ballSpeed.x;
  ballPosition.y += ballSpeed.y;

  // Wall collision
  if (ballPosition.x <= 0 || ballPosition.x >= 590) ballSpeed.x *= -1;
  if (ballPosition.y <= 0) ballSpeed.y *= -1;

  // Paddle collision
  const paddleRect = paddle.getBoundingClientRect();
  const ballRect = ball.getBoundingClientRect();
  if (
    ballRect.bottom >= paddleRect.top &&
    ballRect.left >= paddleRect.left &&
    ballRect.right <= paddleRect.right
  ) {
    ballSpeed.y *= -1;
    ballPosition.y = paddleRect.top - ballRect.height; // Ensure the ball is above the paddle
  }

  // Brick collision
  const bricks = document.querySelectorAll(".brick");
  for (const brick of bricks) {
    const rect = brick.getBoundingClientRect();
    if (
      ballRect.left < rect.right &&
      ballRect.right > rect.left &&
      ballRect.top < rect.bottom &&
      ballRect.bottom > rect.top
    ) {
      ballSpeed.y *= -1;
      brick.remove();
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      break; // Exit the loop after hitting one brick
    }
  }

  // Lose condition
  if (ballPosition.y >= 400) { // Ball is out of bounds at the bottom of the screen 
    lives--; // lose life
    livesDisplay.textContent = `Lives: ${lives}`;
    resetBallAndPaddle(); // reset ball and paddle position
    if (lives === 0) { // if no lives left
      alert("Game Over!");
      isGameRunning = false;
      resetGame();
    }
  }

  ball.style.left = `${ballPosition.x}px`;
  ball.style.top = `${ballPosition.y}px`;
}

// Game loop function to move ball
function gameLoop() {
  if (isGameRunning) {
    moveBall();
    requestAnimationFrame(gameLoop);
  }
}

// Start game button
startButton.addEventListener("click", () => {
  if (!isGameRunning) {
    isGameRunning = true;
    resetGame();
    gameLoop();
  }
});

// Initialize
createBricks();
resetBallAndPaddle();
