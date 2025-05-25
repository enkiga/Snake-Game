// Get elements from the DOM by ID
// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Give canvas border

// Represent the snake as an array of objects
let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
];

// Function to draw the snake
const drawSnakePart = (snakePart) => {
  ctx.fillStyle = "var(--snake-color)";
  ctx.strokeStyle = "darkgreen";
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
};

const drawSnake = () => {
  snake.forEach(drawSnakePart);
};

// Function to update snake movement
const advanceSnake = () => {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  snake.pop();
};

// Refactoring code to handle key presses
const clearCanvas = () => {
  ctx.fillStyle = "var(--canvas-color)";
  ctx.strokeStyle = "var(--canvas-border-color)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// Make snake move automatically
const gameLoop = () => {
  clearCanvas();
  drawSnake();
  advanceSnake();
};

// Add delay for the game loop
const main = () => {
  setTimeout(() => {
    gameLoop();
    main();
  }, 100);
};

const changeDirection = (event) => {
  const LEFT_KEY = 37;
  const UP_KEY = 38;
  const RIGHT_KEY = 39;
  const DOWN_KEY = 40;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
};

// Connect the keydown event to the changeDirection function
document.addEventListener("keydown", changeDirection);

// Initialize the direction of the snake
let dx = 10;
let dy = 0;

// Set the canvas size
canvas.width = 400;
canvas.height = 400;
// Set the canvas border
canvas.style.border = "2px solid var(--canvas-border-color)";
// Start the game loop
main();
