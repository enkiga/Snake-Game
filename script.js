const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state variables
let snake = [];
let dx = 10;
let dy = 0;
let score = 0;
let food = {};
let bonusFood = null;
let gameRunning = false;
let gamePaused = false;
let gameOver = false;
let gameLoopId = null;
let difficulty = 'medium';
let gameSpeed = 100; // Default speed for medium

// DOM Elements
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const difficultySelector = document.getElementById("difficulty-selector");
const scoreDisplay = document.getElementById("scoreDisplay");
const difficultyDisplay = document.getElementById("difficultyDisplay");
const finalScoreDisplay = document.getElementById("finalScore");
const gameOverModal = document.getElementById("game-over-modal");

// Sound Effects
const eatSound = document.getElementById("eatSound");
const bonusSound = document.getElementById("bonusSound");
const gameOverSound = document.getElementById("gameOverSound");

const difficultySettings = {
    easy: { speed: 150, label: 'Easy' },
    medium: { speed: 100, label: 'Medium' },
    hard: { speed: 80, label: 'Hard' }
};

const setDifficulty = (level) => {
    difficulty = level;
    gameSpeed = difficultySettings[level].speed;
    difficultyDisplay.innerText = `Difficulty: ${difficultySettings[level].label}`;
    document.querySelectorAll('#difficulty-selector button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.difficulty === level) {
            btn.classList.add('active');
        }
    });
};

const resetGame = () => {
    snake = [
        { x: 150, y: 150 }, { x: 140, y: 150 }, { x: 130, y: 150 },
        { x: 120, y: 150 }, { x: 110, y: 150 },
    ];
    dx = 10;
    dy = 0;
    score = 0;
    scoreDisplay.innerText = `Score: ${score}`;
    gameOver = false;
    gameRunning = false;
    gamePaused = false;
    bonusFood = null;
    clearTimeout(gameLoopId);
    generateFood();
    draw();
};

const randomTen = (min, max) => Math.round((Math.random() * (max - min) + min) / 10) * 10;

const generateFood = () => {
    let newFood;
    while (true) {
        newFood = {
            x: randomTen(0, canvas.width - 10),
            y: randomTen(0, canvas.height - 10),
        };
        const isOnSnake = snake.some(part => part.x === newFood.x && part.y === newFood.y);
        if (!isOnSnake) break;
    }
    food = newFood;
};

const generateBonusFood = () => {
    if (Math.random() < 0.2) {
        bonusFood = {
            x: randomTen(0, canvas.width - 10),
            y: randomTen(0, canvas.height - 10),
            disappearTime: Date.now() + 5000
        };
    }
};

// ====== Drawing (UPDATED) ======
const drawSnakePart = (part) => {
    // Using the new high-contrast colors
    ctx.fillStyle = '#00d9ff'; // --snake-color
    ctx.strokeStyle = '#008fad'; // --snake-border-color
    ctx.fillRect(part.x, part.y, 10, 10);
    ctx.strokeRect(part.x, part.y, 10, 10);
};

const drawFood = () => {
    ctx.fillStyle = "#ff4136"; // --food-color
    ctx.strokeStyle = "darkred";
    ctx.fillRect(food.x, food.y, 10, 10);
    ctx.strokeRect(food.x, food.y, 10, 10);
};

const drawBonusFood = () => {
    if (bonusFood) {
        ctx.fillStyle = "#ffd700"; // --bonus-food-color
        ctx.strokeStyle = "goldenrod";
        ctx.fillRect(bonusFood.x, bonusFood.y, 10, 10);
        ctx.strokeRect(bonusFood.x, bonusFood.y, 10, 10);
    }
};

const clearCanvas = () => {
    ctx.fillStyle = "#111"; // --canvas-background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const draw = () => {
    clearCanvas();
    drawFood();
    drawBonusFood();
    snake.forEach(drawSnakePart);
};

// ====== Movement & Game Logic ======
const advanceSnake = () => {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        eatSound.play();
        generateFood();
        generateBonusFood();
    } else if (bonusFood && head.x === bonusFood.x && head.y === bonusFood.y) {
        score += 50;
        bonusSound.play();
        bonusFood = null;
    }
    else {
        snake.pop();
    }
    scoreDisplay.innerText = `Score: ${score}`;
};

const didGameEnd = () => {
    const head = snake[0];
    const hitWall = head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
    const hitSelf = snake.slice(1).some(part => part.x === head.x && part.y === head.y);
    return hitWall || hitSelf;
};

const onGameOver = () => {
    gameOver = true;
    gameRunning = false;
    gameOverSound.play();
    finalScoreDisplay.innerText = score;
    gameOverModal.style.display = 'flex';
    startBtn.innerText = "Start Game";
    startBtn.disabled = false;
    difficultySelector.style.display = 'flex';
};

const gameLoop = () => {
    if (!gameRunning || gamePaused) return;

    if (didGameEnd()) {
        onGameOver();
        return;
    }
    
    if(bonusFood && Date.now() > bonusFood.disappearTime) {
        bonusFood = null;
    }

    advanceSnake();
    draw();

    gameLoopId = setTimeout(gameLoop, gameSpeed);
};

// ====== Controls ======
const setDirection = (direction) => {
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (direction === "left" && !goingRight) { dx = -10; dy = 0; }
    if (direction === "up" && !goingDown) { dx = 0; dy = -10; }
    if (direction === "right" && !goingLeft) { dx = 10; dy = 0; }
    if (direction === "down" && !goingUp) { dx = 0; dy = 10; }
};

const handleKeyPress = (e) => {
    if (e.key === " ") {
        e.preventDefault();
        togglePause();
        return;
    }
    const direction = e.key.replace("Arrow", "").toLowerCase();
    if (["up", "down", "left", "right"].includes(direction)) {
        e.preventDefault();
        setDirection(direction);
    }
};

const togglePause = () => {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    startBtn.innerText = gamePaused ? "Resume" : "Pause";
    if (!gamePaused) gameLoop();
};

document.addEventListener("keydown", handleKeyPress);

// ====== Event Listeners ======
startBtn.addEventListener("click", () => {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        startBtn.innerText = "Pause";
        startBtn.disabled = true;
        difficultySelector.style.display = 'none';
        gameLoop();
    } else {
        togglePause();
    }
    setTimeout(() => { startBtn.disabled = false; }, 200);
});

restartBtn.addEventListener("click", () => {
    gameOverModal.style.display = 'none';
    resetGame();
    startBtn.innerText = "Start Game";
    difficultySelector.style.display = 'flex';
});

difficultySelector.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        setDifficulty(e.target.dataset.difficulty);
    }
});

// Initialize game on load
window.onload = () => {
    setDifficulty('medium');
    resetGame();
};