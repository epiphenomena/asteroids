// Simple test to verify our fixes
console.log('Testing fixes for wave spawning and turret collision issues...');

// Mock browser-specific objects
globalThis.document = {
    getElementById: (id) => {
        if (id === 'gameCanvas') {
            return {
                width: 800,
                height: 600,
                getContext: () => ({
                    fillRect: () => {},
                    fill: () => {},
                    stroke: () => {},
                    beginPath: () => {},
                    moveTo: () => {},
                    lineTo: () => {},
                    arc: () => {},
                    closePath: () => {},
                    setLineDash: () => {}
                })
            };
        }
        return null;
    }
};

globalThis.window = {
    requestAnimationFrame: (callback) => setTimeout(callback, 16),
    addEventListener: () => {}
};

// Mock required functions and variables
globalThis.canvas = globalThis.document.getElementById('gameCanvas');
globalThis.ship = { x: 0, y: 0, radius: 10 };
globalThis.asteroids = [];
globalThis.mines = [];
globalThis.turrets = [];
globalThis.armyMen = [];
globalThis.karateMen = [];
globalThis.bullets = [];
globalThis.particles = [];
globalThis.powerups = [];
globalThis.roses = [];
globalThis.feet = [];
globalThis.waveNumber = 1;
globalThis.score = 0;
globalThis.gameOver = false;
globalThis.lives = 3;

// Mock required functions
globalThis.createExplosion = () => {};
globalThis.checkMineExplosion = () => {};
globalThis.distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
globalThis.createAsteroids = (count) => {
    for (let i = 0; i < count; i++) {
        globalThis.createAsteroid();
    }
};
globalThis.createArmyMenGroup = (count) => {
    for (let i = 0; i < count; i++) {
        globalThis.createArmyMan();
    }
};
globalThis.createKarateMenGroup = (count) => {
    for (let i = 0; i < count; i++) {
        globalThis.createKarateMan();
    }
};
globalThis.createPowerup = () => {
    globalThis.powerups.push({ x: 100, y: 100, radius: 12, type: 'bulletSize', pulse: 0 });
};
globalThis.createForceFieldPowerup = () => {
    globalThis.powerups.push({ x: 200, y: 200, radius: 12, type: 'forceField', pulse: 0 });
};
globalThis.createRose = () => {
    globalThis.roses.push({ 
        x: 150, y: 150, radius: 15, 
        poisonCooldown: 0, maxPoisonCooldown: 300, 
        poisonBullets: [], petalCount: 8, petalAngles: [0, 0, 0, 0, 0, 0, 0, 0] 
    });
};
globalThis.createFoot = () => {
    globalThis.feet.push({ 
        x: 0, y: 0, worldX: 250, worldY: 250, 
        radius: 60, stampCooldown: 0, maxStampCooldown: 180, stampEffect: 0 
    });
};
globalThis.setTimeout = (callback) => setTimeout(callback, 0);

// Import the functions we need to test
const fs = require('fs');

// Read the script file
let scriptContent = fs.readFileSync('/home/unveiled/gh/asteroids/script.js', 'utf8');

// Remove browser-specific initialization code that we don't need for testing
scriptContent = scriptContent.replace('window.onload = init;', '');

// Create a context with our mock variables
const context = {
    ...globalThis,
    console: console
};

// Evaluate the script in our context
eval(scriptContent);

// Test our fixes
console.log('Testing wave spawning fixes...');

// Test createAsteroid function
console.log('Testing createAsteroid function...');
globalThis.createAsteroid();

if (globalThis.asteroids.length > 0) {
    const asteroid = globalThis.asteroids[0];
    const distance = globalThis.distance(0, 0, asteroid.x, asteroid.y);
    console.log(`Asteroid spawned at distance: ${distance}`);
    if (distance >= 300) {
        console.log('✓ Asteroid spawned at safe distance');
    } else {
        console.log('✗ Asteroid spawned too close');
    }
} else {
    console.log('✗ Failed to create asteroid');
}

// Test createArmyMan function
console.log('Testing createArmyMan function...');
globalThis.createArmyMan();

if (globalThis.armyMen.length > 0) {
    const armyMan = globalThis.armyMen[0];
    const distance = globalThis.distance(0, 0, armyMan.x, armyMan.y);
    console.log(`Army man spawned at distance: ${distance}`);
    if (distance >= 300) {
        console.log('✓ Army man spawned at safe distance');
    } else {
        console.log('✗ Army man spawned too close');
    }
} else {
    console.log('✗ Failed to create army man');
}

// Test createKarateMan function
console.log('Testing createKarateMan function...');
globalThis.createKarateMan();

if (globalThis.karateMen.length > 0) {
    const karateMan = globalThis.karateMen[0];
    const distance = globalThis.distance(0, 0, karateMan.x, karateMan.y);
    console.log(`Karate man spawned at distance: ${distance}`);
    if (distance >= 300) {
        console.log('✓ Karate man spawned at safe distance');
    } else {
        console.log('✗ Karate man spawned too close');
    }
} else {
    console.log('✗ Failed to create karate man');
}

// Test createTurret function
console.log('Testing createTurret function...');
globalThis.createTurret();

if (globalThis.turrets.length > 0) {
    const turret = globalThis.turrets[0];
    const distance = globalThis.distance(0, 0, turret.x, turret.y);
    console.log(`Turret spawned at distance: ${distance}`);
    if (distance >= 250) {
        console.log('✓ Turret spawned at safe distance');
    } else {
        console.log('✗ Turret spawned too close');
    }
} else {
    console.log('✗ Failed to create turret');
}

// Test spawnWaveEnemies function
console.log('Testing spawnWaveEnemies function...');
globalThis.asteroids = [];
globalThis.mines = [];
globalThis.turrets = [];
globalThis.armyMen = [];
globalThis.karateMen = [];
globalThis.powerups = [];
globalThis.roses = [];
globalThis.feet = [];

globalThis.spawnWaveEnemies();

console.log(`After spawning wave: ${globalThis.waveNumber}`);
console.log(`Asteroids: ${globalThis.asteroids.length}`);
console.log(`Mines: ${globalThis.mines.length}`);
console.log(`Turrets: ${globalThis.turrets.length}`);
console.log(`Army men: ${globalThis.armyMen.length}`);
console.log(`Karate men: ${globalThis.karateMen.length}`);
console.log(`Powerups: ${globalThis.powerups.length}`);
console.log(`Roses: ${globalThis.roses.length}`);
console.log(`Feet: ${globalThis.feet.length}`);

// Check if ship is made invincible
if (globalThis.ship && globalThis.ship.invincible) {
    console.log('✓ Ship made invincible when wave spawned');
} else {
    console.log('✗ Ship not made invincible when wave spawned');
}

console.log('All tests completed');