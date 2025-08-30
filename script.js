// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

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
    // Will implement in next step
}

// Main game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Will implement in next steps
}

// Render everything
function render() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Will add drawing code in next steps
}

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Start the game when page loads
window.onload = init;