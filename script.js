// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const finalHighScoreElement = document.getElementById('finalHighScore');
const restartButton = document.getElementById('restartButton');
const scoreValue = document.getElementById('scoreValue');
const livesValue = document.getElementById('livesValue');
const highScoreValue = document.getElementById('highScoreValue');

// Game state
let ship;
let asteroids = [];
let bullets = [];
let particles = [];
let score = 0;
let lives = 3;
let highScore = 0;
let gameOver = false;
let gameStarted = false;

// Input state
let thrust = false;
let mouseX = 0;
let mouseY = 0;

// Set canvas dimensions to match window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize game
function init() {
    resizeCanvas();
    setupEventListeners();
    loadHighScore();
    gameLoop();
}

// Load high score from localStorage
function loadHighScore() {
    const savedHighScore = localStorage.getItem('asteroidsHighScore');
    if (savedHighScore) {
        highScore = parseInt(savedHighScore);
        if (highScoreValue) highScoreValue.textContent = highScore;
    }
}

// Save high score to localStorage
function saveHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('asteroidsHighScore', highScore.toString());
        if (highScoreValue) highScoreValue.textContent = highScore;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Start button
    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameStarted = true;
        resetGame();
    });
    
    // Restart button
    restartButton.addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        resetGame();
    });
    
    // Mouse/Touch controls
    canvas.addEventListener('mousedown', (e) => {
        thrust = true;
    });
    
    canvas.addEventListener('mouseup', () => {
        thrust = false;
    });
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        thrust = true;
    });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        thrust = false;
    });
    
    // Mouse/Touch movement for ship rotation
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
    });
    
    // Prevent default touch behaviors
    document.addEventListener('touchstart', (e) => {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
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
        friction: 0.98,
        shootCooldown: 0,
        maxShootCooldown: 10
    };
    
    // Reset game state
    asteroids = [];
    bullets = [];
    particles = [];
    score = 0;
    lives = 3;
    gameOver = false;
    
    // Update UI
    if (scoreValue) scoreValue.textContent = score;
    if (livesValue) livesValue.textContent = lives;
    
    // Create initial asteroids
    createAsteroids(5);
}

// Create a specified number of asteroids
function createAsteroids(count) {
    for (let i = 0; i < count; i++) {
        createAsteroid();
    }
}

// Create a single asteroid
function createAsteroid(size = 3, x = null, y = null) {
    // If position not specified, create at random edge relative to ship position
    if (x === null || y === null) {
        const side = Math.floor(Math.random() * 4);
        const buffer = 100; // Distance from screen edge
        
        switch (side) {
            case 0: // Top
                x = ship.x + (Math.random() * canvas.width - canvas.width / 2);
                y = ship.y - canvas.height / 2 - buffer;
                break;
            case 1: // Right
                x = ship.x + canvas.width / 2 + buffer;
                y = ship.y + (Math.random() * canvas.height - canvas.height / 2);
                break;
            case 2: // Bottom
                x = ship.x + (Math.random() * canvas.width - canvas.width / 2);
                y = ship.y + canvas.height / 2 + buffer;
                break;
            case 3: // Left
                x = ship.x - canvas.width / 2 - buffer;
                y = ship.y + (Math.random() * canvas.height - canvas.height / 2);
                break;
        }
    }
    
    // Random velocity
    const speed = Math.random() * 2 + 1;
    const angle = Math.random() * Math.PI * 2;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;
    
    // Radius based on size (3 = large, 2 = medium, 1 = small)
    const radius = size * 10;
    
    asteroids.push({
        x: x,
        y: y,
        radius: radius,
        velocity: { x: velocityX, y: velocityY },
        size: size
    });
}

// Main game loop
function gameLoop() {
    if (gameStarted && !gameOver) {
        update();
    }
    render();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Handle controls
    handleControls();
    
    // Update ship position
    updateShip();
    
    // Update bullets
    updateBullets();
    
    // Update asteroids
    updateAsteroids();
    
    // Update particles
    updateParticles();
    
    // Check collisions
    checkCollisions();
}

// Handle player input
function handleControls() {
    // Rotate ship toward mouse/touch position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    ship.angle = Math.atan2(dy, dx);
    
    // Thrust
    if (thrust) {
        // Calculate thrust vector
        const thrustX = Math.cos(ship.angle) * ship.acceleration;
        const thrustY = Math.sin(ship.angle) * ship.acceleration;
        
        // Apply thrust
        ship.velocity.x += thrustX;
        ship.velocity.y += thrustY;
        
        // Limit maximum speed
        const speed = Math.sqrt(ship.velocity.x * ship.velocity.x + ship.velocity.y * ship.velocity.y);
        if (speed > ship.maxSpeed) {
            ship.velocity.x = (ship.velocity.x / speed) * ship.maxSpeed;
            ship.velocity.y = (ship.velocity.y / speed) * ship.maxSpeed;
        }
        
        // Create thrust particles
        createThrustParticles();
    }
    
    // Automatically shoot at a fixed rate
    if (ship.shootCooldown <= 0) {
        fireBullet();
        ship.shootCooldown = ship.maxShootCooldown;
    }
    
    // Update shoot cooldown
    if (ship.shootCooldown > 0) {
        ship.shootCooldown--;
    }
}

// Create thrust particles
function createThrustParticles() {
    // Create particles at the rear of the ship
    const offsetX = Math.cos(ship.angle + Math.PI) * 10;
    const offsetY = Math.sin(ship.angle + Math.PI) * 10;
    
    for (let i = 0; i < 3; i++) {
        particles.push({
            x: ship.x + offsetX + (Math.random() - 0.5) * 5,
            y: ship.y + offsetY + (Math.random() - 0.5) * 5,
            radius: Math.random() * 2 + 1,
            velocity: {
                x: (Math.random() - 0.5) * 2 + ship.velocity.x,
                y: (Math.random() - 0.5) * 2 + ship.velocity.y
            },
            life: 20,
            maxLife: 20
        });
    }
}

// Fire a bullet from the ship
function fireBullet() {
    // Calculate bullet starting position (at the nose of the ship)
    const startX = ship.x + Math.cos(ship.angle) * 15;
    const startY = ship.y + Math.sin(ship.angle) * 15;
    
    // Calculate bullet velocity (same direction as ship is facing plus ship's velocity)
    const velocityX = Math.cos(ship.angle) * 7 + ship.velocity.x;
    const velocityY = Math.sin(ship.angle) * 7 + ship.velocity.y;
    
    // Create bullet
    bullets.push({
        x: startX,
        y: startY,
        radius: 2,
        velocity: { x: velocityX, y: velocityY },
        age: 0,
        maxAge: 60 // Bullets disappear after 60 frames
    });
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
        // Check if bullet is too far from ship
        const dx = bullet.x - ship.x;
        const dy = bullet.y - ship.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > Math.max(canvas.width, canvas.height) || ++bullet.age > bullet.maxAge) {
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
        
        // Screen wrapping relative to ship position
        const buffer = 100; // Distance from screen edge
        const leftEdge = ship.x - canvas.width / 2 - buffer;
        const rightEdge = ship.x + canvas.width / 2 + buffer;
        const topEdge = ship.y - canvas.height / 2 - buffer;
        const bottomEdge = ship.y + canvas.height / 2 + buffer;
        
        if (asteroid.x < leftEdge) asteroid.x = rightEdge;
        if (asteroid.x > rightEdge) asteroid.x = leftEdge;
        if (asteroid.y < topEdge) asteroid.y = bottomEdge;
        if (asteroid.y > bottomEdge) asteroid.y = topEdge;
    }
}

// Update particle positions and remove dead particles
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update position
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        
        // Update life
        particle.life--;
        
        // Remove dead particles
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Check for collisions between bullets and asteroids, and ship and asteroids
function checkCollisions() {
    // Bullet-asteroid collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = asteroids.length - 1; j >= 0; j--) {
            const asteroid = asteroids[j];
            
            // Check collision
            if (distance(bullet.x, bullet.y, asteroid.x, asteroid.y) < bullet.radius + asteroid.radius) {
                // Remove bullet
                bullets.splice(i, 1);
                
                // Create explosion particles
                createExplosion(asteroid.x, asteroid.y);
                
                // Split asteroid or remove it
                splitAsteroid(j);
                
                // Increase score
                score += 10 * asteroid.size;
                if (scoreValue) scoreValue.textContent = score;
                
                // Break since bullet is destroyed
                break;
            }
        }
    }
    
    // Ship-asteroid collisions
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        
        if (distance(ship.x, ship.y, asteroid.x, asteroid.y) < ship.radius + asteroid.radius) {
            // Create explosion particles at ship position
            createExplosion(ship.x, ship.y);
            
            // Lose a life
            lives--;
            if (livesValue) livesValue.textContent = lives;
            
            // Reset ship position to center and velocity to zero
            ship.x = canvas.width / 2;
            ship.y = canvas.height / 2;
            ship.velocity.x = 0;
            ship.velocity.y = 0;
            
            // Check for game over
            if (lives <= 0) {
                endGame();
            }
            
            break;
        }
    }
}

// Create explosion particles
function createExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: x,
            y: y,
            radius: Math.random() * 3 + 1,
            velocity: {
                x: (Math.random() - 0.5) * 5,
                y: (Math.random() - 0.5) * 5
            },
            life: 30,
            maxLife: 30
        });
    }
}

// Calculate distance between two points
function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// Split an asteroid into smaller ones or remove it
function splitAsteroid(index) {
    const asteroid = asteroids[index];
    
    // Remove the asteroid
    asteroids.splice(index, 1);
    
    // If asteroid is large enough, split it into smaller ones
    if (asteroid.size > 1) {
        // Create two smaller asteroids
        for (let i = 0; i < 2; i++) {
            // Add some variance to the angle
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;
            
            asteroids.push({
                x: asteroid.x,
                y: asteroid.y,
                radius: (asteroid.size - 1) * 10,
                velocity: { x: velocityX, y: velocityY },
                size: asteroid.size - 1
            });
        }
    }
    
    // If all asteroids are destroyed, create a new wave
    if (asteroids.length === 0) {
        createAsteroids(5);
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
    
    if (gameStarted) {
        // Draw particles
        drawParticles();
        
        // Draw bullets
        drawBullets();
        
        // Draw asteroids
        drawAsteroids();
        
        // Draw ship at the center of the screen
        drawShipAtCenter();
    }
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

// Draw all particles
function drawParticles() {
    for (const particle of particles) {
        // Calculate screen position relative to ship
        const screenX = particle.x - ship.x + canvas.width / 2;
        const screenY = particle.y - ship.y + canvas.height / 2;
        
        // Fade out as particle life decreases
        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, particle.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw all bullets
function drawBullets() {
    ctx.fillStyle = 'white';
    for (const bullet of bullets) {
        // Calculate screen position relative to ship
        const screenX = bullet.x - ship.x + canvas.width / 2;
        const screenY = bullet.y - ship.y + canvas.height / 2;
        
        ctx.beginPath();
        ctx.arc(screenX, screenY, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw all asteroids
function drawAsteroids() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    for (const asteroid of asteroids) {
        // Calculate screen position relative to ship
        const screenX = asteroid.x - ship.x + canvas.width / 2;
        const screenY = asteroid.y - ship.y + canvas.height / 2;
        
        ctx.beginPath();
        ctx.arc(screenX, screenY, asteroid.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Draw the player ship at the center of the screen
function drawShipAtCenter() {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
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

// End the game
function endGame() {
    gameOver = true;
    saveHighScore();
    if (finalScoreElement) finalScoreElement.textContent = score;
    if (finalHighScoreElement) finalHighScoreElement.textContent = highScore;
    if (gameOverScreen) gameOverScreen.style.display = 'flex';
    if (controls) controls.style.display = 'none';
}

// Start the game when page loads
window.onload = init;