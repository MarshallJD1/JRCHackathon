document.addEventListener("DOMContentLoaded", () => {
  console.log("Connected to script.js");

  // Get references to DOM elements
  const paddle = document.getElementById("paddle");
  const ball = document.getElementById("ball");
  const bricksContainer = document.getElementById("bricks");
  const scoreDisplay = document.getElementById("score");
  const livesDisplay = document.getElementById("lives");
  const startButton = document.getElementById("start-game");
  const gameViewport = document.getElementById("game-viewport");
  const tapToBegin = document.getElementById("tap-to-begin"); // touch screen only
  const livesRemaining = document.getElementById("lives-remaining"); // New element
  const powerUpMessage = document.getElementById("power-up-message");
  const highScoresModalElement = document.getElementById('highScoresModal');
  const highScoresModal = new bootstrap.Modal(highScoresModalElement);
  const showHighScoresButton = document.getElementById('show-high-scores');
  const showHighScoresButtonDesktop = document.getElementById('show-high-scores-desktop');
  const burgerMenu = new bootstrap.Collapse(document.getElementById('navbarNav'));
  
  

  const buttonContainer = document.querySelector(".button-container");

  // Get references to audio elements
  const beepA = document.getElementById("beep-a");
  const beepB = document.getElementById("beep-b");
  const fail = document.getElementById("fail"); // New audio element

  // Initialize game variables
  const initialSpeed = 8; // Initial speed
  let ballSpeed = { x: 0, y: 0 }; // Speed of the ball in x and y directions
  let ballPosition = { x: 0, y: 0 }; // Position of the ball
  let paddlePosition = 250; // Initial position of the paddle
  let score = 0; // Initial score
  let lives = 3; // Initial number of lives
  let isGameRunning = false; // Game state
  let isCooldown = false; // Cooldown flag
  let currentRound = 1; // Current round

  // Brick variables
  const brickRowCount = 4; // Number of rows of bricks
  const brickColumnCount = 8; // Number of columns of bricks
  const brickPadding = 5; // Padding between bricks
  const brickWidth = (gameViewport.clientWidth - (brickColumnCount + 1) * brickPadding) / brickColumnCount; // Calculate brick width
  const brickHeight = 20; // Brick height

  // Function to create bricks
  function createBricks() {
    bricksContainer.innerHTML = ""; // Clear existing bricks
    bricksContainer.style.display = "grid";
    bricksContainer.style.gridTemplateColumns = `repeat(${brickColumnCount}, ${brickWidth}px)`;
    bricksContainer.style.gridGap = `${brickPadding}px`;

    for (let row = 0; row < brickRowCount; row++) {
      for (let col = 0; col < brickColumnCount; col++) {
        const brick = document.createElement("div");
        brick.classList.add("brick");
        brick.style.width = `${brickWidth}px`;
        brick.style.height = `${brickHeight}px`;

        // Assign different colors to each row
        if (row === 0) brick.classList.add("red-brick");
        else if (row === 1) brick.classList.add("blue-brick");
        else if (row === 2) brick.classList.add("green-brick");
        else brick.classList.add("yellow-brick");

        bricksContainer.appendChild(brick);
      }
    }
  }

  // Function to create bricks for round 2
  function createBricksRound2() {
    bricksContainer.innerHTML = ""; // Clear existing bricks
    for (let i = 0; i < 30; i++) { // Increase the number of bricks
      const brick = document.createElement("div");
      brick.classList.add("brick");

      if (i < 10) brick.classList.add("red-brick");
      else if (i < 20) brick.classList.add("blue-brick");
      else brick.classList.add("green-brick");

      bricksContainer.appendChild(brick);
    }
  }

  // Function to create bricks for round 3
  function createBricksRound3() {
    bricksContainer.innerHTML = ""; // Clear existing bricks
    for (let i = 0; i < 40; i++) { // Increase the number of bricks
      const brick = document.createElement("div");
      brick.classList.add("brick");

      if (i < 10) brick.classList.add("red-brick");
      else if (i < 20) brick.classList.add("blue-brick");
      else if (i < 30) brick.classList.add("green-brick");
      else brick.classList.add("yellow-brick");

      bricksContainer.appendChild(brick);
    }
  }

  // Function to check if there are no bricks left
  function checkBricks() {
    const bricks = document.querySelectorAll(".brick");
    return bricks.length === 0;
  }

  // Reset the ball and paddle position
  function resetBallAndPaddle() {
    const gameBounds = document.getElementById("game-viewport").getBoundingClientRect();
    const paddleWidth = paddle.offsetWidth;
    const ballDiameter = ball.offsetWidth;

    // Center the paddle in the game viewport
    paddlePosition = (gameBounds.width - paddleWidth) / 2;
    paddle.style.left = `${paddlePosition}px`;

    // Position the ball just above the paddle, centered horizontally
    ballPosition.x = paddlePosition + paddleWidth / 2 - ballDiameter / 2;
    ballPosition.y = gameBounds.height - paddle.offsetHeight - ballDiameter - 10; // Place ball just above paddle
    ball.style.left = `${ballPosition.x}px`;
    ball.style.top = `${ballPosition.y}px`;

    // Reset ball speed
    ballSpeed = { x: 0, y: 0 };

    // Re-enable the start button
    startButton.disabled = false;

    // Debugging output
    console.log("Ball Position:", ballPosition);
    console.log("Paddle Position:", paddlePosition);
  }

  // Function to set initial ball direction
  function setInitialBallDirection() {
    const angle = (Math.random() * 60 + 60) * (Math.PI / 180); // Angle between 60-120 degrees
    ballSpeed = { x: initialSpeed * Math.cos(angle), y: -initialSpeed * Math.sin(angle) }; // Ball goes upwards
  }

  // Function to reset the game
  function resetGame() {
    lives = 3;
    score = 0;
    currentRound = 1;
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    createBricks();
    resetBallAndPaddle();
    isGameRunning = false; // Ensure game is not running after reset
  }

  // Event listener to move the paddle with mouse
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

  // Event listener to move the paddle with touch
  gameViewport.addEventListener("touchmove", (e) => {
    const gameBounds = document.getElementById("game-viewport").getBoundingClientRect();
    const paddleWidth = paddle.offsetWidth;

  //Event listener to hide menu by default on tough
  buttonContainer.addEventListener("click", () => {
    buttonContainer.classList.toggle("selected");
  });

    // Calculate new paddle position
    let touch = e.touches[0];
    let newPaddleX = touch.clientX - gameBounds.left - paddleWidth / 2;

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

  gameViewport.addEventListener("click", () => {
    if (!isGameRunning || (ballSpeed.x === 0 && ballSpeed.y === 0)) {
      isGameRunning = true;
      startButton.disabled = true; // Disable the start button
      tapToBegin.style.display = 'none'; // Hide the "tap to begin" message
      setInitialBallDirection();
      gameLoop();
    }
  });

  startButton.addEventListener("click", () => {
    if (!isGameRunning || (ballSpeed.x === 0 && ballSpeed.y === 0)) {
      isGameRunning = true;
      startButton.disabled = true; // Disable the start button
      setInitialBallDirection();
      gameLoop();
    }
  });

  // Ball movement and collision detection
  function moveBall() {
    ballPosition.x += ballSpeed.x;
    ballPosition.y += ballSpeed.y;

    const gameBounds = gameViewport.getBoundingClientRect();
    const ballDiameter = ball.offsetWidth;

    // Wall collision
    if (ballPosition.x <= 0 || ballPosition.x >= gameBounds.width - ballDiameter) {
      ballSpeed.x *= -1;
      beepA.currentTime = 0; // Reset audio playback position
      beepA.play(); // Play sound for wall collision
    }
    if (ballPosition.y <= 0) {
      ballSpeed.y *= -1;
      beepA.currentTime = 0; // Reset audio playback position
      beepA.play(); // Play sound for wall collision
    }

    // Paddle collision
    const paddleRect = paddle.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();
    if (
      ballRect.bottom >= paddleRect.top &&
      ballRect.left < paddleRect.right &&
      ballRect.right > paddleRect.left &&
      ballSpeed.y > 0 // Ensure the ball is moving downwards
    ) {
      // Calculate the hit position relative to the center of the paddle
      const hitPosition = (ballRect.left + ballRect.width / 2) - (paddleRect.left + paddleRect.width / 2);
      const maxBounceAngle = Math.PI / 3; // 60 degrees
      const normalizedHitPosition = hitPosition / (paddleRect.width / 2);
      const bounceAngle = normalizedHitPosition * maxBounceAngle;

      // Calculate new ball speed based on the bounce angle
      const speed = Math.sqrt(ballSpeed.x * ballSpeed.x + ballSpeed.y * ballSpeed.y);
      ballSpeed.x = speed * Math.sin(bounceAngle);
      ballSpeed.y = -speed * Math.cos(bounceAngle);

      beepB.currentTime = 0; // Reset audio playback position
      beepB.play(); // Play sound for paddle collision
    }

    // Brick collision
    if (!isCooldown) {
      const bricks = document.querySelectorAll(".brick");
      for (const brick of bricks) {
        if (brick.classList.contains("hit")) continue; // Skip hidden bricks

        const rect = brick.getBoundingClientRect();
        if (
          ballRect.left < rect.right &&
          ballRect.right > rect.left &&
          ballRect.top < rect.bottom &&
          ballRect.bottom > rect.top
        ) {
          ballSpeed.y *= -1;
          brick.classList.add("hit"); // Add 'hit' class to hide the brick
          score++;
          scoreDisplay.textContent = `Score: ${score}`;
          beepA.currentTime = 0; // Reset audio playback position
          beepA.play(); // Play sound for brick collision
        }
      }
    }

    // Check if there are no bricks left
    if (checkBricks()) {
      alert("Round Cleared!");
      currentRound++;
      if (currentRound === 2) {
        createBricksRound2();
      } else if (currentRound === 3) {
        createBricksRound3();
      } else {
        alert("You have completed all rounds!");
        isGameRunning = false;
        resetGame();
      }
    }

    // Lose condition (ball hits bottom of viewport)
    if (ballPosition.y >= gameBounds.height - ballDiameter) { // Ball hits bottom of the viewport
      lives--;
      livesDisplay.textContent = `Lives: ${lives}`;
      fail.currentTime = 0; // Reset audio playback position
      fail.play(); // Play sound for losing a life
      livesRemaining.textContent = `You have ${lives} lives remaining`; // Update lives remaining message
      livesRemaining.style.display = 'block'; // Show the message
      setTimeout(() => {
        livesRemaining.style.display = 'none'; // Hide the message after 2 seconds
      }, 2000);
      if (lives > 0) {
        resetBallAndPaddle();
        isGameRunning = false; // Ensure game is not running after losing a life
        startButton.disabled = false; // Re-enable the start button
      } else {
        alert("Game Over!");
        isGameRunning = false;
        resetGame();
      }
    }
   
    // Update ball position
    ball.style.left = `${ballPosition.x}px`;
    ball.style.top = `${ballPosition.y}px`;

    if (ballSpeed.x === 0 && ballSpeed.y === 0) {
      setInitialBallDirection(); // Set speed again if needed
    }
  }

  // Game loop
  function gameLoop() {
    if (isGameRunning) {
      moveBall();
      requestAnimationFrame(gameLoop);
    }
  }

  // Initialize game
  resetGame();  
});