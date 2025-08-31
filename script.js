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
let mines = [];
let turrets = []; // Array to hold turrets
let armyMen = []; // Array to hold army men
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
    
    // Ensure game over screen is hidden at start
    if (gameOverScreen) {
        gameOverScreen.classList.remove('show');
        gameOverScreen.style.display = 'none';
    }
    
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
        if (startScreen) {
            startScreen.style.display = 'none';
        }
        // Also hide game over screen if it's visible
        if (gameOverScreen) {
            gameOverScreen.classList.remove('show');
            gameOverScreen.style.display = 'none';
        }
        gameStarted = true;
        resetGame();
    });
    
    // Restart button
    restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (gameOverScreen) {
            gameOverScreen.classList.remove('show');
            // Also hide explicitly to ensure it's hidden
            gameOverScreen.style.display = 'none';
        }
        gameStarted = true;
        gameOver = false;
        resetGame();
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
        acceleration: 0.75, // 15% faster acceleration (0.65 * 1.15 ≈ 0.75)
        maxSpeed: 5.75, // 15% faster max speed (5 * 1.15 = 5.75)
        friction: 0.98,
        shootCooldown: 0,
        maxShootCooldown: 20, // 20% slower firing rate (17 / 0.8 ≈ 20)
        invincible: false,
        invincibilityTime: 0,
        respawnTime: 0,
        visible: true
    };
    
    // Reset game state
    asteroids = [];
    bullets = [];
    particles = [];
    mines = [];
    turrets = []; // Reset turrets
    armyMen = []; // Reset army men
    
    // Create stationary turrets
    createTurret(); // Top-right corner
    createTurret(-canvas.width / 2 + 100, -canvas.height / 2 + 100); // Top-left corner
    createTurret(canvas.width / 2 - 100, canvas.height / 2 - 100); // Bottom-right corner
    createTurret(-canvas.width / 2 + 100, canvas.height / 2 - 100); // Bottom-left corner
    
    // Create initial army men
    createArmyMan(); // Create first army man
    
    score = 0;
    lives = 3;
    gameOver = false;
    
    // Update UI
    if (scoreValue) scoreValue.textContent = score;
    if (livesValue) livesValue.textContent = lives;
    
    // Hide game over screen if it's visible
    if (gameOverScreen) {
        gameOverScreen.classList.remove('show');
        gameOverScreen.style.display = 'none';
    }
    
    // Create initial asteroids
    createAsteroids(3);
}

// Create a specified number of asteroids
function createAsteroids(count) {
    for (let i = 0; i < count; i++) {
        createAsteroid();
    }
}

// Create a single asteroid
function createAsteroid(size = 3, x = null, y = null) {
    // Randomly decide if this should be a mine (30% chance)
    const isMine = Math.random() < 0.3;
    
    // If position not specified, create at random edge relative to ship position
    if (x === null || y === null) {
        const side = Math.floor(Math.random() * 4);
        const buffer = 200; // Increased distance from screen edge to prevent immediate collisions
        
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
    
    if (isMine) {
        // Create a mine
        mines.push({
            x: x,
            y: y,
            radius: radius,
            velocity: { x: velocityX, y: velocityY },
            size: size,
            type: 'mine', // Distinguish mines from asteroids
            explosionTimer: 0 // Initialize explosion timer
        });
    } else {
        // Create a regular asteroid
        asteroids.push({
            x: x,
            y: y,
            radius: radius,
            velocity: { x: velocityX, y: velocityY },
            size: size
        });
    }
}

// Create a stationary turret
function createTurret(x = null, y = null) {
    // Position the turret at a fixed location if not specified
    if (x === null || y === null) {
        x = canvas.width / 2 - 100; // Slightly left of right edge
        y = -canvas.height / 2 + 100; // Slightly below top edge
    }
    
    const turret = {
        x: x,
        y: y,
        radius: 15,
        shootCooldown: 0,
        maxShootCooldown: 360, // 6 seconds at 60fps
        shotsFired: 0, // Track number of shots fired in current sequence
        maxShots: 2 // Fire twice per sequence
    };
    
    turrets.push(turret);
}

// Create an army man that chases the player
function createArmyMan(x = null, y = null) {
    // If position not specified, create at random edge relative to ship position
    if (x === null || y === null) {
        const side = Math.floor(Math.random() * 4);
        const buffer = 200; // Distance from screen edge
        
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
    
    // Random velocity for initial movement
    const speed = Math.random() * 1 + 0.5;
    const angle = Math.random() * Math.PI * 2;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;
    
    const armyMan = {
        x: x,
        y: y,
        radius: 8,
        velocity: { x: velocityX, y: velocityY },
        speed: 1.5, // Speed at which they chase the player
        maxSpeed: 2.5 // Maximum speed
    };
    
    armyMen.push(armyMan);
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
    
    // Update mines
    updateMines();
    
    // Update turrets
    updateTurrets();
    
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
    
    // Automatically shoot at a fixed rate (only if ship is visible, game has started, and ship is not invincible)
    // Also prevent shooting when ship is dead (respawning)
    if (ship.shootCooldown <= 0 && ship.visible && gameStarted && !ship.invincible) {
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

// Fire a bullet from a turret
function fireTurretBullet(turret, angle) {
    // Calculate bullet starting position (at the turret)
    const startX = turret.x;
    const startY = turret.y;
    
    // Calculate bullet velocity (toward the ship)
    const speed = 7; // Turret bullets are slightly slower than player bullets
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;
    
    // Create bullet
    bullets.push({
        x: startX,
        y: startY,
        radius: 2,
        velocity: { x: velocityX, y: velocityY },
        age: 0,
        maxAge: 180, // Turret bullets last longer than player bullets
        isTurretBullet: true // Mark as turret bullet for collision detection
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
            // Make ship invincible for 3 seconds after respawn
            ship.invincible = true;
            ship.invincibilityTime = 180; // 3 seconds at 60fps
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
    
    // Turrets are stationary, so they move with the world
    for (const turret of turrets) {
        turret.x -= ship.velocity.x;
        turret.y -= ship.velocity.y;
    }
    
    // Army men move with the world
    for (const armyMan of armyMen) {
        armyMan.x -= ship.velocity.x;
        armyMan.y -= ship.velocity.y;
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

// Update mine positions
function updateMines() {
    for (let i = mines.length - 1; i >= 0; i--) {
        const mine = mines[i];
        
        // Update position
        mine.x += mine.velocity.x;
        mine.y += mine.velocity.y;
        
        // Screen wrapping
        const buffer = 100; // Distance from screen edge
        const leftEdge = - canvas.width / 2 - buffer;
        const rightEdge = canvas.width / 2 + buffer;
        const topEdge = - canvas.height / 2 - buffer;
        const bottomEdge = canvas.height / 2 + buffer;
        
        if (mine.x < leftEdge) mine.x = rightEdge;
        if (mine.x > rightEdge) mine.x = leftEdge;
        if (mine.y < topEdge) mine.y = bottomEdge;
        if (mine.y > bottomEdge) mine.y = topEdge;
        
        // Update mine timer for periodic explosions
        if (!mine.explosionTimer) {
            mine.explosionTimer = 0;
        }
        
        mine.explosionTimer++;
        
        // Check for asteroids in explosion radius every 300 frames (5 seconds at 60fps)
        if (mine.explosionTimer >= 300) {
            mine.explosionTimer = 0;
            
            // Check for asteroids within explosion radius
            const explosionRadius = 100; // Approximately 1 inch at typical screen resolution
            let asteroidsInRadius = false;
            
            for (const asteroid of asteroids) {
                if (distance(mine.x, mine.y, asteroid.x, asteroid.y) < explosionRadius) {
                    asteroidsInRadius = true;
                    break;
                }
            }
            
            // If asteroids are found in radius, explode the mine
            if (asteroidsInRadius) {
                // Create mine explosion that affects nearby objects
                createExplosion(mine.x, mine.y, true);
                
                // Remove the mine that exploded
                mines.splice(i, 1);
                
                // Check for objects within explosion radius
                checkMineExplosion(mine.x, mine.y, explosionRadius);
                
                // Increase score for the mine explosion
                score += 15 * mine.size; // Mines are worth more points
                if (scoreValue) scoreValue.textContent = score;
            }
        }
    }
}

// Update turret positions and shooting
function updateTurrets() {
    for (const turret of turrets) {
        // Update shoot cooldown
        if (turret.shootCooldown > 0) {
            turret.shootCooldown--;
        }
        
        // Check if turret can shoot (cooldown is over and ship is visible)
        if (turret.shootCooldown <= 0 && ship.visible) {
            // Calculate angle to ship
            const dx = ship.x - turret.x;
            const dy = ship.y - turret.y;
            const angle = Math.atan2(dy, dx);
            
            // Fire bullet
            fireTurretBullet(turret, angle);
            
            // Increment shots fired
            turret.shotsFired++;
            
            // If we've fired both shots, reset the sequence and start cooldown
            if (turret.shotsFired >= turret.maxShots) {
                turret.shotsFired = 0;
                turret.shootCooldown = turret.maxShootCooldown;
            } else {
                // Short delay between shots in the same sequence (e.g., 0.5 seconds)
                turret.shootCooldown = 30; // 0.5 seconds at 60fps
            }
        }
    }
}

// Update army men positions to chase the player
function updateArmyMen() {
    for (let i = armyMen.length - 1; i >= 0; i--) {
        const armyMan = armyMen[i];
        
        // Calculate direction to player (ship is at 0,0 in world coordinates)
        const dx = ship.x - armyMan.x;
        const dy = ship.y - armyMan.y;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize direction vector
        if (distanceToPlayer > 0) {
            const directionX = dx / distanceToPlayer;
            const directionY = dy / distanceToPlayer;
            
            // Apply acceleration toward player
            armyMan.velocity.x += directionX * 0.05;
            armyMan.velocity.y += directionY * 0.05;
            
            // Limit maximum speed
            const speed = Math.sqrt(armyMan.velocity.x * armyMan.velocity.x + armyMan.velocity.y * armyMan.velocity.y);
            if (speed > armyMan.maxSpeed) {
                armyMan.velocity.x = (armyMan.velocity.x / speed) * armyMan.maxSpeed;
                armyMan.velocity.y = (armyMan.velocity.y / speed) * armyMan.maxSpeed;
            }
        }
        
        // Update position
        armyMan.x += armyMan.velocity.x;
        armyMan.y += armyMan.velocity.y;
        
        // Screen wrapping
        const buffer = 100; // Distance from screen edge
        const leftEdge = - canvas.width / 2 - buffer;
        const rightEdge = canvas.width / 2 + buffer;
        const topEdge = - canvas.height / 2 - buffer;
        const bottomEdge = canvas.height / 2 + buffer;
        
        if (armyMan.x < leftEdge) armyMan.x = rightEdge;
        if (armyMan.x > rightEdge) armyMan.x = leftEdge;
        if (armyMan.y < topEdge) armyMan.y = bottomEdge;
        if (armyMan.y > bottomEdge) armyMan.y = topEdge;
    }
}

// Spawn new army men periodically
function spawnArmyMen() {
    // Spawn a new army man every 5 seconds (300 frames at 60fps)
    if (Math.random() < 1/300) {
        createArmyMan();
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

// Check for collisions between bullets and asteroids/mines, and ship and asteroids/mines
function checkCollisions() {
    // Check for bullet-asteroid collisions
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        
        // Check bullet-asteroid collisions
        for (let j = 0; j < asteroids.length; j++) {
            const asteroid = asteroids[j];
            
            // Check collision
            if (distance(bullet.x, bullet.y, asteroid.x, asteroid.y) < bullet.radius + asteroid.radius) {
                // Create explosion particles
                createExplosion(asteroid.x, asteroid.y, false);
                
                // Increase score (only if it's a player bullet)
                if (!bullet.isTurretBullet) {
                    score += 10 * asteroid.size;
                    if (scoreValue) scoreValue.textContent = score;
                }
                
                // Remove bullet and asteroid
                bullets.splice(i, 1);
                asteroids.splice(j, 1);
                
                // If asteroid is large (size 3), split it into medium ones (size 2)
                // Medium asteroids (size 2) split into small ones (size 1)
                // Small asteroids (size 1) are just destroyed
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
                if (asteroids.length === 0 && mines.length === 0) {
                    setTimeout(() => {
                        if (asteroids.length === 0 && mines.length === 0 && !gameOver) {
                            createAsteroids(3);
                        }
                    }, 100);
                }
                
                // Process only one collision per frame
                return;
            }
        }
        
        // Check bullet-mine collisions
        for (let j = 0; j < mines.length; j++) {
            const mine = mines[j];
            
            // Check collision
            if (distance(bullet.x, bullet.y, mine.x, mine.y) < bullet.radius + mine.radius) {
                // Create mine explosion that affects nearby objects
                const explosionRadius = 100; // Approximately 1 inch at typical screen resolution
                createExplosion(mine.x, mine.y, true);
                
                // Remove bullet
                bullets.splice(i, 1);
                
                // Remove the mine that was hit
                mines.splice(j, 1);
                
                // Increase score (only if it's a player bullet)
                if (!bullet.isTurretBullet) {
                    score += 15 * mine.size; // Mines are worth more points
                    if (scoreValue) scoreValue.textContent = score;
                }
                
                // Check for objects within explosion radius
                checkMineExplosion(mine.x, mine.y, explosionRadius);
                
                // If all asteroids and mines are destroyed, create a new wave
                if (asteroids.length === 0 && mines.length === 0) {
                    setTimeout(() => {
                        if (asteroids.length === 0 && mines.length === 0 && !gameOver) {
                            createAsteroids(3);
                        }
                    }, 100);
                }
                
                // Process only one collision per frame
                return;
            }
        }
        
        // Check bullet-turret collisions
        for (let j = 0; j < turrets.length; j++) {
            const turret = turrets[j];
            
            // Check collision
            if (distance(bullet.x, bullet.y, turret.x, turret.y) < bullet.radius + turret.radius) {
                // Create explosion particles for turret
                createExplosion(turret.x, turret.y, false);
                
                // Increase score (only if it's a player bullet)
                if (!bullet.isTurretBullet) {
                    score += 50; // Turrets are worth 50 points
                    if (scoreValue) scoreValue.textContent = score;
                }
                
                // Remove bullet
                bullets.splice(i, 1);
                
                // Remove the turret that was hit
                turrets.splice(j, 1);
                
                // Process only one collision per frame
                return;
            }
        }
        
        // Check bullet-army man collisions
        for (let j = 0; j < armyMen.length; j++) {
            const armyMan = armyMen[j];
            
            // Check collision
            if (distance(bullet.x, bullet.y, armyMan.x, armyMan.y) < bullet.radius + armyMan.radius) {
                // Create explosion particles
                createExplosion(armyMan.x, armyMan.y, false);
                
                // Increase score (only if it's a player bullet)
                if (!bullet.isTurretBullet) {
                    score += 25; // Army men are worth 25 points
                    if (scoreValue) scoreValue.textContent = score;
                }
                
                // Remove bullet and army man
                bullets.splice(i, 1);
                armyMen.splice(j, 1);
                
                // Process only one collision per frame
                return;
            }
        }
    }
    
    // Check for ship-asteroid collisions (only if ship is not invincible and visible)
    if (!ship.invincible && ship.visible) {
        for (let i = 0; i < asteroids.length; i++) {
            const asteroid = asteroids[i];
            
            if (distance(0, 0, asteroid.x, asteroid.y) < ship.radius + asteroid.radius) {
                // Create explosion particles for both ship and asteroid
                createExplosion(0, 0, false); // Ship explosion
                createExplosion(asteroid.x, asteroid.y, false); // Asteroid explosion
                
                // Increase score for destroying the asteroid
                score += 10 * asteroid.size;
                if (scoreValue) scoreValue.textContent = score;
                
                // Remove the asteroid that was collided with
                asteroids.splice(i, 1);
                
                // Lose a life
                lives--;
                if (livesValue) livesValue.textContent = lives;
                
                // Reset ship velocity to zero
                ship.velocity.x = 0;
                ship.velocity.y = 0;
                
                // Check for game over
                if (lives <= 0) {
                    endGame();
                } else {
                    // Make ship invisible for 2 seconds (120 frames at 60fps)
                    ship.visible = false;
                    ship.respawnTime = 120;
                }
                
                // Process only one collision per frame
                break;
            }
        }
        
        // Check for ship-mine collisions (only if ship is not invincible and visible)
        for (let i = 0; i < mines.length; i++) {
            const mine = mines[i];
            
            if (distance(0, 0, mine.x, mine.y) < ship.radius + mine.radius) {
                // Create mine explosion that affects nearby objects
                const explosionRadius = 100; // Approximately 1 inch at typical screen resolution
                createExplosion(0, 0, false);
                createExplosion(mine.x, mine.y, true); // Also create explosion at mine position
                
                // Increase score for destroying the mine
                score += 15 * mine.size; // Mines are worth more points
                if (scoreValue) scoreValue.textContent = score;
                
                // Remove the mine that exploded
                mines.splice(i, 1);
                
                // Lose a life (mines are more dangerous)
                lives--;
                if (livesValue) livesValue.textContent = lives;
                
                // Reset ship velocity to zero
                ship.velocity.x = 0;
                ship.velocity.y = 0;
                
                // Check for objects within explosion radius
                checkMineExplosion(mine.x, mine.y, explosionRadius);
                
                // Check for game over
                if (lives <= 0) {
                    endGame();
                } else {
                    // Make ship invisible for 2 seconds (120 frames at 60fps)
                    ship.visible = false;
                    ship.respawnTime = 120;
                }
                
                // Process only one collision per frame
                break;
            }
        }
        
        // Check for ship-army man collisions (only if ship is not invincible and visible)
        for (let i = 0; i < armyMen.length; i++) {
            const armyMan = armyMen[i];
            
            if (distance(0, 0, armyMan.x, armyMan.y) < ship.radius + armyMan.radius) {
                // Create explosion particles for both ship and army man
                createExplosion(0, 0, false); // Ship explosion
                createExplosion(armyMan.x, armyMan.y, false); // Army man explosion
                
                // Increase score for destroying the army man
                score += 25; // Army men are worth 25 points
                if (scoreValue) scoreValue.textContent = score;
                
                // Remove the army man that was collided with
                armyMen.splice(i, 1);
                
                // Lose a life
                lives--;
                if (livesValue) livesValue.textContent = lives;
                
                // Reset ship velocity to zero
                ship.velocity.x = 0;
                ship.velocity.y = 0;
                
                // Check for game over
                if (lives <= 0) {
                    endGame();
                } else {
                    // Make ship invisible for 2 seconds (120 frames at 60fps)
                    ship.visible = false;
                    ship.respawnTime = 120;
                }
                
                // Process only one collision per frame
                break;
            }
        }
        
        // Check for ship-turret bullet collisions (only if ship is not invincible and visible)
        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            
            // Only check turret bullets
            if (bullet.isTurretBullet) {
                if (distance(0, 0, bullet.x, bullet.y) < ship.radius + bullet.radius) {
                    // Create explosion particles for ship
                    createExplosion(0, 0, false);
                    
                    // Remove the bullet
                    bullets.splice(i, 1);
                    
                    // Lose a life
                    lives--;
                    if (livesValue) livesValue.textContent = lives;
                    
                    // Reset ship velocity to zero
                    ship.velocity.x = 0;
                    ship.velocity.y = 0;
                    
                    // Check for game over
                    if (lives <= 0) {
                        endGame();
                    } else {
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
}

// Create explosion particles
function createExplosion(x, y, isMine = false) {
    const particleCount = isMine ? 30 : 20; // More particles for mine explosions
    const maxRadius = isMine ? 4 : 3; // Larger particles for mine explosions
    const maxVelocity = isMine ? 7 : 5; // Faster particles for mine explosions
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            radius: Math.random() * maxRadius + 1,
            velocity: {
                x: (Math.random() - 0.5) * maxVelocity,
                y: (Math.random() - 0.5) * maxVelocity
            },
            life: 30,
            maxLife: 30
        });
    }
    
    // If this is a mine explosion, create a temporary red circle for the explosion radius
    if (isMine) {
        // Create a temporary visual effect for the explosion radius
        particles.push({
            x: x,
            y: y,
            radius: 100, // Explosion radius
            velocity: { x: 0, y: 0 },
            life: 10,
            maxLife: 10,
            isExplosionRadius: true // Special flag for radius visualization
        });
    }
}

// Check for objects within mine explosion radius and destroy them
function checkMineExplosion(x, y, radius) {
    // Check for asteroids within explosion radius
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        if (distance(x, y, asteroid.x, asteroid.y) < radius) {
            // Create explosion particles for the destroyed asteroid
            createExplosion(asteroid.x, asteroid.y, false);
            
            // Increase score
            score += 10 * asteroid.size;
            if (scoreValue) scoreValue.textContent = score;
            
            // Remove asteroid
            asteroids.splice(i, 1);
            
            // If asteroid is large (size 3), split it into medium ones (size 2)
            // Medium asteroids (size 2) split into small ones (size 1)
            // Small asteroids (size 1) are just destroyed
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
        }
    }
    
    // Check for mines within explosion radius
    for (let i = mines.length - 1; i >= 0; i--) {
        const mine = mines[i];
        // Don't trigger the mine that caused the explosion
        if (distance(x, y, mine.x, mine.y) < radius && distance(x, y, mine.x, mine.y) > 5) {
            // Create explosion particles for the destroyed mine
            createExplosion(mine.x, mine.y, true);
            
            // Increase score
            score += 15 * mine.size; // Mines are worth more points
            if (scoreValue) scoreValue.textContent = score;
            
            // Remove mine
            mines.splice(i, 1);
        }
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
    
    // If all asteroids and mines are destroyed, create a new wave
    // Add a small delay to avoid immediate creation
    if (asteroids.length === 0 && mines.length === 0) {
        setTimeout(() => {
            if (asteroids.length === 0 && mines.length === 0 && !gameOver) {
                createAsteroids(3);
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
        
        // Draw mines
        drawMines();
        
        // Draw turrets
        drawTurrets();
        
        // Draw army men
        drawArmyMen();
        
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
        
        // Check if this is a special explosion radius particle
        if (particle.isExplosionRadius) {
            // Draw a red circle for the explosion radius
            const alpha = particle.life / particle.maxLife;
            ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(screenX, screenY, particle.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            // Fade out as particle life decreases
            const alpha = particle.life / particle.maxLife;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, particle.radius, 0, Math.PI * 2);
            ctx.fill();
        }
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

// Draw all mines
function drawMines() {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]); // Dashed line for mines
    for (const mine of mines) {
        // Calculate screen position relative to ship
        const screenX = mine.x - ship.x + canvas.width / 2;
        const screenY = mine.y - ship.y + canvas.height / 2;
        
        // Draw mine as a circle with a cross inside
        ctx.beginPath();
        ctx.arc(screenX, screenY, mine.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw cross inside mine
        ctx.beginPath();
        ctx.moveTo(screenX - mine.radius * 0.7, screenY - mine.radius * 0.7);
        ctx.lineTo(screenX + mine.radius * 0.7, screenY + mine.radius * 0.7);
        ctx.moveTo(screenX + mine.radius * 0.7, screenY - mine.radius * 0.7);
        ctx.lineTo(screenX - mine.radius * 0.7, screenY + mine.radius * 0.7);
        ctx.stroke();
    }
    ctx.setLineDash([]); // Reset line dash
}

// Draw all turrets
function drawTurrets() {
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    for (const turret of turrets) {
        // Calculate screen position relative to ship
        const screenX = turret.x - ship.x + canvas.width / 2;
        const screenY = turret.y - ship.y + canvas.height / 2;
        
        // Draw turret as a square
        ctx.beginPath();
        ctx.rect(screenX - turret.radius, screenY - turret.radius, turret.radius * 2, turret.radius * 2);
        ctx.stroke();
        
        // Draw a small indicator for the front of the turret
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(screenX + turret.radius, screenY);
        ctx.stroke();
    }
}

// Draw all army men
function drawArmyMen() {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    for (const armyMan of armyMen) {
        // Calculate screen position relative to ship
        const screenX = armyMan.x - ship.x + canvas.width / 2;
        const screenY = armyMan.y - ship.y + canvas.height / 2;
        
        // Draw army man as a small triangle pointing toward the player
        ctx.save();
        ctx.translate(screenX, screenY);
        
        // Calculate angle to player for rotation
        const dx = ship.x - armyMan.x;
        const dy = ship.y - armyMan.y;
        const angle = Math.atan2(dy, dx);
        ctx.rotate(angle);
        
        // Draw a triangle
        ctx.beginPath();
        ctx.moveTo(armyMan.radius, 0);
        ctx.lineTo(-armyMan.radius, -armyMan.radius/1.5);
        ctx.lineTo(-armyMan.radius, armyMan.radius/1.5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
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