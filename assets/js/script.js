console.log("Connected to script.js");

// Get references to DOM elements
const paddle = document.getElementById("paddle");
const ball = document.getElementById("ball");
const bricksContainer = document.getElementById("bricks");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const startButton = document.getElementById("start-game");

// Initialize game variables
let ballSpeed = { x: 0, y: 0 }; // Speed of the ball in x and y directions
let ballPosition = { x: 0, y: 0 }; // Position of the ball
let paddlePosition = 250; // Initial position of the paddle
let score = 0; // Initial score
let lives = 3; // Initial number of lives
let isGameRunning = false; // Game state

// Function to create bricks
function createBricks() {
  bricksContainer.innerHTML = ""; // Clear existing bricks
  for (let i = 0; i < 20; i++) {
    const brick = document.createElement("div");
    brick.classList.add("brick");

    if (i < 5) brick.classList.add("red-brick");
    else if (i < 10) brick.classList.add("blue-brick");
    else if (i < 15) brick.classList.add("green-brick");
    else brick.classList.add("yellow-brick");

    bricksContainer.appendChild(brick);
  }
}

// Reset the ball and paddle position
function resetBallAndPaddle() {
  const gameBounds = document.getElementById("game-viewport").getBoundingClientRect();
  const paddleRect = paddle.getBoundingClientRect();
  const ballDiameter = ball.offsetWidth;

  // Center the paddle in the game viewport
  paddlePosition = (gameBounds.width - paddleRect.width) / 2;
  paddle.style.left = `${paddlePosition}px`;

  // Recalculate paddle's position after resetting
  const updatedPaddleRect = paddle.getBoundingClientRect();

  // Position the ball slightly above the paddle (adjust y position to ensure it's above)
  ballPosition.x = updatedPaddleRect.left + (updatedPaddleRect.width / 2) - (ballDiameter / 2);
  ballPosition.y = updatedPaddleRect.top - gameBounds.top - ballDiameter - 5; // Ball starts just above the paddle

  // Ensure the ball is positioned within the game viewport (not below the screen)
  if (ballPosition.y < 0) {
    ballPosition.y = 0; // Prevent the ball from being above the viewport
  }

  ball.style.left = `${ballPosition.x}px`;
  ball.style.top = `${ballPosition.y}px`;

  ballSpeed = { x: 0, y: 0 };

  // Debugging: Ensure ball is above the paddle
  console.log("Ball Position after reset:", ballPosition);
  console.log("Paddle Position:", updatedPaddleRect.left);
}

// Function to set initial ball direction (random vertical direction)
function setInitialBallDirection() {
  const angle = (Math.random() * 60 + 60) * (Math.PI / 180); // Angle between 60-120 degrees
  ballSpeed = { x: 2 * Math.cos(angle), y: -2 * Math.sin(angle) }; // Ball goes upwards
}

// Function to reset the game
function resetGame() {
  lives = 3;
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  livesDisplay.textContent = `Lives: ${lives}`;
  createBricks();
  resetBallAndPaddle(); // Reset ball and paddle positions
  // Ball speed is 0 initially, set it only when the game starts
}

// Ball movement and collision detection
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
    ballRect.left < paddleRect.right &&
    ballRect.right > paddleRect.left
  ) {
    ballSpeed.y *= -1;
    ballPosition.y = paddleRect.top - ballRect.height; // Position above paddle
  }

  // Brick collision
  const bricks = document.querySelectorAll(".brick");
  bricks.forEach((brick) => {
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
    }
  });

  // Lose condition (ball hits bottom of viewport)
  const gameBounds = document.getElementById("game-viewport").getBoundingClientRect();
  if (ballPosition.y >= gameBounds.height - ball.offsetHeight) { // Ball hits bottom of the viewport
    lives--;
    livesDisplay.textContent = `Lives: ${lives}`;
    resetBallAndPaddle();
    if (lives === 0) {
      alert("Game Over!");
      isGameRunning = false;
      resetGame();
    }
  }

  // Update ball position
  ball.style.left = `${ballPosition.x}px`;
  ball.style.top = `${ballPosition.y}px`;
}

// Game loop
function gameLoop() {
  if (isGameRunning) {
    moveBall();
    requestAnimationFrame(gameLoop);
  }
}

// Start game event
startButton.addEventListener("click", () => {
  if (!isGameRunning) {
    isGameRunning = true;
    setInitialBallDirection(); // Set ball's initial direction when start button is clicked
    gameLoop(); // Start the game loop after setting the direction
  }
});

// Initialize game
resetGame();
