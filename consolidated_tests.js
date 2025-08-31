// Consolidated Test Suite for Asteroids Game
console.log('Consolidated test suite loaded');

// Test all game features
function testAllFeatures() {
    console.log('Testing all game features...');
    
    // Test core game functions
    testCoreFunctions();
    
    // Test object creation
    testObjectCreation();
    
    // Test rendering functions
    testRendering();
    
    // Test update functions
    testUpdates();
    
    // Test collision detection
    testCollisions();
    
    // Test powerups
    testPowerups();
    
    // Test helpers
    testHelpers();
    
    // Test wave system
    testWaveSystem();
}

// Test core game functions
function testCoreFunctions() {
    console.log('Testing core game functions...');
    
    // Check if essential functions exist
    const coreFunctions = [
        'init', 'resetGame', 'gameLoop', 'update', 'render',
        'handleControls', 'updateShip', 'updateBullets', 'updateAsteroids',
        'updateMines', 'updateTurrets', 'updateArmyMen', 'updatePowerups',
        'updateRoses', 'updateParticles', 'updateWaves', 'updateForceField',
        'checkCollisions', 'splitAsteroid', 'checkMineExplosion',
        'createExplosion', 'distance', 'fireBullet', 'fireTurretBullet',
        'fireRosePoisonBullet', 'createThrustParticles', 'winGame', 'endGame'
    ];
    
    for (const func of coreFunctions) {
        if (typeof window[func] !== 'undefined') {
            console.log(`✓ ${func} function exists`);
        } else {
            console.log(`✗ ${func} function does not exist`);
        }
    }
}

// Test object creation
function testObjectCreation() {
    console.log('Testing object creation...');
    
    // Test asteroids
    if (typeof createAsteroid !== 'undefined' && typeof createAsteroids !== 'undefined') {
        console.log('✓ Asteroid creation functions exist');
        const initialCount = asteroids.length;
        createAsteroids(2);
        setTimeout(() => {
            if (asteroids.length >= initialCount + 2) {
                console.log('✓ Asteroids created successfully');
            } else {
                console.log('! Asteroid creation may have issues');
            }
        }, 500);
    } else {
        console.log('✗ Asteroid creation functions do not exist');
    }
    
    // Test turrets
    if (typeof createTurret !== 'undefined') {
        console.log('✓ Turret creation function exists');
        const initialCount = turrets.length;
        createTurret();
        setTimeout(() => {
            if (turrets.length > initialCount) {
                console.log('✓ Turrets created successfully');
            } else {
                console.log('! Turret creation may have issues');
            }
        }, 500);
    } else {
        console.log('✗ Turret creation function does not exist');
    }
    
    // Test army men
    if (typeof createArmyMan !== 'undefined' && typeof createArmyMenGroup !== 'undefined') {
        console.log('✓ Army men creation functions exist');
        const initialCount = armyMen.length;
        createArmyMenGroup(3);
        setTimeout(() => {
            if (armyMen.length >= initialCount + 3) {
                console.log('✓ Army men created successfully');
            } else {
                console.log('! Army men creation may have issues');
            }
        }, 500);
    } else {
        console.log('✗ Army men creation functions do not exist');
    }
    
    // Test powerups
    if (typeof createPowerup !== 'undefined' && typeof createForceFieldPowerup !== 'undefined') {
        console.log('✓ Powerup creation functions exist');
        const initialCount = powerups.length;
        createPowerup();
        setTimeout(() => {
            if (powerups.length > initialCount) {
                console.log('✓ Bullet size powerups created successfully');
            } else {
                console.log('! Bullet size powerup creation may have issues');
            }
        }, 500);
        
        const initialForceFieldCount = powerups.length;
        createForceFieldPowerup();
        setTimeout(() => {
            if (powerups.length > initialForceFieldCount) {
                console.log('✓ Force field powerups created successfully');
            } else {
                console.log('! Force field powerup creation may have issues');
            }
        }, 500);
    } else {
        console.log('✗ Powerup creation functions do not exist');
    }
    
    // Test roses
    if (typeof createRose !== 'undefined') {
        console.log('✓ Rose creation function exists');
        const initialCount = roses.length;
        createRose();
        setTimeout(() => {
            if (roses.length > initialCount) {
                console.log('✓ Roses created successfully');
            } else {
                console.log('! Rose creation may have issues');
            }
        }, 500);
    } else {
        console.log('✗ Rose creation function does not exist');
    }
}

// Test rendering functions
function testRendering() {
    console.log('Testing rendering functions...');
    
    // Test drawing functions
    const drawFunctions = [
        'drawShipAtCenter', 'drawBullets', 'drawAsteroids', 'drawMines',
        'drawTurrets', 'drawArmyMen', 'drawPowerups', 'drawRoses',
        'drawParticles', 'drawRadarIndicators', 'drawForceField'
    ];
    
    for (const func of drawFunctions) {
        if (typeof window[func] !== 'undefined') {
            console.log(`✓ ${func} function exists`);
        } else {
            console.log(`✗ ${func} function does not exist`);
        }
    }
}

// Test update functions
function testUpdates() {
    console.log('Testing update functions...');
    
    // Test update functions
    const updateFunctions = [
        'updateShip', 'updateBullets', 'updateAsteroids', 'updateMines',
        'updateTurrets', 'updateArmyMen', 'updatePowerups', 'updateRoses',
        'updateParticles', 'updateWaves', 'updateForceField'
    ];
    
    for (const func of updateFunctions) {
        if (typeof window[func] !== 'undefined') {
            console.log(`✓ ${func} function exists`);
        } else {
            console.log(`✗ ${func} function does not exist`);
        }
    }
}

// Test collision detection
function testCollisions() {
    console.log('Testing collision detection...');
    
    // Test collision functions
    const collisionFunctions = ['checkCollisions', 'splitAsteroid', 'checkMineExplosion'];
    
    for (const func of collisionFunctions) {
        if (typeof window[func] !== 'undefined') {
            console.log(`✓ ${func} function exists`);
        } else {
            console.log(`✗ ${func} function does not exist`);
        }
    }
}

// Test powerups
function testPowerups() {
    console.log('Testing powerups...');
    
    if (typeof bulletSizeMultiplier !== 'undefined') {
        console.log('✓ bulletSizeMultiplier variable exists');
        console.log(`Current bullet size multiplier: ${bulletSizeMultiplier}`);
    } else {
        console.log('✗ bulletSizeMultiplier variable does not exist');
    }
    
    if (typeof forceFieldActive !== 'undefined') {
        console.log('✓ forceFieldActive variable exists');
        console.log(`Force field active: ${forceFieldActive}`);
    } else {
        console.log('✗ forceFieldActive variable does not exist');
    }
    
    if (typeof fireBullet !== 'undefined') {
        console.log('✓ fireBullet function exists');
    } else {
        console.log('✗ fireBullet function does not exist');
    }
}

// Test helpers
function testHelpers() {
    console.log('Testing helpers...');
    
    // Test utility functions
    const utilityFunctions = [
        'distance', 'createExplosion', 'fireTurretBullet', 'fireRosePoisonBullet',
        'createThrustParticles'
    ];
    
    for (const func of utilityFunctions) {
        if (typeof window[func] !== 'undefined') {
            console.log(`✓ ${func} function exists`);
        } else {
            console.log(`✗ ${func} function does not exist`);
        }
    }
}

// Test wave system
function testWaveSystem() {
    console.log('Testing wave system...');
    
    if (typeof waveNumber !== 'undefined') {
        console.log('✓ waveNumber variable exists');
        console.log(`Current wave: ${waveNumber}`);
    } else {
        console.log('✗ waveNumber variable does not exist');
    }
    
    if (typeof spawnWaveEnemies !== 'undefined') {
        console.log('✓ spawnWaveEnemies function exists');
    } else {
        console.log('✗ spawnWaveEnemies function does not exist');
    }
    
    if (typeof winGame !== 'undefined') {
        console.log('✓ winGame function exists');
    } else {
        console.log('✗ winGame function does not exist');
    }
}

// Wait for the page to load
window.addEventListener('load', function() {
    console.log('Consolidated test suite loaded');
    
    // Test all features after game starts
    setTimeout(() => {
        testAllFeatures();
    }, 3000);
});