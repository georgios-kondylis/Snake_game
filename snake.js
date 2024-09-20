// Get references to DOM elements
const gameBoard = document.querySelector("#gameBoard");
const context = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetButton = document.querySelector("#resetButton");
const moveLeft = document.querySelector("#left");
const moveRight = document.querySelector("#right");
const moveUp = document.querySelector("#up");
const moveDown = document.querySelector("#down");

// Game configuration and constants
let unitSize = 25;
let gameWidth, gameHeight;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";

// Game state variables
let xVelocity = unitSize;
let yVelocity = 0;
let foodCoordsX;
let foodCoordsY;
let gameRunning = false;
let score = 0;
let speed = 100; // Initial speed in milliseconds
let snake = [];

// Set canvas size and adjust game dimensions
function setCanvasSize() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9; // 90% of smallest dimension
    gameBoard.width = size;
    gameBoard.height = size;

    gameWidth = gameBoard.width;
    gameHeight = gameBoard.height;
}

// Call it once and also attach it to the resize event
setCanvasSize();
window.addEventListener("resize", setCanvasSize);

// Start the game
resetGame();

// Event listeners for keyboard input and reset button
window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame);

// Touch control buttons for mobile
moveLeft.addEventListener("click", () => changeDirection({ keyCode: 37 }));
moveRight.addEventListener("click", () => changeDirection({ keyCode: 39 }));
moveUp.addEventListener("click", () => changeDirection({ keyCode: 38 }));
moveDown.addEventListener("click", () => changeDirection({ keyCode: 40 }));

function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    speed = 100;
    snake = [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];
    scoreText.textContent = `Score : ${score}`;
    createFood();
    gameRunning = true;
    nextFrame();
}

function nextFrame() {
    if (gameRunning) {
        setTimeout(() => {
            clearBoard();
            drawFoodCircle();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextFrame();
        }, speed);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    context.fillStyle = boardBackground;
    context.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        return Math.floor(Math.random() * (max - min) / unitSize) * unitSize + min;
    }
    foodCoordsX = randomFood(0, gameWidth - unitSize);
    foodCoordsY = randomFood(0, gameHeight - unitSize);
}

function drawFoodCircle() {
    context.fillStyle = foodColor;
    context.strokeStyle = "black";
    context.beginPath();
    const centerX = foodCoordsX + unitSize / 2;
    const centerY = foodCoordsY + unitSize / 2;
    const radius = unitSize / 2;
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
}

function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);

    if (snake[0].x === foodCoordsX && snake[0].y === foodCoordsY) {
        score += 1;
        scoreText.textContent = `Score : ${score}`;
        createFood();
        if (score % 5 === 0) {
            speed *= 0.9; // Increase speed every 5 points
        }
    } else {
        snake.pop();
    }
}

function drawSnake() {
    context.fillStyle = snakeColor;
    context.strokeStyle = snakeBorder;
    snake.forEach(part => {
        context.fillRect(part.x, part.y, unitSize, unitSize);
        context.strokeRect(part.x, part.y, unitSize, unitSize);
    });
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;

    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);
    const goingRight = (xVelocity === unitSize);

    switch (true) {
        case (keyPressed === LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case (keyPressed === DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    if (snake[0].x < 0 || snake[0].x >= gameWidth - 2 || snake[0].y < 0 || snake[0].y >= gameHeight -2) {
        gameRunning = false; // Game over if snake hits wall
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            gameRunning = false; // Game over if snake hits itself
        }
    }
}

function displayGameOver() {
    context.font = "80px gamingFont";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText("Game Over", gameWidth / 2, gameHeight / 2);
    gameRunning = false;
}
