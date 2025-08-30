// Comprehensive test script for Asteroids game

// Test results tracking
let testResults = {
    gameStartsAutomatically: false,
    shipSteeringErratic: false,
    gameOverScreenImmediateRestart: false,
    startScreenImmediateRestart: false,
    shipRotationWorks: false,
    shipMovementWorks: false,
    shipShootingWorks: false,
    livesSystemWorks: false,
    gameOverScreenWorks: false,
    restartButtonWorks: false
};

// Wait for the page to load
window.addEventListener('load', function() {
    console.log('Test script loaded');
    runComprehensiveTests();
});

function runComprehensiveTests() {
    console.log('Running comprehensive tests...');
    
    // Test 1: Check if game starts automatically
    testGameStartBehavior();
    
    // Test 2: Check ship controls after page load
    testInitialShipControls();
    
    // Test 3: Run gameplay test
    setTimeout(() => {
        runGameplayTest();
    }, 2000);
}

function testGameStartBehavior() {
    console.log('Test 1: Checking if game starts automatically...');
    
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    
    // Check if start screen is visible
    if (startScreen && startScreen.style.display !== 'none') {
        console.log('✓ Start screen is visible - game did not start automatically');
        testResults.gameStartsAutomatically = false;
    } else {
        console.log('✗ Start screen is not visible - game may have started automatically');
        testResults.gameStartsAutomatically = true;
    }
    
    // Check if game over screen is hidden
    if (gameOverScreen && gameOverScreen.style.display === 'none') {
        console.log('✓ Game over screen is hidden');
    } else {
        console.log('✗ Game over screen is visible');
    }
}

function testInitialShipControls() {
    console.log('Test 2: Checking initial ship controls...');
    
    // Check if ship object exists
    if (typeof ship !== 'undefined') {
        console.log('✓ Ship object exists');
        console.log('  Ship position:', ship.x, ship.y);
        console.log('  Ship angle:', ship.angle);
        console.log('  Ship visible:', ship.visible);
    } else {
        console.log('✗ Ship object does not exist');
    }
    
    // Check mouse position
    console.log('  Mouse position:', mouseX, mouseY);
}

function runGameplayTest() {
    console.log('Test 3: Running gameplay test...');
    
    // Start the game
    const startButton = document.getElementById('startButton');
    if (startButton) {
        console.log('Clicking start button...');
        startButton.click();
        
        // Wait a bit and check if game started
        setTimeout(() => {
            testGameStarted();
            
            // Run ship control test
            testShipControls();
            
            // Run game over test
            setTimeout(() => {
                testGameOverScenario();
            }, 5000);
        }, 1000);
    } else {
        console.log('✗ Start button not found');
    }
}

function testGameStarted() {
    console.log('Checking if game started properly...');
    
    const startScreen = document.getElementById('startScreen');
    if (startScreen && startScreen.style.display === 'none') {
        console.log('✓ Start screen hidden - game started');
    } else {
        console.log('✗ Start screen still visible - game may not have started');
    }
    
    if (typeof gameStarted !== 'undefined' && gameStarted) {
        console.log('✓ gameStarted flag is true');
    } else {
        console.log('✗ gameStarted flag is false');
    }
}

function testShipControls() {
    console.log('Testing ship controls...');
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.log('✗ Canvas not found');
        return;
    }
    
    // Record initial ship state
    const initialAngle = ship ? ship.angle : 0;
    console.log('Initial ship angle:', initialAngle);
    
    // Move mouse to a new position
    const newMouseX = canvas.width / 4;
    const newMouseY = canvas.height / 4;
    
    const mouseMoveEvent = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: newMouseX,
        clientY: newMouseY
    });
    
    canvas.dispatchEvent(mouseMoveEvent);
    
    // Wait and check if ship angle changed
    setTimeout(() => {
        const newAngle = ship ? ship.angle : 0;
        console.log('New ship angle:', newAngle);
        
        if (Math.abs(newAngle - initialAngle) > 0.01) {
            console.log('✓ Ship rotation works');
            testResults.shipRotationWorks = true;
        } else {
            console.log('✗ Ship rotation may not be working');
            testResults.shipRotationWorks = false;
        }
        
        // Test thrust
        testThrustControls(canvas);
    }, 500);
}

function testThrustControls(canvas) {
    console.log('Testing thrust controls...');
    
    const initialVelocityX = ship ? ship.velocity.x : 0;
    const initialVelocityY = ship ? ship.velocity.y : 0;
    
    // Start thrusting
    const mouseDownEvent = new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: canvas.width / 2,
        clientY: canvas.height / 2
    });
    
    canvas.dispatchEvent(mouseDownEvent);
    
    // Wait and check if velocity changed
    setTimeout(() => {
        const newVelocityX = ship ? ship.velocity.x : 0;
        const newVelocityY = ship ? ship.velocity.y : 0;
        
        console.log('Initial velocity:', initialVelocityX, initialVelocityY);
        console.log('New velocity:', newVelocityX, newVelocityY);
        
        if (Math.abs(newVelocityX - initialVelocityX) > 0.01 || 
            Math.abs(newVelocityY - initialVelocityY) > 0.01) {
            console.log('✓ Ship thrust works');
            testResults.shipMovementWorks = true;
        } else {
            console.log('✗ Ship thrust may not be working');
            testResults.shipMovementWorks = false;
        }
        
        // Stop thrusting
        const mouseUpEvent = new MouseEvent('mouseup', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        
        canvas.dispatchEvent(mouseUpEvent);
    }, 500);
}

function testGameOverScenario() {
    console.log('Testing game over scenario...');
    
    // Force game over by setting lives to 0
    if (typeof lives !== 'undefined') {
        console.log('Current lives:', lives);
        lives = 0;
        
        // Trigger a collision to end the game
        if (typeof endGame !== 'undefined' && typeof asteroids !== 'undefined' && asteroids.length > 0) {
            console.log('Triggering game over...');
            endGame();
            
            // Check if game over screen appears
            setTimeout(() => {
                testGameOverScreen();
            }, 1000);
        }
    }
}

function testGameOverScreen() {
    console.log('Testing game over screen...');
    
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) {
        const isVisible = gameOverScreen.classList.contains('show') || 
                         gameOverScreen.style.display === 'flex' ||
                         window.getComputedStyle(gameOverScreen).display !== 'none';
                         
        if (isVisible) {
            console.log('✓ Game over screen is visible');
            testResults.gameOverScreenWorks = true;
            
            // Test restart button
            testRestartButton();
        } else {
            console.log('✗ Game over screen is not visible');
            testResults.gameOverScreenWorks = false;
        }
    }
}

function testRestartButton() {
    console.log('Testing restart button...');
    
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
        console.log('Clicking restart button...');
        restartButton.click();
        
        // Check if game over screen is hidden
        setTimeout(() => {
            const gameOverScreen = document.getElementById('gameOverScreen');
            if (gameOverScreen) {
                const isHidden = !gameOverScreen.classList.contains('show') && 
                               gameOverScreen.style.display === 'none';
                               
                if (isHidden) {
                    console.log('✓ Restart button works - game over screen hidden');
                    testResults.restartButtonWorks = true;
                } else {
                    console.log('✗ Restart button may not work - game over screen still visible');
                    testResults.restartButtonWorks = false;
                }
            }
        }, 500);
    }
}

// Add error handling to catch any crashes
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    console.error('Error message:', e.message);
    console.error('Error filename:', e.filename);
    console.error('Error line number:', e.lineno);
    console.error('Error column number:', e.colno);
});

// Periodically log test results
setInterval(() => {
    console.log('=== CURRENT TEST RESULTS ===');
    console.log('Game starts automatically:', testResults.gameStartsAutomatically ? 'YES' : 'NO');
    console.log('Ship rotation works:', testResults.shipRotationWorks ? 'YES' : 'NO');
    console.log('Ship movement works:', testResults.shipMovementWorks ? 'YES' : 'NO');
    console.log('Game over screen works:', testResults.gameOverScreenWorks ? 'YES' : 'NO');
    console.log('Restart button works:', testResults.restartButtonWorks ? 'YES' : 'NO');
}, 10000);