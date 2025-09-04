// Test script to verify fixes for wave spawning and turret collision issues

// Mock the game functions we need for testing
const mockCanvas = {
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
        closePath: () => {}
    })
};

// Mock DOM elements
const mockElements = {
    gameCanvas: mockCanvas,
    startScreen: { style: {} },
    gameOverScreen: { style: {}, classList: { add: () => {}, remove: () => {} } },
    scoreValue: { textContent: '0' },
    livesValue: { textContent: '3' },
    waveValue: { textContent: '1' },
    highScoreValue: { textContent: '0' },
    finalScore: { textContent: '0' },
    finalHighScore: { textContent: '0' },
    finalWave: { textContent: '1' },
    startButton: { addEventListener: () => {} },
    restartButton: { addEventListener: () => {} }
};

// Mock document.getElementById
const originalGetElementById = document.getElementById;
document.getElementById = (id) => mockElements[id] || originalGetElementById(id);

// Mock window functions
window.requestAnimationFrame = (callback) => setTimeout(callback, 16);

// Test the fixes
function testFixes() {
    console.log('Testing fixes for wave spawning and turret collision issues...');
    
    // Initialize game
    if (typeof init === 'function') {
        console.log('✓ init function exists');
        init();
    } else {
        console.log('✗ init function does not exist');
        return;
    }
    
    // Test wave spawning
    if (typeof spawnWaveEnemies === 'function') {
        console.log('✓ spawnWaveEnemies function exists');
        
        // Set initial wave number
        if (typeof waveNumber !== 'undefined') {
            waveNumber = 1;
            console.log('Set wave number to 1');
        }
        
        // Call spawnWaveEnemies
        spawnWaveEnemies();
        console.log('Called spawnWaveEnemies for wave 1');
        
        // Check that enemies were created
        setTimeout(() => {
            console.log(`Created ${asteroids.length} asteroids`);
            console.log(`Created ${mines.length} mines`);
            console.log(`Created ${armyMen.length} army men`);
            console.log(`Created ${turrets.length} turrets`);
            console.log(`Created ${karateMen.length} karate men`);
            
            // Verify that enemies are not too close to center (0,0)
            let tooClose = false;
            for (const asteroid of asteroids) {
                const distance = Math.sqrt(asteroid.x * asteroid.x + asteroid.y * asteroid.y);
                if (distance < 300) {
                    console.log(`⚠️ Asteroid too close to center: ${distance}`);
                    tooClose = true;
                }
            }
            
            for (const mine of mines) {
                const distance = Math.sqrt(mine.x * mine.x + mine.y * mine.y);
                if (distance < 300) {
                    console.log(`⚠️ Mine too close to center: ${distance}`);
                    tooClose = true;
                }
            }
            
            for (const armyMan of armyMen) {
                const distance = Math.sqrt(armyMan.x * armyMan.x + armyMan.y * armyMan.y);
                if (distance < 300) {
                    console.log(`⚠️ Army man too close to center: ${distance}`);
                    tooClose = true;
                }
            }
            
            for (const turret of turrets) {
                const distance = Math.sqrt(turret.x * turret.x + turret.y * turret.y);
                if (distance < 250) {
                    console.log(`⚠️ Turret too close to center: ${distance}`);
                    tooClose = true;
                }
            }
            
            for (const karateMan of karateMen) {
                const distance = Math.sqrt(karateMan.x * karateMan.x + karateMan.y * karateMan.y);
                if (distance < 300) {
                    console.log(`⚠️ Karate man too close to center: ${distance}`);
                    tooClose = true;
                }
            }
            
            if (!tooClose) {
                console.log('✓ All enemies spawned at safe distances');
            }
        }, 100);
    } else {
        console.log('✗ spawnWaveEnemies function does not exist');
    }
    
    // Test collision detection fixes
    if (typeof checkCollisions === 'function') {
        console.log('✓ checkCollisions function exists');
    } else {
        console.log('✗ checkCollisions function does not exist');
    }
    
    console.log('Test completed');
}

// Run the test
setTimeout(testFixes, 1000);