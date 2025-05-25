// ==============================
// 🎮 Snake Game Logic
// ==============================

// ===== Canvas Setup =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== Game State Variables =====
let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
];

let dx = 10;
let dy = 0;
let score = 0;
let food = generateFood(); // Initial food

// ==============================
// 🐍 Draw Functions
// ==============================

// Draw individual snake part
const drawSnakePart = (part) => {
  ctx.fillStyle = "var(--snake-color)";
  ctx.strokeStyle = "darkgreen";
  ctx.fillRect(part.x, part.y, 10, 10);
  ctx.strokeRect(part.x, part.y, 10, 10);
};

// Draw the entire snake
const drawSnake = () => {
  snake.forEach(drawSnakePart);
};

// Draw food
const drawFood = () => {
  ctx.fillStyle = "var(--food-color)";
  ctx.strokeStyle = "darkred";
  ctx.fillRect(food.x, food.y, 10, 10);
  ctx.strokeRect(food.x, food.y, 10, 10);
};

// Clear canvas before redrawing
const clearCanvas = () => {
  ctx.fillStyle = "var(--canvas-background)"; // FIX: corrected variable name
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// ==============================
// 🐾 Snake Movement
// ==============================

const advanceSnake = () => {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById("scoreDisplay").innerText = `Score: ${score}`;
    food = generateFood();
  } else {
    snake.pop();
  }
};

// ==============================
// 🎮 Controls
// ==============================

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

document.addEventListener("keydown", changeDirection);

// ==============================
// 🍎 Food Generator
// ==============================

const randomTen = (min, max) => {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
};

const generateFood = () => {
  let newFood;
  while (true) {
    newFood = {
      x: randomTen(0, canvas.width - 10),
      y: randomTen(0, canvas.height - 10),
    };
    // Make sure food doesn't spawn on the snake
    const isOnSnake = snake.some(
      (part) => part.x === newFood.x && part.y === newFood.y
    );
    if (!isOnSnake) break;
  }
  return newFood;
};

// ==============================
// 💀 Game Over Logic
// ==============================

const didGameEnd = () => {
  // Check self-collision
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  // Check wall collision
  const hitLeft = snake[0].x < 0;
  const hitRight = snake[0].x >= canvas.width;
  const hitTop = snake[0].y < 0;
  const hitBottom = snake[0].y >= canvas.height;

  return hitLeft || hitRight || hitTop || hitBottom;
};

// ==============================
// 🕹️ Main Game Loop
// ==============================

const gameLoop = () => {
  if (didGameEnd()) {
    alert(`Game Over! Your score was: ${score}`);
    document.location.reload();
    return;
  }

  setTimeout(() => {
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    gameLoop();
  }, 100);
};

// ==============================
// 🚀 Start Game
// ==============================
gameLoop();
