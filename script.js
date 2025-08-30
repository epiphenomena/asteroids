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
    
    // Initialize mouse position to center of canvas
    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;
}

// Initialize game
function init() {
    resizeCanvas();
    setupEventListeners();
    loadHighScore();
    
    // Ensure game doesn't start automatically
    gameStarted = false;
    gameOver = false;
    
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
    startButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Start button clicked');
        if (startScreen) {
            startScreen.style.display = 'none';
        }
        gameStarted = true;
        console.log('Calling resetGame from start button');
        resetGame();
        console.log('resetGame completed. Lives:', lives);
    });
    
    // Restart button
    restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Restart button clicked');
        if (gameOverScreen) {
            gameOverScreen.classList.remove('show');
            // Also hide explicitly to ensure it's hidden
            gameOverScreen.style.display = 'none';
        }
        gameStarted = true;
        gameOver = false;
        console.log('Calling resetGame from restart button');
        resetGame();
        console.log('resetGame completed. Lives:', lives);
    });
    
    // Prevent touch events on screens from propagating
    startScreen.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    gameOverScreen.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    // Mouse/Touch controls
    canvas.addEventListener('mousedown', (e) => {
        console.log('MouseDown event');
        thrust = true;
    });
    
    canvas.addEventListener('mouseup', () => {
        console.log('MouseUp event');
        thrust = false;
    });
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        console.log('TouchStart event');
        thrust = true;
    });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        console.log('TouchEnd event');
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
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.touches[0].clientX - rect.left;
            mouseY = e.touches[0].clientY - rect.top;
        }
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
    // Initialize mouse position to center of canvas
    if (canvas) {
        mouseX = canvas.width / 2;
        mouseY = canvas.height / 2;
    }
    
    // Create player ship at center
    ship = {
        x: 0,
        y: 0,
        radius: 10,
        angle: 0, // In radians
        velocity: { x: 0, y: 0 },
        rotationSpeed: 0.05,
        acceleration: 0.65, // 30% faster acceleration (0.5 * 1.3 = 0.65)
        maxSpeed: 5,
        friction: 0.98,
        shootCooldown: 0,
        maxShootCooldown: 17, // 15% faster firing rate (20 * 0.85 ≈ 17)
        invincible: false,
        invincibilityTime: 0,
        respawnTime: 0,
        visible: true
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
    if (livesValue) {
        livesValue.textContent = lives;
        console.log('Lives initialized to:', lives);
    }
    
    // Create initial asteroids
    createAsteroids(5);
    
    console.log('Game reset completed. Lives:', lives);
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
                x = (Math.random() * canvas.width - canvas.width / 2);
                y = - canvas.height / 2 - buffer;
                break;
            case 1: // Right
                x = canvas.width / 2 + buffer;
                y = (Math.random() * canvas.height - canvas.height / 2);
                break;
            case 2: // Bottom
                x = (Math.random() * canvas.width - canvas.width / 2);
                y = canvas.height / 2 + buffer;
                break;
            case 3: // Left
                x = - canvas.width / 2 - buffer;
                y = (Math.random() * canvas.height - canvas.height / 2);
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
    } else if (gameStarted) {
        // Even when game is over, still handle controls for ship rotation
        handleControls();
    }
    render();
    
    // Continue the game loop
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
    // Always rotate ship toward mouse/touch position
    // But ensure we have valid coordinates and canvas
    if (canvas && typeof mouseX !== 'undefined' && typeof mouseY !== 'undefined') {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        
        // Only update angle if we have meaningful values
        if (dx !== 0 || dy !== 0) {
            ship.angle = Math.atan2(dy, dx);
        }
    } else if (canvas) {
        // Initialize mouse position if not set
        mouseX = canvas.width / 2;
        mouseY = canvas.height / 2;
        ship.angle = 0;
    }
    
    // Thrust (only if ship is visible and game has started)
    if (thrust && ship.visible && gameStarted) {
        console.log('Applying thrust: angle=', ship.angle, 'thrust=', thrust);
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
    
    // Automatically shoot at a fixed rate (only if ship is visible and game has started)
    if (ship.shootCooldown <= 0 && ship.visible && gameStarted) {
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
    const velocityX = Math.cos(ship.angle) * 10 + ship.velocity.x; // Faster bullets
    const velocityY = Math.sin(ship.angle) * 10 + ship.velocity.y; // Faster bullets
    
    // Create bullet
    bullets.push({
        x: startX,
        y: startY,
        radius: 2,
        velocity: { x: velocityX, y: velocityY },
        age: 0,
        maxAge: 120 // Bullets disappear after 120 frames (longer lifetime)
    });
}

// Update ship position (keep at center) and apply friction to velocity
function updateShip() {
    // Apply friction
    ship.velocity.x *= ship.friction;
    ship.velocity.y *= ship.friction;
    
    // Update invincibility
    if (ship.invincible) {
        ship.invincibilityTime--;
        if (ship.invincibilityTime <= 0) {
            ship.invincible = false;
        }
    }
    
    // Update respawn timing
    if (ship.respawnTime > 0) {
        ship.respawnTime--;
        if (ship.respawnTime <= 0) {
            ship.visible = true;
            // Make ship invincible for 5 seconds after respawn
            ship.invincible = true;
            ship.invincibilityTime = 300; // 5 seconds at 60fps
        }
    }
    
    // Move the world instead of the ship
    // Update all other objects in the opposite direction of ship movement
    for (const asteroid of asteroids) {
        asteroid.x -= ship.velocity.x;
        asteroid.y -= ship.velocity.y;
    }
    
    for (const bullet of bullets) {
        bullet.x -= ship.velocity.x;
        bullet.y -= ship.velocity.y;
    }
    
    for (const particle of particles) {
        particle.x -= ship.velocity.x;
        particle.y -= ship.velocity.y;
    }
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
        const distance = Math.sqrt(bullet.x * bullet.x + bullet.y * bullet.y);
        
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
        
        // Screen wrapping
        const buffer = 100; // Distance from screen edge
        const leftEdge = - canvas.width / 2 - buffer;
        const rightEdge = canvas.width / 2 + buffer;
        const topEdge = - canvas.height / 2 - buffer;
        const bottomEdge = canvas.height / 2 + buffer;
        
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
    // Check for bullet-asteroid collisions
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        
        for (let j = 0; j < asteroids.length; j++) {
            const asteroid = asteroids[j];
            
            // Check collision
            if (distance(bullet.x, bullet.y, asteroid.x, asteroid.y) < bullet.radius + asteroid.radius) {
                console.log('Bullet-asteroid collision detected!');
                console.log('  Bullet position:', bullet.x, bullet.y);
                console.log('  Asteroid position:', asteroid.x, asteroid.y);
                console.log('  Distance:', distance(bullet.x, bullet.y, asteroid.x, asteroid.y));
                console.log('  Collision threshold:', bullet.radius + asteroid.radius);
                
                // Create explosion particles
                createExplosion(asteroid.x, asteroid.y);
                
                // Increase score
                score += 10 * asteroid.size;
                if (scoreValue) scoreValue.textContent = score;
                
                // Remove bullet and asteroid
                bullets.splice(i, 1);
                asteroids.splice(j, 1);
                
                // If asteroid is large enough, split it into smaller ones
                if (asteroid.size > 1) {
                    // Create two smaller asteroids
                    for (let k = 0; k < 2; k++) {
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
                    setTimeout(() => {
                        if (asteroids.length === 0 && !gameOver) {
                            createAsteroids(5);
                        }
                    }, 100);
                }
                
                // Process only one collision per frame
                return;
            }
        }
    }
    
    // Check for ship-asteroid collisions (only if ship is not invincible and visible)
    if (!ship.invincible && ship.visible) {
        for (let i = 0; i < asteroids.length; i++) {
            const asteroid = asteroids[i];
            
            const distanceToAsteroid = distance(0, 0, asteroid.x, asteroid.y);
            const collisionDistance = ship.radius + asteroid.radius;
            
            if (distanceToAsteroid < collisionDistance) {
                console.log('Ship-asteroid collision detected!');
                console.log('  Distance:', distanceToAsteroid);
                console.log('  Collision threshold:', collisionDistance);
                console.log('  Asteroid position:', asteroid.x, asteroid.y);
                console.log('  Ship position: 0, 0');
                
                // Create explosion particles at ship position (center of screen)
                createExplosion(0, 0);
                
                // Lose a life
                lives--;
                console.log('Life lost. Lives now:', lives);
                if (livesValue) livesValue.textContent = lives;
                
                // Reset ship velocity to zero
                ship.velocity.x = 0;
                ship.velocity.y = 0;
                
                // Check for game over
                if (lives <= 0) {
                    console.log('Game over condition met. Lives:', lives);
                    endGame();
                } else {
                    console.log('Life lost. Lives remaining:', lives);
                    // Make ship invisible for 2 seconds (120 frames at 60fps)
                    ship.visible = false;
                    ship.respawnTime = 120;
                }
                
                // Process only one collision per frame
                break;
            }
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
    // Check if index is valid
    if (index < 0 || index >= asteroids.length) {
        return;
    }
    
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
    // Add a small delay to avoid immediate creation
    if (asteroids.length === 0) {
        setTimeout(() => {
            if (asteroids.length === 0 && !gameOver) {
                createAsteroids(5);
            }
        }, 100);
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
    // Only draw the ship if it's visible
    if (!ship.visible) {
        return;
    }
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(ship.angle);
    
    // Draw ship as a triangle
    let strokeStyle = 'white';
    
    // If ship is invincible, make it blink
    if (ship.invincible && Math.floor(ship.invincibilityTime / 5) % 2 === 0) {
        strokeStyle = 'rgba(255, 255, 255, 0.5)';
    }
    
    ctx.strokeStyle = strokeStyle;
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
    console.log('endGame() called');
    gameOver = true;
    saveHighScore();
    if (finalScoreElement) finalScoreElement.textContent = score;
    if (finalHighScoreElement) finalHighScoreElement.textContent = highScore;
    if (gameOverScreen) {
        console.log('Showing game over screen');
        gameOverScreen.classList.add('show');
        // Also set display explicitly to ensure visibility
        gameOverScreen.style.display = 'flex';
    } else {
        console.log('gameOverScreen element not found');
    }
}

// Start the game when page loads
window.onload = init;