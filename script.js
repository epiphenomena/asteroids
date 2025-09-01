// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const finalHighScoreElement = document.getElementById('finalHighScore');
const finalWaveElement = document.getElementById('finalWave');
const restartButton = document.getElementById('restartButton');
const scoreValue = document.getElementById('scoreValue');
const livesValue = document.getElementById('livesValue');
const waveValue = document.getElementById('waveValue');
const highScoreValue = document.getElementById('highScoreValue');

// Game state
let ship;
let asteroids = [];
let bullets = [];
let particles = [];
let mines = [];
let turrets = []; // Array to hold turrets
let armyMen = []; // Array to hold army men
let powerups = []; // Array to hold powerups
let roses = []; // Array to hold roses
let sword; // Object to hold the orbiting sword
let speedBoostActive = false; // Track if speed boost is active
let speedBoostTimer = 0; // Timer for speed boost duration
let originalMaxSpeed = 0; // Store original max speed
let shipShape = 'triangle'; // Current ship shape ('triangle', 'diamond', 'pentagon', 'hexagon', 'square')
let shipShapeTimer = 0; // Timer for ship shape duration
let originalShipShape = 'triangle'; // Store original ship shape
let eatEverythingActive = false; // Track if eat everything effect is active
let eatEverythingTimer = 0; // Timer for eat everything duration
let eatingMouse = null; // Object to hold the eating mouse
let score = 0;
let lives = 3;
let highScore = 0;
let gameOver = false;
let gameStarted = false;
let bulletSizeMultiplier = 1.0; // Powerup effect for bullet size
let waveNumber = 1; // Track current wave
let forceFieldActive = false; // Force field powerup effect
let forceFieldRadius = 30; // Radius of force field
let forceFieldLifetime = 0; // Remaining time for force field
let forceFieldMaxLifetime = 600; // 10 seconds at 60fps
let shipSizeMultiplier = 1.0; // Powerup effect for ship size

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

// Start game function
function startGame() {
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
}

// Restart game function
function restartGame() {
    if (gameOverScreen) {
        gameOverScreen.classList.remove('show');
        // Also hide explicitly to ensure it's hidden
        gameOverScreen.style.display = 'none';
    }
    gameStarted = true;
    gameOver = false;
    resetGame();
}

// Setup event listeners
function setupEventListeners() {
    // Start button
    startButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        startGame();
    });
    
    // Also add touch event for mobile devices
    startButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        startGame();
    });
    
    // Restart button
    restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        restartGame();
    });
    
    // Also add touch event for mobile devices
    restartButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        restartGame();
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
        // Only prevent default on the canvas, not on buttons
        if (e.target === canvas || e.target === startScreen || e.target === gameOverScreen) {
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
        acceleration: 0.65, // Decreased from 0.75 to 0.65 (15% slower)
        maxSpeed: 5.5, // Increased from 5.0 for more momentum
        friction: 0.92, // Further reduced friction for even better momentum (was 0.95)
        shootCooldown: 0,
        maxShootCooldown: 20, // 20% slower firing rate (17 / 0.8 ≈ 20)
        invincible: false,
        invincibilityTime: 0,
        respawnTime: 0,
        visible: true
    };
    
    // Reset sword (no sword at start)
    sword = null;
    
    // Reset speed boost
    speedBoostActive = false;
    speedBoostTimer = 0;
    originalMaxSpeed = 0;
    
    // Reset ship shape to default
    shipShape = 'triangle';
    shipShapeTimer = 0;
    originalShipShape = 'triangle';
    
    // Reset eat everything effect
    eatEverythingActive = false;
    eatEverythingTimer = 0;
    eatingMouse = null; // Reset eating mouse
    
    // Reset game state
    asteroids = [];
    bullets = [];
    particles = [];
    mines = [];
    turrets = []; // Reset turrets
    armyMen = []; // Reset army men
    powerups = []; // Reset powerups
    roses = []; // Reset roses
    bulletSizeMultiplier = 1.0; // Reset bullet size multiplier
    shipSizeMultiplier = 1.0; // Reset ship size multiplier
    waveNumber = 1; // Reset wave number
    waveTimer = 0; // Reset wave timer
    forceFieldActive = false; // Reset force field
    forceFieldLifetime = 0; // Reset force field lifetime
}

// Create a specified number of asteroids
function createAsteroids(count) {
    for (let i = 0; i < count; i++) {
        createAsteroid();
    }
}

// Create a single asteroid or mine
function createAsteroid(size = 3, x = null, y = null, forceMine = false) {
    // Randomly decide if this should be a mine (30% chance) unless forced
    const isMine = forceMine || Math.random() < 0.3;
    
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
        // Create a mine with absolute world coordinates (not affected by ship movement)
        mines.push({
            x: x,
            y: y,
            radius: radius,
            velocity: { x: velocityX, y: velocityY },
            size: size,
            type: 'mine', // Distinguish mines from asteroids
            explosionTimer: 0, // Initialize explosion timer
            worldX: x, // Store absolute world coordinates
            worldY: y  // Store absolute world coordinates
        });
    } else {
        // Create a regular asteroid
        asteroids.push({
            x: x,
            y: y,
            radius: radius,
            velocity: { x: velocityX, y: velocityY },
            size: size,
            shapeType: Math.floor(Math.random() * 5) // Assign a random shape type (0-4)
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
    
    // Check if turret position is too close to the center (ship start position)
    const distanceFromCenter = Math.sqrt(x * x + y * y);
    if (distanceFromCenter < 150) {
        // Move turret away from center if too close
        const angle = Math.atan2(y, x);
        x = Math.cos(angle) * 150;
        y = Math.sin(angle) * 150;
    }
    
    // Check for collisions with existing asteroids/mines/turrets (try up to 20 times)
    let attempts = 0;
    let collision = true;
    
    while (collision && attempts < 20) {
        collision = false;
        attempts++;
        
        // Check asteroids
        for (const asteroid of asteroids) {
            const dx = x - asteroid.x;
            const dy = y - asteroid.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 25 + asteroid.radius) {
                collision = true;
                // Move turret to a different position along screen edges
                const edges = [
                    {x: Math.random() * canvas.width - canvas.width / 2, y: -canvas.height / 2 + 30}, // Top edge
                    {x: Math.random() * canvas.width - canvas.width / 2, y: canvas.height / 2 - 30}, // Bottom edge
                    {x: canvas.width / 2 - 30, y: Math.random() * canvas.height - canvas.height / 2}, // Right edge
                    {x: -canvas.width / 2 + 30, y: Math.random() * canvas.height - canvas.height / 2}  // Left edge
                ];
                const edge = edges[Math.floor(Math.random() * edges.length)];
                x = edge.x + (Math.random() - 0.5) * 50;
                y = edge.y + (Math.random() - 0.5) * 50;
                break;
            }
        }
        
        // Check mines
        if (!collision) {
            for (const mine of mines) {
                const dx = x - mine.x;
                const dy = y - mine.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 25 + mine.radius) {
                    collision = true;
                    // Move turret to a different position along screen edges
                    const edges = [
                        {x: Math.random() * canvas.width - canvas.width / 2, y: -canvas.height / 2 + 30}, // Top edge
                        {x: Math.random() * canvas.width - canvas.width / 2, y: canvas.height / 2 - 30}, // Bottom edge
                        {x: canvas.width / 2 - 30, y: Math.random() * canvas.height - canvas.height / 2}, // Right edge
                        {x: -canvas.width / 2 + 30, y: Math.random() * canvas.height - canvas.height / 2}  // Left edge
                    ];
                    const edge = edges[Math.floor(Math.random() * edges.length)];
                    x = edge.x + (Math.random() - 0.5) * 50;
                    y = edge.y + (Math.random() - 0.5) * 50;
                    break;
                }
            }
        }
        
        // Check other turrets
        if (!collision) {
            for (const turret of turrets) {
                const dx = x - turret.x;
                const dy = y - turret.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 35) { // Minimum distance between turrets
                    collision = true;
                    // Move turret to a different position along screen edges
                    const edges = [
                        {x: Math.random() * canvas.width - canvas.width / 2, y: -canvas.height / 2 + 30}, // Top edge
                        {x: Math.random() * canvas.width - canvas.width / 2, y: canvas.height / 2 - 30}, // Bottom edge
                        {x: canvas.width / 2 - 30, y: Math.random() * canvas.height - canvas.height / 2}, // Right edge
                        {x: -canvas.width / 2 + 30, y: Math.random() * canvas.height - canvas.height / 2}  // Left edge
                    ];
                    const edge = edges[Math.floor(Math.random() * edges.length)];
                    x = edge.x + (Math.random() - 0.5) * 50;
                    y = edge.y + (Math.random() - 0.5) * 50;
                    break;
                }
            }
        }
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
        radius: 12,
        velocity: { x: velocityX, y: velocityY },
        speed: 1.2, // Decreased from 1.95 to 1.2 (38% slower)
        maxSpeed: 2.0, // Decreased from 3.25 to 2.0 (38% slower)
        acceleration: 0.04 // Decreased from 0.065 to 0.04 (38% slower)
    };
    
    armyMen.push(armyMan);
}

// Create a force field powerup
function createForceFieldPowerup(x = null, y = null) {
    // If position not specified, create at random location
    if (x === null || y === null) {
        // Create powerup at a random position, but not too close to the center
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 300; // 200-500 pixels from center
        x = Math.cos(angle) * distance;
        y = Math.sin(angle) * distance;
    }
    
    const powerup = {
        x: x,
        y: y,
        radius: 12,
        type: 'forceField', // Force field powerup type
        pulse: 0 // For animation
    };
    
    powerups.push(powerup);
}

// Create a powerup (bullet size only)
function createPowerup(x = null, y = null) {
    // If position not specified, create at random location
    if (x === null || y === null) {
        // Create powerup at a random position, but not too close to the center
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 300; // 200-500 pixels from center
        x = Math.cos(angle) * distance;
        y = Math.sin(angle) * distance;
    }
    
    // 50% chance for eat everything mouse powerup, 50% for ship destroy trap powerup
    // This makes the mouse power-up much more common
    const rand = Math.random();
    let powerupType;
    if (rand < 0.50) {
        powerupType = 'eatEverything'; // Eat everything mouse power-up (50% chance)
    } else {
        powerupType = 'shipDestroy'; // Ship destroy trap power-up (50% chance)
    }
    
    const powerup = {
        x: x,
        y: y,
        radius: 12,
        type: powerupType, // Type of powerup ('shipDestroy' or 'eatEverything')
        pulse: 0 // For animation
    };
    
    powerups.push(powerup);
}

// Create a rose that spits poison
function createRose(x = null, y = null) {
    // If position not specified, create at random location
    if (x === null || y === null) {
        // Create rose at a random position, but not too close to the center
        const angle = Math.random() * Math.PI * 2;
        const distance = 300 + Math.random() * 200; // 300-500 pixels from center
        x = Math.cos(angle) * distance;
        y = Math.sin(angle) * distance;
    }
    
    const rose = {
        x: x,
        y: y,
        radius: 15,
        poisonCooldown: 0,
        maxPoisonCooldown: 300, // 5 seconds at 60fps
        poisonBullets: [], // Roses have their own poison bullets
        petalCount: 8, // Number of petals
        petalAngles: [] // Current angles of petals for rotation effect
    };
    
    // Initialize petal angles
    for (let i = 0; i < rose.petalCount; i++) {
        rose.petalAngles.push(i * Math.PI * 2 / rose.petalCount);
    }
    
    roses.push(rose);
}

// Create a group of army men
function createArmyMenGroup(count) {
    for (let i = 0; i < count; i++) {
        createArmyMan();
    }
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
    
    // Update army men
    updateArmyMen();
    
    // Update powerups
    updatePowerups();
    
    // Update roses
    updateRoses();
    
    // Update particles
    updateParticles();
    
    // Update sword
    updateSword();
    
    // Update timed effects (force field, speed boost, ship shape)
    updateTimedEffects();
    
    // Update wave system
    updateWaves();
    
    // Update UI
    if (waveValue) waveValue.textContent = waveNumber;
    
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
    
    // Create bullet with size based on multiplier
    bullets.push({
        x: startX,
        y: startY,
        radius: 2 * bulletSizeMultiplier, // Apply size multiplier
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
    
    // Powerups move with the world
    for (const powerup of powerups) {
        powerup.x -= ship.velocity.x;
        powerup.y -= ship.velocity.y;
    }
    
    // Roses move with the world
    for (const rose of roses) {
        rose.x -= ship.velocity.x;
        rose.y -= ship.velocity.y;
        
        // Rose poison bullets also move with the world
        for (const bullet of rose.poisonBullets) {
            bullet.x -= ship.velocity.x;
            bullet.y -= ship.velocity.y;
        }
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
        
        // Update position using absolute world coordinates
        // Mines move independently of ship movement
        mine.worldX += mine.velocity.x;
        mine.worldY += mine.velocity.y;
        
        // Update relative position for rendering and collision detection
        mine.x = mine.worldX - ship.x;
        mine.y = mine.worldY - ship.y;
        
        // Screen wrapping using absolute coordinates
        const buffer = 100; // Distance from screen edge
        const leftEdge = - canvas.width / 2 - buffer;
        const rightEdge = canvas.width / 2 + buffer;
        const topEdge = - canvas.height / 2 - buffer;
        const bottomEdge = canvas.height / 2 + buffer;
        
        // Wrap mines when they go off-screen
        if (mine.worldX < leftEdge) mine.worldX = rightEdge;
        if (mine.worldX > rightEdge) mine.worldX = leftEdge;
        if (mine.worldY < topEdge) mine.worldY = bottomEdge;
        if (mine.worldY > bottomEdge) mine.worldY = topEdge;
        
        // Update relative position after wrapping
        mine.x = mine.worldX - ship.x;
        mine.y = mine.worldY - ship.y;
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
            
            // Apply acceleration toward player (decreased acceleration)
            armyMan.velocity.x += directionX * armyMan.acceleration;
            armyMan.velocity.y += directionY * armyMan.acceleration;
            
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

// Update powerups
function updatePowerups() {
    for (let i = powerups.length - 1; i >= 0; i--) {
        const powerup = powerups[i];
        
        // Update pulse animation
        powerup.pulse = (powerup.pulse + 0.1) % (Math.PI * 2);
        
        // Screen wrapping
        const buffer = 100; // Distance from screen edge
        const leftEdge = - canvas.width / 2 - buffer;
        const rightEdge = canvas.width / 2 + buffer;
        const topEdge = - canvas.height / 2 - buffer;
        const bottomEdge = canvas.height / 2 + buffer;
        
        if (powerup.x < leftEdge) powerup.x = rightEdge;
        if (powerup.x > rightEdge) powerup.x = leftEdge;
        if (powerup.y < topEdge) powerup.y = bottomEdge;
        if (powerup.y > bottomEdge) powerup.y = topEdge;
    }
}

// Update roses
function updateRoses() {
    for (const rose of roses) {
        // Update poison cooldown
        if (rose.poisonCooldown > 0) {
            rose.poisonCooldown--;
        }
        
        // Update petal angles for rotation effect
        for (let i = 0; i < rose.petalAngles.length; i++) {
            rose.petalAngles[i] += 0.01; // Slow rotation
        }
        
        // Shoot poison bullets from each petal when cooldown is ready
        if (rose.poisonCooldown <= 0) {
            // Shoot poison bullets from each petal
            for (let i = 0; i < rose.petalCount; i++) {
                const angle = rose.petalAngles[i];
                fireRosePoisonBullet(rose, angle);
            }
            
            // Reset cooldown
            rose.poisonCooldown = rose.maxPoisonCooldown;
        }
        
        // Update poison bullets
        for (let i = rose.poisonBullets.length - 1; i >= 0; i--) {
            const bullet = rose.poisonBullets[i];
            
            // Update position
            bullet.x += bullet.velocity.x;
            bullet.y += bullet.velocity.y;
            
            // Remove bullets that go off-screen
            const distance = Math.sqrt(bullet.x * bullet.x + bullet.y * bullet.y);
            if (distance > Math.max(canvas.width, canvas.height)) {
                rose.poisonBullets.splice(i, 1);
            }
        }
        
        // Screen wrapping
        const buffer = 100; // Distance from screen edge
        const leftEdge = - canvas.width / 2 - buffer;
        const rightEdge = canvas.width / 2 + buffer;
        const topEdge = - canvas.height / 2 - buffer;
        const bottomEdge = canvas.height / 2 + buffer;
        
        if (rose.x < leftEdge) rose.x = rightEdge;
        if (rose.x > rightEdge) rose.x = leftEdge;
        if (rose.y < topEdge) rose.y = bottomEdge;
        if (rose.y > bottomEdge) rose.y = topEdge;
    }
}

// Fire a poison bullet from a rose
function fireRosePoisonBullet(rose, angle) {
    // Calculate bullet starting position (at the rose)
    const startX = rose.x;
    const startY = rose.y;
    
    // Calculate bullet velocity (toward the target angle)
    const speed = 5; // Poison bullets are slower than regular bullets
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;
    
    // Create bullet
    rose.poisonBullets.push({
        x: startX,
        y: startY,
        radius: 3,
        velocity: { x: velocityX, y: velocityY }
    });
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

// Update timed effects (force field, speed boost, ship shape, eating mouse)
function updateTimedEffects() {
    // Update force field
    if (forceFieldActive) {
        forceFieldLifetime--;
        if (forceFieldLifetime <= 0) {
            forceFieldActive = false;
        }
    }
    
    // Update speed boost timer
    if (speedBoostActive) {
        speedBoostTimer--;
        if (speedBoostTimer <= 0) {
            speedBoostActive = false;
            ship.maxSpeed = originalMaxSpeed; // Reset to original max speed
        }
    }
    
    // Update ship shape timer (only when ship is visible and not invincible)
    if (shipShapeTimer > 0) {
        // Only decrement timer when ship is alive and visible
        if (ship && ship.visible && !ship.invincible) {
            shipShapeTimer--;
            if (shipShapeTimer <= 0) {
                shipShape = originalShipShape; // Reset to original ship shape
            }
        }
    }
    
    // Update eating mouse
    if (eatingMouse) {
        updateEatingMouse();
    }
}

// Update sword position
function updateSword() {
    // Only update if sword exists
    if (sword) {
        // Update all swords' orbit angles
        for (const s of sword.swords) {
            s.angle += sword.orbitSpeed;
            
            // Keep angle within 0-2π range
            if (s.angle > Math.PI * 2) {
                s.angle -= Math.PI * 2;
            }
        }
    }
}

// Update wave system
function updateWaves() {
    if (!gameStarted || gameOver) return;
    
    // Check if player has won (reached wave 15)
    if (waveNumber > 15) {
        winGame();
        return;
    }
    
    // Check if all enemies from current wave are defeated
    if (asteroids.length === 0 && mines.length === 0 && armyMen.length === 0) {
        // All enemies defeated, spawn next wave
        waveNumber++;
        
        // Check if player has won after incrementing wave number
        if (waveNumber > 15) {
            winGame();
            return;
        }
        
        // Spawn new enemies for the next wave
        spawnWaveEnemies();
        
        // Update UI
        if (waveValue) waveValue.textContent = waveNumber;
        
        console.log(`Wave ${waveNumber} spawned!`);
    }
    
    // No timer-based wave spawning anymore
}

// Spawn enemies for current wave
function spawnWaveEnemies() {
    // Create asteroids (increase by 1 every wave)
    const asteroidCount = waveNumber; // 1, 2, 3, 4, 5, etc.
    createAsteroids(asteroidCount);
    
    // Create mines (start with 0, increase by 1 every 3 waves)
    const mineCount = Math.floor(waveNumber / 3); // 0, 0, 0, 1, 1, 1, 2, 2, 2, etc.
    for (let i = 0; i < mineCount; i++) {
        createAsteroid(3, null, null, true); // Create large mines
    }
    
    // Create army men groups (3 army men every wave)
    createArmyMenGroup(3); // 3 army men every wave
    
    // Create turrets (add new ones every 3 waves)
    if (waveNumber > 1 && waveNumber % 3 === 1) { // Start at wave 4, then every 3 waves
        createTurret(); // Add one new turret
    }
    
    // Create powerups (more frequent as game progresses)
    if (waveNumber % 2 === 1 || Math.random() < 0.4) { // Increased random chance
        createPowerup();
    }
    
    // Create roses (add new ones every 2 waves, more frequent)
    if (waveNumber > 1 && waveNumber % 2 === 0) { // Start at wave 2, then every 2 waves
        createRose(); // Add one new rose
    }
    
    // Create a force field powerup every wave
    createForceFieldPowerup();
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
                            size: asteroid.size - 1,
                            shapeType: Math.floor(Math.random() * 5) // Assign a random shape type (0-4)
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
    
    // Check for sword collisions (only if sword exists and ship is visible)
    if (sword && ship && ship.visible) {
        // Define sword hitbox size (larger than visual representation for better gameplay)
        const swordHitboxRadius = sword.length * 0.8; // Use 80% of sword length as hitbox
        
        // Check each sword for collisions
        for (const s of sword.swords) {
            const swordPos = {
                x: Math.cos(s.angle) * sword.distance,
                y: Math.sin(s.angle) * sword.distance
            };
            
            // Check for sword-asteroid collisions
            for (let i = 0; i < asteroids.length; i++) {
                const asteroid = asteroids[i];
                
                // Check collision with sword hitbox
                if (distance(swordPos.x, swordPos.y, asteroid.x, asteroid.y) < swordHitboxRadius + asteroid.radius) {
                    // Create explosion particles
                    createExplosion(asteroid.x, asteroid.y, false);
                    
                    // Increase score
                    score += 10 * asteroid.size;
                    if (scoreValue) scoreValue.textContent = score;
                    
                    // Remove the asteroid
                    asteroids.splice(i, 1);
                    i--; // Adjust index after removal
                    
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
                                size: asteroid.size - 1,
                                shapeType: Math.floor(Math.random() * 5) // Assign a random shape type (0-4)
                            });
                        }
                    }
                    
                    // Break after processing one collision
                    break;
                }
            }
            
            // Check for sword-mine collisions
            for (let i = 0; i < mines.length; i++) {
                const mine = mines[i];
                
                // Check collision with sword hitbox
                if (distance(swordPos.x, swordPos.y, mine.x, mine.y) < swordHitboxRadius + mine.radius) {
                    // Create mine explosion that affects nearby objects
                    const explosionRadius = 100; // Approximately 1 inch at typical screen resolution
                    createExplosion(mine.x, mine.y, true);
                    
                    // Increase score
                    score += 15 * mine.size; // Mines are worth more points
                    if (scoreValue) scoreValue.textContent = score;
                    
                    // Remove the mine that was hit
                    mines.splice(i, 1);
                    i--; // Adjust index after removal
                    
                    // Check for objects within explosion radius
                    checkMineExplosion(mine.x, mine.y, explosionRadius);
                    
                    // Break after processing one collision
                    break;
                }
            }
            
            // Check for sword-turret collisions
            for (let i = 0; i < turrets.length; i++) {
                const turret = turrets[i];
                
                // Check collision with sword hitbox
                if (distance(swordPos.x, swordPos.y, turret.x, turret.y) < swordHitboxRadius + turret.radius) {
                    // Create explosion particles for turret
                    createExplosion(turret.x, turret.y, false);
                    
                    // Increase score
                    score += 50; // Turrets are worth 50 points
                    if (scoreValue) scoreValue.textContent = score;
                    
                    // Remove the turret that was hit
                    turrets.splice(i, 1);
                    i--; // Adjust index after removal
                    
                    // Break after processing one collision
                    break;
                }
            }
            
            // Check for sword-army man collisions
            for (let i = 0; i < armyMen.length; i++) {
                const armyMan = armyMen[i];
                
                // Check collision with sword hitbox
                if (distance(swordPos.x, swordPos.y, armyMan.x, armyMan.y) < swordHitboxRadius + armyMan.radius) {
                    // Create explosion particles
                    createExplosion(armyMan.x, armyMan.y, false);
                    
                    // Increase score
                    score += 25; // Army men are worth 25 points
                    if (scoreValue) scoreValue.textContent = score;
                    
                    // Remove army man
                    armyMen.splice(i, 1);
                    i--; // Adjust index after removal
                    
                    // Break after processing one collision
                    break;
                }
            }
        }
    }
    
    // Check for ship-asteroid collisions (only if ship is not invincible and visible)
    if (!ship.invincible && ship.visible) {
        for (let i = 0; i < asteroids.length; i++) {
            const asteroid = asteroids[i];
            
            if (distance(0, 0, asteroid.x, asteroid.y) < ship.radius * shipSizeMultiplier + asteroid.radius) {
                // Create explosion particles for both ship and asteroid
                createExplosion(0, 0, false); // Ship explosion
                createExplosion(asteroid.x, asteroid.y, false); // Asteroid explosion
                
                // Increase score for destroying the asteroid
                score += 10 * asteroid.size;
                if (scoreValue) scoreValue.textContent = score;
                
                // Remove the asteroid that was collided with
                asteroids.splice(i, 1);
                
                // Lose a life
                // Check if force field is active to negate damage
                if (forceFieldActive) {
                    // Destroy force field instead of losing a life
                    forceFieldActive = false;
                    forceFieldLifetime = 0;
                    // Create visual effect for force field destruction
                    createExplosion(0, 0, false);
                } else {
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
                }
                
                // Process only one collision per frame
                break;
            }
        }
        
        // Check for ship-mine collisions (only if ship is not invincible and visible)
        for (let i = 0; i < mines.length; i++) {
            const mine = mines[i];
            
            if (distance(0, 0, mine.x, mine.y) < ship.radius * shipSizeMultiplier + mine.radius) {
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
                // Check if force field is active to negate damage
                if (forceFieldActive) {
                    // Destroy force field instead of losing a life
                    forceFieldActive = false;
                    forceFieldLifetime = 0;
                    // Create visual effect for force field destruction
                    createExplosion(0, 0, false);
                } else {
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
                }
                
                // Process only one collision per frame
                break;
            }
        }
        
        // Check for ship-army man collisions (only if ship is not invincible and visible)
        for (let i = 0; i < armyMen.length; i++) {
            const armyMan = armyMen[i];
            
            if (distance(0, 0, armyMan.x, armyMan.y) < ship.radius * shipSizeMultiplier + armyMan.radius) {
                // Create explosion particles for both ship and army man
                createExplosion(0, 0, false); // Ship explosion
                createExplosion(armyMan.x, armyMan.y, false); // Army man explosion
                
                // Increase score for destroying the army man
                score += 25; // Army men are worth 25 points
                if (scoreValue) scoreValue.textContent = score;
                
                // Remove the army man that was collided with
                armyMen.splice(i, 1);
                
                // Lose a life
                // Check if force field is active to negate damage
                if (forceFieldActive) {
                    // Destroy force field instead of losing a life
                    forceFieldActive = false;
                    forceFieldLifetime = 0;
                    // Create visual effect for force field destruction
                    createExplosion(0, 0, false);
                } else {
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
                    // Check if force field is active to negate damage
                    if (forceFieldActive) {
                        // Destroy force field instead of losing a life
                        forceFieldActive = false;
                        forceFieldLifetime = 0;
                        // Create visual effect for force field destruction
                        createExplosion(0, 0, false);
                    } else {
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
                    }
                    
                    // Process only one collision per frame
                    break;
                }
            }
        }
    }
    
    // Check for ship-powerup collisions (only if ship is visible)
    if (ship.visible) {
        for (let i = 0; i < powerups.length; i++) {
            const powerup = powerups[i];
            
            if (distance(0, 0, powerup.x, powerup.y) < ship.radius * shipSizeMultiplier + powerup.radius) {
                // Apply powerup effect based on type
                if (powerup.type === 'bulletSize') {
                    // Increase bullet size multiplier
                    bulletSizeMultiplier += 0.5;
                    
                    // Create visual effect
                    createExplosion(powerup.x, powerup.y, false);
                    
                    // Increase score
                    score += 50; // Powerups are worth 50 points
                    if (scoreValue) scoreValue.textContent = score;
                } else if (powerup.type === 'forceField') {
                    // Activate force field
                    forceFieldActive = true;
                    forceFieldLifetime = forceFieldMaxLifetime;
                    
                    // Create visual effect
                    createExplosion(powerup.x, powerup.y, false);
                    
                    // Increase score
                    score += 75; // Force field powerups are worth more points
                    if (scoreValue) scoreValue.textContent = score;
                } else if (powerup.type === 'shipSize') {
                    // Increase ship size multiplier
                    shipSizeMultiplier += 0.3;
                    
                    // Create visual effect
                    createExplosion(powerup.x, powerup.y, false);
                    
                    // Increase score
                    score += 60; // Ship size powerups are worth 60 points
                    if (scoreValue) scoreValue.textContent = score;
                } else if (powerup.type === 'sword') {
                    // Create or enhance orbiting sword
                    if (!sword) {
                        // Create first sword
                        sword = {
                            angle: 0, // Initial angle for orbit
                            distance: 30, // Distance from ship
                            radius: 5, // Size of the sword
                            orbitSpeed: 0.05, // Speed of orbit
                            length: 20, // Length of the sword
                            width: 3, // Width of the sword
                            count: 1, // Number of swords
                            swords: [{ angle: 0 }] // Array to hold multiple swords
                        };
                    } else {
                        // Add another sword on a random side
                        sword.count++;
                        const newAngle = Math.random() * Math.PI * 2; // Random angle
                        sword.swords.push({ angle: newAngle });
                        
                        // Add visual effect for stacking
                        createExplosion(powerup.x, powerup.y, false);
                    }
                    
                    // Increase score
                    score += 100; // Sword powerups are worth 100 points
                    if (scoreValue) scoreValue.textContent = score;
                } else if (powerup.type === 'speedBoost') {
                    // Apply speed boost effect
                    if (!speedBoostActive) {
                        speedBoostActive = true;
                        originalMaxSpeed = ship.maxSpeed; // Store original max speed
                        ship.maxSpeed = originalMaxSpeed * 1.25; // Increase speed by 25%
                        speedBoostTimer = 600; // 10 seconds at 60fps
                        
                        // Add visual effect
                        createExplosion(powerup.x, powerup.y, false);
                        
                        // Increase score
                        score += 75; // Speed boost powerups are worth 75 points
                        if (scoreValue) scoreValue.textContent = score;
                    }
                } else if (powerup.type === 'shipShape') {
                    // Change ship to a random shape for 20 seconds
                    // Store original shape if this is the first shape change
                    if (shipShapeTimer <= 0) {
                        originalShipShape = shipShape;
                    }
                    
                    const shapes = ['triangle', 'diamond', 'pentagon', 'hexagon', 'square'];
                    const randomIndex = Math.floor(Math.random() * shapes.length);
                    shipShape = shapes[randomIndex];
                    
                    // Set timer for 20 seconds (1200 frames at 60fps)
                    shipShapeTimer = 1200;
                    
                    // Add visual effect
                    createExplosion(powerup.x, powerup.y, false);
                    
                    // Increase score
                    score += 80; // Ship shape powerups are worth 80 points
                    if (scoreValue) scoreValue.textContent = score;
                } else if (powerup.type === 'shipDestroy') {
                    // Destroy the ship immediately
                    // Create a large explosion at the ship's position
                    createExplosion(0, 0, true); // Large explosion
                    
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
                        
                        // Make ship invincible for 3 seconds after respawn
                        ship.invincible = true;
                        ship.invincibilityTime = 180; // 3 seconds at 60fps
                    }
                    
                    // Create visual effect at powerup location
                    createExplosion(powerup.x, powerup.y, true); // Large explosion
                } else if (powerup.type === 'eatEverything') {
                    // Spawn a mouse that eats everything for 7 seconds
                    eatingMouse = {
                        x: 0, // Start at ship position
                        y: 0,
                        radius: 15,
                        speed: 3,
                        angle: 0,
                        target: null, // Current target to eat
                        eatTimer: 420 // 7 seconds at 60fps
                    };
                    
                    // Add visual effect
                    createExplosion(powerup.x, powerup.y, true); // Large explosion
                    
                    // Increase score
                    score += 200; // Eat everything powerups are worth 200 points
                    if (scoreValue) scoreValue.textContent = score;
                }
                
                // Remove the powerup
                powerups.splice(i, 1);
                
                // Process only one collision per frame
                break;
            }
        }
    }
    
    // Check for rose poison bullet collisions with army men
    for (const rose of roses) {
        for (let i = rose.poisonBullets.length - 1; i >= 0; i--) {
            const bullet = rose.poisonBullets[i];
            
            // Check for collisions with army men
            for (let j = 0; j < armyMen.length; j++) {
                const armyMan = armyMen[j];
                
                if (distance(bullet.x, bullet.y, armyMan.x, armyMan.y) < bullet.radius + armyMan.radius) {
                    // Create explosion particles for the destroyed army man
                    createExplosion(armyMan.x, armyMan.y, false);
                    
                    // Increase score
                    score += 25; // Army men are worth 25 points
                    if (scoreValue) scoreValue.textContent = score;
                    
                    // Remove army man
                    armyMen.splice(j, 1);
                    
                    // Remove the bullet
                    rose.poisonBullets.splice(i, 1);
                    
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
                        size: asteroid.size - 1,
                        shapeType: Math.floor(Math.random() * 5) // Assign a random shape type (0-4)
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

// Calculate the current position of the sword for collision detection
function getSwordPosition() {
    // Only calculate if sword exists
    if (!sword) return null;
    
    // For collision detection, we'll use the first sword's position
    // In a more advanced implementation, we might check all swords
    if (sword.swords.length > 0) {
        const firstSword = sword.swords[0];
        const swordX = Math.cos(firstSword.angle) * sword.distance;
        const swordY = Math.sin(firstSword.angle) * sword.distance;
        return { x: swordX, y: swordY };
    }
    
    return null;
}

// Destroy all enemies and objects
function destroyAllEnemies() {
    // Create explosions for all asteroids
    for (const asteroid of asteroids) {
        createExplosion(asteroid.x, asteroid.y, false);
        // Increase score for each asteroid
        score += 10 * asteroid.size;
    }
    
    // Create explosions for all mines
    for (const mine of mines) {
        createExplosion(mine.x, mine.y, true);
        // Increase score for each mine
        score += 15 * mine.size;
    }
    
    // Create explosions for all turrets
    for (const turret of turrets) {
        createExplosion(turret.x, turret.y, false);
        // Increase score for each turret
        score += 50;
    }
    
    // Create explosions for all army men
    for (const armyMan of armyMen) {
        createExplosion(armyMan.x, armyMan.y, false);
        // Increase score for each army man
        score += 25;
    }
    
    // Create explosions for all roses
    for (const rose of roses) {
        createExplosion(rose.x, rose.y, false);
        // Increase score for each rose
        score += 75;
    }
    
    // Update score display
    if (scoreValue) scoreValue.textContent = score;
    
    // Clear all enemy arrays
    asteroids = [];
    mines = [];
    turrets = [];
    armyMen = [];
    roses = [];
    
    // Clear rose poison bullets
    for (const rose of roses) {
        rose.poisonBullets = [];
    }
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
        
        // Draw powerups
        drawPowerups();
        
        // Draw roses
        drawRoses();
        
        // Draw eating mouse if active
        if (eatingMouse) {
            drawEatingMouse();
        }
        
        // Draw sword
        drawSword();
        
        // Draw ship at the center of the screen
        drawShipAtCenter();
        
        // Draw force field if active
        drawForceField();
        
        // Draw radar indicators for off-screen objects
        drawRadarIndicators();
    }
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
        
        // Use the predetermined shape type for consistency
        drawAsteroidShape(screenX, screenY, asteroid.radius, asteroid.shapeType);
    }
}

// Draw a unique asteroid shape
function drawAsteroidShape(x, y, radius, shapeType) {
    ctx.beginPath();
    
    switch (shapeType) {
        case 0: // Irregular polygon with 7-10 points
            drawIrregularPolygon(x, y, radius, 7 + Math.floor(Math.abs(Math.sin(x * 0.01)) * 4));
            break;
        case 1: // Rounded polygon with 5-8 points
            drawRoundedPolygon(x, y, radius, 5 + Math.floor(Math.abs(Math.cos(y * 0.01)) * 4));
            break;
        case 2: // Combination shape (circle with protrusions)
            drawCombinationShape(x, y, radius);
            break;
        case 3: // Jagged shape
            drawJaggedShape(x, y, radius);
            break;
        case 4: // Organic shape
            drawOrganicShape(x, y, radius);
            break;
    }
    
    ctx.stroke();
}

// Draw an irregular polygon with random variations
function drawIrregularPolygon(x, y, radius, points) {
    const angleStep = (Math.PI * 2) / points;
    
    for (let i = 0; i <= points; i++) {
        const angle = i * angleStep;
        // Add randomness to the radius
        const variation = 0.7 + Math.abs(Math.sin(x * y * 0.001 + i)) * 0.6;
        const r = radius * variation;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
}

// Draw a rounded polygon
function drawRoundedPolygon(x, y, radius, points) {
    const angleStep = (Math.PI * 2) / points;
    
    for (let i = 0; i <= points; i++) {
        const angle = i * angleStep;
        // Add smooth variations to the radius
        const variation = 0.8 + Math.sin(x * 0.01 + angle) * 0.2 + Math.cos(y * 0.01 + angle) * 0.2;
        const r = radius * variation;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
}

// Draw a combination shape (circle with protrusions)
function drawCombinationShape(x, y, radius) {
    const points = 8;
    const angleStep = (Math.PI * 2) / points;
    
    for (let i = 0; i <= points; i++) {
        const angle = i * angleStep;
        // Alternate between normal radius and extended radius
        const isProtrusion = i % 2 === 0;
        const r = isProtrusion ? radius * 1.3 : radius * 0.8;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
}

// Draw a jagged shape
function drawJaggedShape(x, y, radius) {
    const points = 12;
    const angleStep = (Math.PI * 2) / points;
    
    for (let i = 0; i <= points; i++) {
        const angle = i * angleStep;
        // Create sharp variations
        const variation = 0.6 + Math.abs(Math.sin(angle * 3)) * 0.8;
        const r = radius * variation;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
}

// Draw an organic shape
function drawOrganicShape(x, y, radius) {
    const points = 10;
    const angleStep = (Math.PI * 2) / points;
    
    // First pass - create base shape
    let pointsArray = [];
    for (let i = 0; i < points; i++) {
        const angle = i * angleStep;
        // Smooth organic variations
        const variation = 0.85 + Math.sin(x * 0.005 + angle) * 0.15 + Math.cos(y * 0.005 + angle) * 0.15;
        const r = radius * variation;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        pointsArray.push({x: px, y: py});
    }
    
    // Draw the shape using quadratic curves for smoothness
    if (pointsArray.length > 0) {
        ctx.moveTo(pointsArray[0].x, pointsArray[0].y);
        for (let i = 0; i < pointsArray.length; i++) {
            const current = pointsArray[i];
            const next = pointsArray[(i + 1) % pointsArray.length];
            const controlX = (current.x + next.x) / 2;
            const controlY = (current.y + next.y) / 2;
            ctx.quadraticCurveTo(controlX, controlY, next.x, next.y);
        }
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
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    for (const armyMan of armyMen) {
        // Calculate screen position relative to ship
        const screenX = armyMan.x - ship.x + canvas.width / 2;
        const screenY = armyMan.y - ship.y + canvas.height / 2;
        
        // Draw army man as a larger triangle pointing toward the player
        ctx.save();
        ctx.translate(screenX, screenY);
        
        // Calculate angle to player for rotation
        const dx = ship.x - armyMan.x;
        const dy = ship.y - armyMan.y;
        const angle = Math.atan2(dy, dx);
        ctx.rotate(angle);
        
        // Draw a larger triangle (increased from radius 8 to 12)
        ctx.beginPath();
        ctx.moveTo(armyMan.radius, 0);
        ctx.lineTo(-armyMan.radius, -armyMan.radius/1.5);
        ctx.lineTo(-armyMan.radius, armyMan.radius/1.5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

// Draw all powerups
function drawPowerups() {
    for (const powerup of powerups) {
        // Calculate screen position relative to ship
        const screenX = powerup.x - ship.x + canvas.width / 2;
        const screenY = powerup.y - ship.y + canvas.height / 2;
        
        // Pulsing effect
        const pulseSize = Math.sin(powerup.pulse) * 3;
        
        ctx.save();
        ctx.translate(screenX, screenY);
        
        // Draw powerup based on type
        if (powerup.type === 'bulletSize') {
            // Draw bullet size powerup as a star shape (yellow)
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
                const outerX = Math.cos(angle) * (powerup.radius + pulseSize);
                const outerY = Math.sin(angle) * (powerup.radius + pulseSize);
                if (i === 0) {
                    ctx.moveTo(outerX, outerY);
                } else {
                    ctx.lineTo(outerX, outerY);
                }
                
                const innerAngle = ((i + 0.5) * 2 * Math.PI / 5) - Math.PI / 2;
                const innerRadius = (powerup.radius + pulseSize) * 0.5;
                const innerX = Math.cos(innerAngle) * innerRadius;
                const innerY = Math.sin(innerAngle) * innerRadius;
                ctx.lineTo(innerX, innerY);
            }
            ctx.closePath();
            ctx.stroke();
        } else if (powerup.type === 'forceField') {
            // Draw force field powerup as a circle with inner circle (blue)
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, powerup.radius + pulseSize, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw inner circle
            ctx.beginPath();
            ctx.arc(0, 0, (powerup.radius + pulseSize) * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        } else if (powerup.type === 'shipSize') {
            // Draw ship size powerup as a triangle (cyan)
            ctx.strokeStyle = 'cyan';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -(powerup.radius + pulseSize)); // Top point
            ctx.lineTo(-(powerup.radius + pulseSize), (powerup.radius + pulseSize)); // Bottom left
            ctx.lineTo((powerup.radius + pulseSize), (powerup.radius + pulseSize)); // Bottom right
            ctx.closePath();
            ctx.stroke();
        } else if (powerup.type === 'sword') {
            // Draw sword powerup as a crossed swords (silver/gray)
            ctx.strokeStyle = 'silver';
            ctx.lineWidth = 2;
            
            // Draw first sword (vertical)
            ctx.beginPath();
            ctx.moveTo(0, -(powerup.radius + pulseSize)); // Top
            ctx.lineTo(0, (powerup.radius + pulseSize)); // Bottom
            ctx.stroke();
            
            // Draw cross guard
            ctx.beginPath();
            ctx.moveTo(-(powerup.radius + pulseSize) * 0.7, 0);
            ctx.lineTo((powerup.radius + pulseSize) * 0.7, 0);
            ctx.stroke();
            
            // Draw second sword (horizontal)
            ctx.beginPath();
            ctx.moveTo(-(powerup.radius + pulseSize) * 0.7, (powerup.radius + pulseSize) * 0.7);
            ctx.lineTo((powerup.radius + pulseSize) * 0.7, -(powerup.radius + pulseSize) * 0.7);
            ctx.stroke();
        } else if (powerup.type === 'speedBoost') {
            // Draw speed boost powerup as a lightning bolt (red)
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            
            // Draw lightning bolt shape
            ctx.beginPath();
            ctx.moveTo(0, -(powerup.radius + pulseSize)); // Top
            ctx.lineTo(-(powerup.radius + pulseSize) * 0.5, 0); // Left middle
            ctx.lineTo(0, (powerup.radius + pulseSize) * 0.3); // Center
            ctx.lineTo(-(powerup.radius + pulseSize) * 0.3, (powerup.radius + pulseSize) * 0.5); // Lower left
            ctx.lineTo((powerup.radius + pulseSize) * 0.5, 0); // Right middle
            ctx.lineTo(0, -(powerup.radius + pulseSize) * 0.3); // Center
            ctx.closePath();
            ctx.stroke();
        } else if (powerup.type === 'shipShape') {
            // Draw ship shape powerup as a multi-pointed star (purple)
            ctx.strokeStyle = 'purple';
            ctx.lineWidth = 2;
            
            // Draw an 8-pointed star
            const outerRadius = powerup.radius + pulseSize;
            const innerRadius = (powerup.radius + pulseSize) * 0.5;
            
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI / 4) - Math.PI / 2;
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        } else if (powerup.type === 'shipDestroy') {
            // Draw ship destroy powerup as a skull and crossbones (black/white)
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            
            // Draw skull (circle for head)
            ctx.beginPath();
 
           ctx.arc(0, -2, powerup.radius * 0.6, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw crossbones (two crossed lines)
            ctx.beginPath();
            ctx.moveTo(-powerup.radius * 0.8, powerup.radius * 0.2);
            ctx.lineTo(powerup.radius * 0.8, powerup.radius * 0.8);
            ctx.moveTo(powerup.radius * 0.8, powerup.radius * 0.2);
            ctx.lineTo(-powerup.radius * 0.8, powerup.radius * 0.8);
            ctx.stroke();
            
            // Draw warning circle around the skull
            ctx.strokeStyle = 'red';
            ctx.setLineDash([3, 3]); // Dashed line for warning
            ctx.beginPath();
            ctx.arc(0, 0, powerup.radius + pulseSize, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
        } else if (powerup.type === 'eatEverything') {
            // Draw eat everything powerup as a cute mouse (gray with pink ears and nose)
            ctx.strokeStyle = 'gray';
            ctx.fillStyle = 'gray';
            ctx.lineWidth = 2;
            
            // Draw mouse body (circle)
            ctx.beginPath();
            ctx.arc(0, 0, powerup.radius + pulseSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Draw ears (two small circles)
            ctx.fillStyle = 'pink';
            ctx.beginPath();
            ctx.arc(-powerup.radius * 0.6, -powerup.radius * 0.6, powerup.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(powerup.radius * 0.6, -powerup.radius * 0.6, powerup.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Draw nose (small black circle)
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(0, powerup.radius * 0.2, powerup.radius * 0.2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw eyes (two small white circles with black pupils)
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(-powerup.radius * 0.4, -powerup.radius * 0.2, powerup.radius * 0.25, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(powerup.radius * 0.4, -powerup.radius * 0.2, powerup.radius * 0.25, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Draw pupils
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(-powerup.radius * 0.4, -powerup.radius * 0.2, powerup.radius * 0.1, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(powerup.radius * 0.4, -powerup.radius * 0.2, powerup.radius * 0.1, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw tail (curved line)
            ctx.strokeStyle = 'gray';
            ctx.beginPath();
            ctx.moveTo(powerup.radius * 0.8, powerup.radius * 0.3);
            ctx.bezierCurveTo(
                powerup.radius * 1.2, powerup.radius * 0.5,
                powerup.radius * 1.2, -powerup.radius * 0.5,
                powerup.radius * 0.8, -powerup.radius * 0.3
            );
            ctx.stroke();
        }
        ctx.restore();
    }
}

// Draw all roses
function drawRoses() {
    ctx.strokeStyle = 'pink';
    ctx.lineWidth = 2;
    for (const rose of roses) {
        // Calculate screen position relative to ship
        const screenX = rose.x - ship.x + canvas.width / 2;
        const screenY = rose.y - ship.y + canvas.height / 2;
        
        // Draw rose as a circle with petal details
        ctx.beginPath();
        ctx.arc(screenX, screenY, rose.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw rotating petals
        for (let i = 0; i < rose.petalCount; i++) {
            const angle = rose.petalAngles[i];
            const petalDistance = rose.radius * 1.5;
            const petalX = screenX + Math.cos(angle) * petalDistance;
            const petalY = screenY + Math.sin(angle) * petalDistance;
            
            ctx.beginPath();
            ctx.arc(petalX, petalY, rose.radius * 0.7, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw rose poison bullets
        ctx.fillStyle = 'green';
        for (const bullet of rose.poisonBullets) {
            // Calculate screen position relative to ship
            const screenX = bullet.x - ship.x + canvas.width / 2;
            const screenY = bullet.y - ship.y + canvas.height / 2;
            
            ctx.beginPath();
            ctx.arc(screenX, screenY, bullet.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Draw rose poison bullets
function drawRosePoisonBullets(rose) {
    ctx.fillStyle = 'green';
    for (const bullet of rose.poisonBullets) {
        // Calculate screen position relative to ship
        const screenX = bullet.x - ship.x + canvas.width / 2;
        const screenY = bullet.y - ship.y + canvas.height / 2;
        
        ctx.beginPath();
        ctx.arc(screenX, screenY, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
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
    
    // Draw ship based on current shape with size based on multiplier
    let strokeStyle = 'white';
    
    // If ship is invincible, make it blink
    if (ship.invincible && Math.floor(ship.invincibilityTime / 5) % 2 === 0) {
        strokeStyle = 'rgba(255, 255, 255, 0.5)';
    }
    
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const size = ship.radius * shipSizeMultiplier;
    
    switch (shipShape) {
        case 'triangle':
            // Default triangle shape
            ctx.moveTo(size, 0); // Nose of the ship
            ctx.lineTo(-size, -size * 0.7); // Rear left
            ctx.lineTo(-size, size * 0.7); // Rear right
            break;
            
        case 'diamond':
            // Diamond shape
            ctx.moveTo(0, -size); // Top
            ctx.lineTo(size, 0); // Right
            ctx.lineTo(0, size); // Bottom
            ctx.lineTo(-size, 0); // Left
            break;
            
        case 'pentagon':
            // Pentagon shape
            for (let i = 0; i < 5; i++) {
                const angle = (i * Math.PI * 2 / 5) - Math.PI / 2;
                const x = Math.cos(angle) * size;
                const y = Math.sin(angle) * size;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            break;
            
        case 'hexagon':
            // Hexagon shape
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI * 2 / 6) - Math.PI / 2;
                const x = Math.cos(angle) * size;
                const y = Math.sin(angle) * size;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            break;
            
        case 'square':
            // Square shape
            ctx.moveTo(-size, -size); // Top left
            ctx.lineTo(size, -size); // Top right
            ctx.lineTo(size, size); // Bottom right
            ctx.lineTo(-size, size); // Bottom left
            break;
    }
    
    ctx.closePath();
    ctx.stroke();
    
    // Draw speed boost indicator if active
    if (speedBoostActive) {
        // Draw a red glow around the ship
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, ship.radius * shipSizeMultiplier * 1.5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw small speed lines trailing behind the ship
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const angle = Math.PI + (Math.random() - 0.5) * 0.5; // Behind the ship with some variation
            const length = 10 + Math.random() * 10;
            ctx.beginPath();
            ctx.moveTo(-ship.radius * shipSizeMultiplier, 0);
            ctx.lineTo(-ship.radius * shipSizeMultiplier - Math.cos(angle) * length, -Math.sin(angle) * length);
            ctx.stroke();
        }
    }
    
    ctx.restore();
}

// Draw force field around ship
function drawForceField() {
    if (!forceFieldActive || forceFieldLifetime <= 0) return;
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Calculate alpha based on remaining lifetime (pulse effect)
    const alpha = 0.3 + 0.2 * Math.sin(forceFieldLifetime / 10);
    
    // Draw force field circle with size based on ship size multiplier
    ctx.strokeStyle = `rgba(0, 100, 255, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]); // Dashed line
    ctx.beginPath();
    ctx.arc(0, 0, forceFieldRadius * shipSizeMultiplier, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash
    
    ctx.restore();
}

// Draw radar indicators for off-screen objects
function drawRadarIndicators() {
    // Draw indicators for asteroids
    for (const asteroid of asteroids) {
        drawRadarIndicator(asteroid.x, asteroid.y, 'white');
    }
    
    // Draw indicators for mines
    for (const mine of mines) {
        drawRadarIndicator(mine.x, mine.y, 'red');
    }
    
    // Draw indicators for turrets
    for (const turret of turrets) {
        drawRadarIndicator(turret.x, turret.y, 'green');
    }
    
    // Draw indicators for army men
    for (const armyMan of armyMen) {
        drawRadarIndicator(armyMan.x, armyMan.y, 'red');
    }
}

// Draw the eating mouse
function drawEatingMouse() {
    if (!eatingMouse) return;
    
    // Calculate screen position relative to ship
    const screenX = eatingMouse.x - ship.x + canvas.width / 2;
    const screenY = eatingMouse.y - ship.y + canvas.height / 2;
    
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(eatingMouse.angle);
    
    // Draw mouse body (circle)
    ctx.fillStyle = 'gray';
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, eatingMouse.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw ears (two small circles)
    ctx.fillStyle = 'pink';
    ctx.beginPath();
    ctx.arc(-eatingMouse.radius * 0.6, -eatingMouse.radius * 0.6, eatingMouse.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(eatingMouse.radius * 0.6, -eatingMouse.radius * 0.6, eatingMouse.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw nose (small black circle)
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(0, eatingMouse.radius * 0.2, eatingMouse.radius * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eyes (two small white circles with black pupils)
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(-eatingMouse.radius * 0.4, -eatingMouse.radius * 0.2, eatingMouse.radius * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(eatingMouse.radius * 0.4, -eatingMouse.radius * 0.2, eatingMouse.radius * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-eatingMouse.radius * 0.4, -eatingMouse.radius * 0.2, eatingMouse.radius * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(eatingMouse.radius * 0.4, -eatingMouse.radius * 0.2, eatingMouse.radius * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw tail (curved line)
    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(eatingMouse.radius * 0.8, eatingMouse.radius * 0.3);
    ctx.bezierCurveTo(
        eatingMouse.radius * 1.2, eatingMouse.radius * 0.5,
        eatingMouse.radius * 1.2, -eatingMouse.radius * 0.5,
        eatingMouse.radius * 0.8, -eatingMouse.radius * 0.3
    );
    ctx.stroke();
    
    ctx.restore();
}

// Draw eat everything effect
function drawEatEverythingEffect() {
    // Draw a pulsing green circle around the ship
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Calculate pulse effect
    const pulse = Math.sin(Date.now() / 100) * 0.5 + 0.5;
    const radius = 50 + pulse * 20;
    
    // Draw multiple circles for a wave effect
    for (let i = 0; i < 3; i++) {
        const alpha = (1 - i * 0.3) * 0.7;
        const currentRadius = radius - i * 15;
        
        ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.restore();
}

// Update the eating mouse
function updateEatingMouse() {
    if (!eatingMouse) return;
    
    // Decrement the timer
    eatingMouse.eatTimer--;
    
    // Find the closest target if we don't have one or if current target is gone
    if (!eatingMouse.target || 
        (eatingMouse.target.type === 'asteroid' && !asteroids.includes(eatingMouse.target.object)) ||
        (eatingMouse.target.type === 'mine' && !mines.includes(eatingMouse.target.object)) ||
        (eatingMouse.target.type === 'turret' && !turrets.includes(eatingMouse.target.object)) ||
        (eatingMouse.target.type === 'armyMan' && !armyMen.includes(eatingMouse.target.object)) ||
        (eatingMouse.target.type === 'rose' && !roses.includes(eatingMouse.target.object))) {
        
        eatingMouse.target = findClosestTarget();
    }
    
    // Move toward the target
    if (eatingMouse.target) {
        const dx = eatingMouse.target.x - eatingMouse.x;
        const dy = eatingMouse.target.y - eatingMouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 2) { // If not close enough to target
            // Move toward target
            eatingMouse.x += (dx / distance) * eatingMouse.speed;
            eatingMouse.y += (dy / distance) * eatingMouse.speed;
            
            // Update angle to face target
            eatingMouse.angle = Math.atan2(dy, dx);
        } else {
            // Eat the target
            eatTarget(eatingMouse.target);
            eatingMouse.target = null;
        }
    }
    
    // Remove mouse when timer expires
    if (eatingMouse.eatTimer <= 0) {
        eatingMouse = null;
    }
}

// Find the closest target for the eating mouse
function findClosestTarget() {
    let closestTarget = null;
    let closestDistance = Infinity;
    
    // Check asteroids
    for (const asteroid of asteroids) {
        const dx = asteroid.x - eatingMouse.x;
        const dy = asteroid.y - eatingMouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestTarget = { type: 'asteroid', object: asteroid, x: asteroid.x, y: asteroid.y };
        }
    }
    
    // Check mines
    for (const mine of mines) {
        const dx = mine.x - eatingMouse.x;
        const dy = mine.y - eatingMouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestTarget = { type: 'mine', object: mine, x: mine.x, y: mine.y };
        }
    }
    
    // Check turrets
    for (const turret of turrets) {
        const dx = turret.x - eatingMouse.x;
        const dy = turret.y - eatingMouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestTarget = { type: 'turret', object: turret, x: turret.x, y: turret.y };
        }
    }
    
    // Check army men
    for (const armyMan of armyMen) {
        const dx = armyMan.x - eatingMouse.x;
        const dy = armyMan.y - eatingMouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestTarget = { type: 'armyMan', object: armyMan, x: armyMan.x, y: armyMan.y };
        }
    }
    
    // Check roses
    for (const rose of roses) {
        const dx = rose.x - eatingMouse.x;
        const dy = rose.y - eatingMouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestTarget = { type: 'rose', object: rose, x: rose.x, y: rose.y };
        }
    }
    
    return closestTarget;
}

// Eat a target
function eatTarget(target) {
    if (!target) return;
    
    switch (target.type) {
        case 'asteroid':
            // Find and remove the asteroid
            const asteroidIndex = asteroids.indexOf(target.object);
            if (asteroidIndex !== -1) {
                createExplosion(target.object.x, target.object.y, false);
                score += 10 * target.object.size;
                asteroids.splice(asteroidIndex, 1);
                
                // If asteroid is large enough, split it
                if (target.object.size > 1) {
                    for (let k = 0; k < 2; k++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 2 + 1;
                        const velocityX = Math.cos(angle) * speed;
                        const velocityY = Math.sin(angle) * speed;
                        
                        asteroids.push({
                            x: target.object.x,
                            y: target.object.y,
                            radius: (target.object.size - 1) * 10,
                            velocity: { x: velocityX, y: velocityY },
                            size: target.object.size - 1,
                            shapeType: Math.floor(Math.random() * 5)
                        });
                    }
                }
            }
            break;
            
        case 'mine':
            // Find and remove the mine
            const mineIndex = mines.indexOf(target.object);
            if (mineIndex !== -1) {
                createExplosion(target.object.x, target.object.y, true);
                score += 15 * target.object.size;
                mines.splice(mineIndex, 1);
                
                // Check for objects within explosion radius
                checkMineExplosion(target.object.x, target.object.y, 100);
            }
            break;
            
        case 'turret':
            // Find and remove the turret
            const turretIndex = turrets.indexOf(target.object);
            if (turretIndex !== -1) {
                createExplosion(target.object.x, target.object.y, false);
                score += 50;
                turrets.splice(turretIndex, 1);
            }
            break;
            
        case 'armyMan':
            // Find and remove the army man
            const armyManIndex = armyMen.indexOf(target.object);
            if (armyManIndex !== -1) {
                createExplosion(target.object.x, target.object.y, false);
                score += 25;
                armyMen.splice(armyManIndex, 1);
            }
            break;
            
        case 'rose':
            // Find and remove the rose
            const roseIndex = roses.indexOf(target.object);
            if (roseIndex !== -1) {
                createExplosion(target.object.x, target.object.y, false);
                score += 75;
                roses.splice(roseIndex, 1);
            }
            break;
    }
    
    // Update score display
    if (scoreValue) scoreValue.textContent = score;
}

// Draw the orbiting sword
function drawSword() {
    // Only draw if sword exists and ship is visible (not dead)
    if (!sword || (ship && !ship.visible)) return;
    
    // Draw each sword
    for (const s of sword.swords) {
        // Calculate sword position based on orbit around the ship
        // The ship is always at the center of the screen (canvas.width/2, canvas.height/2)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Calculate sword position based on orbit angle and distance
        const swordX = centerX + Math.cos(s.angle) * sword.distance;
        const swordY = centerY + Math.sin(s.angle) * sword.distance;
        
        // Draw the sword as a rectangle (blade) with a triangular hilt
        ctx.save();
        
        // Rotate the sword to face outward from the ship
        ctx.translate(swordX, swordY);
        ctx.rotate(s.angle);
        
        // Draw sword blade (rectangle)
        ctx.fillStyle = 'silver';
        ctx.fillRect(-sword.length / 2, -sword.width / 2, sword.length, sword.width);
        
        // Draw sword hilt (rectangle)
        ctx.fillStyle = 'goldenrod';
        ctx.fillRect(-sword.length / 2 - 5, -sword.width, 5, sword.width * 2);
        
        // Draw sword pommel (circle)
        ctx.fillStyle = 'gold';
        ctx.beginPath();
        ctx.arc(-sword.length / 2 - 5, 0, sword.width, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Draw a radar indicator for an off-screen object
function drawRadarIndicator(worldX, worldY, color) {
    // Calculate screen position relative to ship
    const screenX = worldX - ship.x + canvas.width / 2;
    const screenY = worldY - ship.y + canvas.height / 2;
    
    // Check if object is on screen
    const margin = 50; // Margin around screen edges
    if (screenX >= -margin && screenX <= canvas.width + margin && 
        screenY >= -margin && screenY <= canvas.height + margin) {
        return; // Object is on screen or very close, no indicator needed
    }
    
    // Calculate direction from center of screen to object
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = screenX - centerX;
    const dy = screenY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize direction
    const dirX = dx / distance;
    const dirY = dy / distance;
    
    // Position indicator at edge of screen with some margin
    const indicatorMargin = 30;
    let indicatorX = centerX + dirX * (Math.min(canvas.width, canvas.height) / 2 - indicatorMargin);
    let indicatorY = centerY + dirY * (Math.min(canvas.width, canvas.height) / 2 - indicatorMargin);
    
    // Keep indicator within screen bounds with margin
    indicatorX = Math.max(indicatorMargin, Math.min(canvas.width - indicatorMargin, indicatorX));
    indicatorY = Math.max(indicatorMargin, Math.min(canvas.height - indicatorMargin, indicatorY));
    
    // Draw arrow pointing toward object
    ctx.save();
    ctx.translate(indicatorX, indicatorY);
    ctx.rotate(Math.atan2(dirY, dirX));
    
    // Draw arrow
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(15, 0); // Arrow shaft
    ctx.moveTo(15, 0);
    ctx.lineTo(10, -5); // Arrowhead
    ctx.moveTo(15, 0);
    ctx.lineTo(10, 5); // Arrowhead
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
    if (finalWaveElement) finalWaveElement.textContent = waveNumber;
    if (gameOverScreen) {
        console.log('Showing game over screen');
        gameOverScreen.classList.add('show');
        // Also set display explicitly to ensure visibility
        gameOverScreen.style.display = 'flex';
    } else {
        console.log('gameOverScreen element not found');
    }
}

// Win the game
function winGame() {
    console.log('winGame() called');
    gameOver = true;
    saveHighScore();
    
    // Show win message
    if (finalScoreElement) finalScoreElement.textContent = score;
    if (finalHighScoreElement) finalHighScoreElement.textContent = highScore;
    if (finalWaveElement) finalWaveElement.textContent = "15 - VICTORY!";
    
    // Create win screen or modify existing game over screen
    const gameOverTitle = document.querySelector('#gameOverScreen h2');
    if (gameOverTitle) {
        gameOverTitle.textContent = 'VICTORY!';
        gameOverTitle.style.textShadow = '0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0';
    }
    
    const gameOverMessage = document.querySelector('#gameOverScreen p:first-of-type');
    if (gameOverMessage) {
        gameOverMessage.innerHTML = 'You have defeated all waves!<br>Congratulations, you are the champion!';
    }
    
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
        restartButton.textContent = 'Play Again';
    }
    
    if (gameOverScreen) {
        console.log('Showing win screen');
        gameOverScreen.classList.add('show');
        // Also set display explicitly to ensure visibility
        gameOverScreen.style.display = 'flex';
    } else {
        console.log('gameOverScreen element not found');
    }
}

// Start the game when page loads
window.onload = init;