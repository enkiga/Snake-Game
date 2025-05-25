const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
let food;
let gameRunning = false;
let gamePaused = false;
let gameOver = false;
let gameLoopId = null;

const startBtn = document.getElementById("startBtn");

// ====== Food Logic ======
const randomTen = (min, max) =>
  Math.round((Math.random() * (max - min) + min) / 10) * 10;

const generateFood = () => {
  let newFood;
  while (true) {
    newFood = {
      x: randomTen(0, canvas.width - 10),
      y: randomTen(0, canvas.height - 10),
    };
    const isOnSnake = snake.some(
      (part) => part.x === newFood.x && part.y === newFood.y
    );
    if (!isOnSnake) break;
  }
  return newFood;
};

food = generateFood();

// ====== Drawing ======
const drawSnakePart = (part) => {
  ctx.fillStyle = "var(--snake-color)";
  ctx.strokeStyle = "darkgreen";
  ctx.fillRect(part.x, part.y, 10, 10);
  ctx.strokeRect(part.x, part.y, 10, 10);
};

const drawSnake = () => snake.forEach(drawSnakePart);

const drawFood = () => {
  ctx.fillStyle = "var(--food-color)";
  ctx.strokeStyle = "darkred";
  ctx.fillRect(food.x, food.y, 10, 10);
  ctx.strokeRect(food.x, food.y, 10, 10);
};

const drawGameOver = () => {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
};

const clearCanvas = () => {
  ctx.fillStyle = "var(--canvas-background)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// ====== Movement ======
const advanceSnake = () => {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById("scoreDisplay").innerText = `Score: ${score}`;
    document.getElementById("eatSound").play();
    food = generateFood();
  } else {
    snake.pop();
  }
};

const didGameEnd = () => {
  const [head] = snake;
  const hitWall =
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height;
  const hitSelf = snake
    .slice(4)
    .some((part) => part.x === head.x && part.y === head.y);
  return hitWall || hitSelf;
};

// ====== Game Loop ======
const gameLoop = () => {
  if (!gameRunning || gamePaused) return;

  if (didGameEnd()) {
    gameOver = true;
    gameRunning = false;
    document.getElementById("gameOverSound").play();
    clearCanvas();
    drawSnake();
    drawFood();
    drawGameOver();
    startBtn.innerText = "Restart";
    return;
  }

  clearCanvas();
  drawFood();
  advanceSnake();
  drawSnake();

  gameLoopId = setTimeout(gameLoop, 100);
};

// ====== Controls ======
const setDirection = (direction) => {
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (direction === "left" && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (direction === "up" && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (direction === "right" && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (direction === "down" && !goingUp) {
    dx = 0;
    dy = 10;
  }
};

const changeDirection = (e) => {
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
  ) {
    e.preventDefault();
  }
  if (e.key === " ") {
    gamePaused = !gamePaused;
    if (!gamePaused) gameLoop();
    return;
  }
  setDirection(e.key.replace("Arrow", "").toLowerCase());
};

document.addEventListener("keydown", changeDirection);

// ====== Touch Controls ======
let startX, startY;

canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

canvas.addEventListener("touchmove", (e) => {
  if (!startX || !startY) return;
  const touch = e.touches[0];
  const diffX = touch.clientX - startX;
  const diffY = touch.clientY - startY;
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) setDirection("right");
    else setDirection("left");
  } else {
    if (diffY > 0) setDirection("down");
    else setDirection("up");
  }
  startX = startY = null;
});

// ====== Start/Pause/Restart Button ======
startBtn.addEventListener("click", () => {
  if (!gameRunning) {
    if (gameOver) location.reload();
    gameRunning = true;
    gamePaused = false;
    startBtn.innerText = "Pause";
    gameLoop();
  } else {
    gamePaused = !gamePaused;
    startBtn.innerText = gamePaused ? "Resume" : "Pause";
    if (!gamePaused) gameLoop();
  }
});

// ====== Help Modal ======
document.getElementById("helpBtn").addEventListener("click", () => {
  document.getElementById("helpModal").classList.add("visible");
});

function closeHelp() {
  document.getElementById("helpModal").classList.remove("visible");
}
