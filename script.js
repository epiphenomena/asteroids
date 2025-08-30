// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

// Game state
let ship;
let asteroids = [];
let bullets = [];
let score = 0;
let gameOver = false;

// Set canvas dimensions to match window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize game
function init() {
    resizeCanvas();
    resetGame();
    gameLoop();
}

// Reset game state
function resetGame() {
    // Create player ship
    ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        angle: 0, // In radians
        velocity: { x: 0, y: 0 },
        rotationSpeed: 0.05,
        acceleration: 0.5,
        maxSpeed: 5,
        friction: 0.98
    };
    
    // Reset game state
    asteroids = [];
    bullets = [];
    score = 0;
    gameOver = false;
    gameOverScreen.classList.add('hidden');
}

// Main game loop
function gameLoop() {
    if (!gameOver) {
        update();
    }
    render();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Update ship position
    updateShip();
    
    // Update bullets
    updateBullets();
    
    // Update asteroids
    updateAsteroids();
}

// Update ship position and handle wrapping
function updateShip() {
    // Apply friction
    ship.velocity.x *= ship.friction;
    ship.velocity.y *= ship.friction;
    
    // Update position
    ship.x += ship.velocity.x;
    ship.y += ship.velocity.y;
    
    // Screen wrapping
    wrapAroundScreen(ship);
}

// Update bullet positions and remove off-screen bullets
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        // Update position
        bullet.x += bullet.velocity.x;
        bullet.y += bullet.velocity.y;
        
        // Remove bullets that go off-screen or exceed lifetime
        if (isOffScreen(bullet) || ++bullet.age > bullet.maxAge) {
            bullets.splice(i, 1);
        }
    }
}

// Update asteroid positions
function updateAsteroids() {
    for (const asteroid of asteroids) {
        // Update position
        asteroid.x += asteroid.velocity.x;
        asteroid.y += asteroid.velocity.y;
        
        // Screen wrapping
        wrapAroundScreen(asteroid);
    }
}

// Check if an object is off-screen
function isOffScreen(obj) {
    return obj.x < 0 || obj.x > canvas.width || obj.y < 0 || obj.y > canvas.height;
}

// Handle screen wrapping for objects
function wrapAroundScreen(obj) {
    if (obj.x < 0) obj.x = canvas.width;
    if (obj.x > canvas.width) obj.x = 0;
    if (obj.y < 0) obj.y = canvas.height;
    if (obj.y > canvas.height) obj.y = 0;
}

// Render everything
function render() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ship
    drawShip();
    
    // Draw bullets
    drawBullets();
    
    // Draw asteroids
    drawAsteroids();
    
    // Draw score
    drawScore();
}

// Draw the player ship
function drawShip() {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    
    // Draw ship as a triangle
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 0); // Nose of the ship
    ctx.lineTo(-10, -7); // Rear left
    ctx.lineTo(-10, 7); // Rear right
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
}

// Draw all bullets
function drawBullets() {
    ctx.fillStyle = 'white';
    for (const bullet of bullets) {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw all asteroids
function drawAsteroids() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    for (const asteroid of asteroids) {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Draw the current score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Start the game when page loads
window.onload = init;