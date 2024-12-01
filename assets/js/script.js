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

  // Get references to audio elements
  const beepA = document.getElementById("beep-a");
  const beepB = document.getElementById("beep-b");
  const fail = document.getElementById("fail"); // New audio element
  const powerUp = document.getElementById("powerUp1"); // New audio element
  const complete = document.getElementById("complete"); // New audio element
  const completeGame = document.getElementById("completeGame"); // New audio element

  // Set volume cap for audio elements
  const volumeCap = 0.5; // Set volume cap to 50%
  beepA.volume = volumeCap;
  beepB.volume = volumeCap;
  fail.volume = volumeCap;
  powerUp.volume = volumeCap;
  complete.volume = volumeCap;
  completeGame.volume = volumeCap;

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
  const brickRowCount = 6; // Number of rows of bricks
  const brickColumnCount = 8; // Number of columns of bricks
  const brickPadding = 2; // Padding between bricks
  const brickWidth = (gameViewport.clientWidth - (brickColumnCount + 1) * brickPadding) / brickColumnCount; // Calculate brick width
  const brickHeight = 20; // Brick height

  // Store timer IDs for power-ups
  let paddleSizeTimer;
  let ballSizeTimer;
  let ballSpeedTimer;

  // High scores logic
  const highScoreForm = document.getElementById('highScoreForm');
  const playerNameInput = document.getElementById('playerName');
  const highScoresList = document.getElementById('highScoresList');

  // Load high scores from localStorage
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

  // Function to update the high scores list
  function updateHighScoresList() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const highScoresList = document.getElementById('highScoresList');
    highScoresList.innerHTML = highScores.map(score => `<li class="list-group-item">${score.name}: ${score.score}</li>`).join('');
  }

  // Show high scores modal
  function showHighScoresModal() {
    updateHighScoresList();
    highScoresModal.show();
  }

  // Event listener for the high scores button
  if (showHighScoresButton) {
    showHighScoresButton.addEventListener('click', showHighScoresModal);
  }

  // Handle high score form submission
  highScoreForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const playerName = playerNameInput.value.trim();
    if (playerName) {
      submitHighScore(playerName, score);
      highScoresModal.hide();
    }
  });

  function submitHighScore(name, score) {
    if (score === 0) {
      showMessage("You cannot submit a score of zero!");
      return;
    }
  
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ name, score });
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(10); // Keep only top 10 scores
    localStorage.setItem('highScores', JSON.stringify(highScores));
    console.log("High score submitted!");
    showMessage("High score submitted!");
    updateHighScoresList();
    resetGame(); // Restart the game after submitting the high score
  }

  // Function to handle game over
  function handleGameOver() {
    showHighScoresModal();
    highScoresModalElement.addEventListener('hidden.bs.modal', () => {
      resetGame(); // Restart the game after the high scores modal is closed
    });
  }

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

        // Add power-up bricks
        if (Math.random() < 0.1) { // 10% chance to be a power-up brick
          brick.classList.add("power-up-brick");
          
        }

        bricksContainer.appendChild(brick);
      }
    }
  }

  // Function to create bricks for round 2
  function createBricksRound2() {
    bricksContainer.innerHTML = ""; // Clear existing bricks
    for (let i = 0; i < 48; i++) { // Increase the number of bricks
      const brick = document.createElement("div");
      brick.classList.add("brick");
      brick.style.width = `${brickWidth}px`;
      brick.style.height = `${brickHeight}px`;

      if (i < 8) brick.classList.add("red-brick");
      else if (i < 16) brick.classList.add("blue-brick");
      else if (i < 32) brick.classList.add("green-brick");
      else brick.classList.add("yellow-brick");

      if (Math.random() < 0.1) { // 10% chance to be a power-up brick
        brick.classList.add("power-up-brick");
        
      }

      bricksContainer.appendChild(brick);
    }
  }

  // Function to create bricks for round 3
  function createBricksRound3() {
    bricksContainer.innerHTML = ""; // Clear existing bricks
    for (let i = 0; i < 80; i++) { // Increase the number of bricks
      const brick = document.createElement("div");
      brick.classList.add("brick");
      brick.style.width = `${brickWidth}px`;
      brick.style.height = `${brickHeight}px`;

      if (i < 16) brick.classList.add("red-brick");
      else if (i < 32) brick.classList.add("blue-brick");
      else if (i < 64) brick.classList.add("green-brick");
      else brick.classList.add("yellow-brick");

      if (Math.random() < 0.1) { // 10% chance to be a power-up brick
        brick.classList.add("power-up-brick");
        
      }

      bricksContainer.appendChild(brick);
    }
  }

  // Function to check if there are no bricks left
  function checkBricks() {
    const bricks = document.querySelectorAll(".brick:not(.hit)");
    return bricks.length === 0;
  }

  // Function to handle power-up effects
  function handlePowerUp() {
    const powerUps = ["increasePaddleSize", "increaseBallSize", "increaseBallSpeed"];
    const selectedPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];

    switch (selectedPowerUp) {
      case "increasePaddleSize":
        increasePaddleSize();
        break;
      case "increaseBallSize":
        increaseBallSize();
        break;
      case "increaseBallSpeed":
        increaseBallSpeed();
        break;
      default:
        break;
    }
  }

  // Function to reset power-up effects
  function resetPowerUps() {
    // Reset paddle size
    paddle.style.width = "100px"; // Default paddle width
    // Reset ball size
    ball.style.width = "10px"; // Default ball width
    ball.style.height = "10px"; // Default ball height
    // Reset ball speed
    ballSpeed = { x: 0, y: 0 }; // Default ball speed
  }

  function showPowerUpMessage(message) {
    
    powerUpMessage.textContent = message;
    powerUpMessage.style.display = 'block';
  }

  function hidePowerUpMessage() {
    
    powerUpMessage.style.display = 'none';
  }

  // Power-up: Increase paddle size
  function increasePaddleSize() {
    const originalPaddleWidth = paddle.offsetWidth;
    paddle.style.width = `${originalPaddleWidth + 20}px`;

    showPowerUpMessage("Paddle Size Increased!");

    // Clear existing timer if any
    if (paddleSizeTimer) {
      clearTimeout(paddleSizeTimer);
    }

    // Set a timer to revert the power-up effect after 10 seconds
    paddleSizeTimer = setTimeout(() => {
      paddle.style.width = `${originalPaddleWidth}px`;
      hidePowerUpMessage();
    }, 10000); // 10 seconds
  }

  // Power-up: Increase ball size
  function increaseBallSize() {
    const originalBallSize = ball.offsetWidth;
    ball.style.width = `${originalBallSize + 10}px`;
    ball.style.height = `${originalBallSize + 10}px`;

    showPowerUpMessage("Ball Size Increased!");

    // Clear existing timer if any
    if (ballSizeTimer) {
      clearTimeout(ballSizeTimer);
    }

    // Set a timer to revert the power-up effect after 10 seconds
    ballSizeTimer = setTimeout(() => {
      ball.style.width = `${originalBallSize}px`;
      ball.style.height = `${originalBallSize}px`;
      hidePowerUpMessage();
    }, 10000); // 10 seconds
  }

  // Power-up: Increase ball speed
  function increaseBallSpeed() {
    const originalBallSpeed = { ...ballSpeed };
    ballSpeed.x *= 1.1;
    ballSpeed.y *= 1.1;

    showPowerUpMessage("Ball Speed Increased!");

    // Clear existing timer if any
    if (ballSpeedTimer) {
      clearTimeout(ballSpeedTimer);
    }

    // Set a timer to revert the power-up effect after 10 seconds
    ballSpeedTimer = setTimeout(() => {
      ballSpeed.x = originalBallSpeed.x;
      ballSpeed.y = originalBallSpeed.y;
      hidePowerUpMessage();
    }, 10000); // 10 seconds
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

    // Reset power-up effects
    resetPowerUps();

    // Debugging output
    console.log("Ball Position:", ballPosition);
    console.log("Paddle Position:", paddlePosition);
  }

  // Function to set initial ball direction
  function setInitialBallDirection() {
    const angle = (Math.random() * 60 + 60) * (Math.PI / 180); // Angle between 60-120 degrees
    const initialSpeed = 6; // Increase the initial speed
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
    resetPowerUps();
    startButton.disabled = false; // Re-enable the start button
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

  // Function to play sound with reset
  function playSound(sound) {
    sound.currentTime = 0; // Reset audio playback position
    sound.play(); // Play sound
  }

  // Ball movement and collision detection
  function moveBall() {
    ballPosition.x += ballSpeed.x;
    ballPosition.y += ballSpeed.y;

    const gameBounds = gameViewport.getBoundingClientRect();
    const ballDiameter = ball.offsetWidth;

    // Wall collision
    if (ballPosition.x <= 0 || ballPosition.x >= gameBounds.width - ballDiameter) {
      ballSpeed.x *= -1;
      playSound(beepA); // Play sound for wall collision
    }
    if (ballPosition.y <= 0) {
      ballSpeed.y *= -1;
      playSound(beepA); // Play sound for wall collision
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

      playSound(beepB); // Play sound for paddle collision
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
         
          playSound(beepA); // Play sound for brick collision

          if (brick.classList.contains("power-up-brick")) {
            handlePowerUp();
            playSound(powerUp); // Play sound for power-up brick


          }// Apply power-up effect

          isCooldown = true;
          setTimeout(() => {
            isCooldown = false;
          }, 100); // 100 millisecond cooldown
          break; // Exit the loop after hitting one brick
        }
      }
    }

    // Check if there are no bricks left
    if (checkBricks()) {
      playSound(complete); // Play sound for completing a round
      alert("Round Cleared!");
      
      currentRound++;
      if (currentRound === 2) {
        resetBallAndPaddle();
        isGameRunning = false; // Ensure game is not running after clearing a round
        createBricksRound2();
      } else if (currentRound === 3) {
        resetBallAndPaddle();
        isGameRunning = false; // Ensure game is not running after clearing a round
        createBricksRound3();
      } else {
        playSound(completeGame); // Play sound for completing the game
        alert("You have completed all rounds!");
        isGameRunning = false;
        
        handleGameOver(); // Show high scores modal and reset the game after it is closed
      }
    }

    // Lose condition (ball hits bottom of viewport)
    if (ballPosition.y >= gameBounds.height - ballDiameter) { // Ball hits bottom of the viewport
      lives--;
      livesDisplay.textContent = `Lives: ${lives}`;
      playSound(fail); // Play sound for losing a life
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
        handleGameOver();
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

  // Function to show a message
  function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.position = 'absolute';
    messageElement.style.top = '50%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    messageElement.style.color = 'white';
    messageElement.style.padding = '20px';
    messageElement.style.borderRadius = '10px';
    messageElement.style.zIndex = '1000';
    document.body.appendChild(messageElement);

    setTimeout(() => {
      document.body.removeChild(messageElement);
    }, 3000); // Display the message for 3 seconds
  }

  // Initialize game
  resetGame();
});