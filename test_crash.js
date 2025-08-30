// Test script to reproduce the crash when ship collides with an asteroid and test game over screen

// Wait for the page to load
window.addEventListener('load', function() {
    console.log('Test script loaded');
    
    // Start the game after a short delay
    setTimeout(function() {
        console.log('Starting game...');
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.click();
            console.log('Game started');
            
            // After game starts, begin test sequence
            runTestSequence();
        } else {
            console.error('Start button not found');
        }
    }, 1000);
});

function runTestSequence() {
    console.log('Running test sequence...');
    
    // Set up test variables
    let testInterval;
    let thrustInterval;
    let startTime = Date.now();
    let testDuration = 60000; // Run test for 60 seconds
    let livesLost = 0;
    let gameOverTested = false;
    
    // Start thrusting immediately
    console.log('Starting thrust');
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        // Simulate mouse down for thrust
        const mouseDownEvent = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: canvas.width / 2,
            clientY: canvas.height / 2
        });
        canvas.dispatchEvent(mouseDownEvent);
        
        // Keep thrusting by periodically sending mouse move events
        thrustInterval = setInterval(function() {
            if (!canvas) return;
            
            const mouseMoveEvent = new MouseEvent('mousemove', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: canvas.width / 2,
                clientY: canvas.height / 2
            });
            canvas.dispatchEvent(mouseMoveEvent);
        }, 100);
    }
    
    // Run the test for the specified duration
    testInterval = setInterval(function() {
        const elapsed = Date.now() - startTime;
        
        // Move mouse to random positions to change ship direction
        if (canvas) {
            const mouseMoveEvent = new MouseEvent('mousemove', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: Math.random() * canvas.width,
                clientY: Math.random() * canvas.height
            });
            canvas.dispatchEvent(mouseMoveEvent);
        }
        
        // Check if test duration has elapsed
        if (elapsed > testDuration) {
            console.log('Test duration elapsed, stopping test');
            clearInterval(testInterval);
            clearInterval(thrustInterval);
            
            // Stop thrusting
            if (canvas) {
                const mouseUpEvent = new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                canvas.dispatchEvent(mouseUpEvent);
            }
            
            // Log test results
            console.log('Test completed. Lives lost:', livesLost);
            if (gameOverTested) {
                console.log('Game over screen test: PASSED');
            } else {
                console.log('Game over screen test: FAILED - Game over not detected');
            }
        }
        
        // Check if game is over
        const gameOverScreen = document.getElementById('gameOverScreen');
        if (gameOverScreen) {
            // Check if game over screen is visible
            const isGameOverVisible = gameOverScreen.classList.contains('show') || 
                                    gameOverScreen.style.display === 'flex' ||
                                    window.getComputedStyle(gameOverScreen).display !== 'none';
                                    
            if (isGameOverVisible && !gameOverTested) {
                console.log('Game over detected, testing game over screen...');
                gameOverTested = true;
                
                // Log final score
                const finalScore = document.getElementById('finalScore');
                if (finalScore) {
                    console.log('Final score:', finalScore.textContent);
                }
                
                // Test restart button
                const restartButton = document.getElementById('restartButton');
                if (restartButton) {
                    console.log('Restart button found, clicking...');
                    restartButton.click();
                    
                    // Check if game over screen is hidden after restart
                    setTimeout(function() {
                        const isHidden = !gameOverScreen.classList.contains('show') && 
                                       gameOverScreen.style.display === 'none';
                        if (isHidden) {
                            console.log('Game over screen hidden after restart: PASSED');
                        } else {
                            console.log('Game over screen hidden after restart: FAILED');
                        }
                    }, 100);
                }
                
                // Stop the test
                clearInterval(testInterval);
                clearInterval(thrustInterval);
            }
        }
        
        // Log current status every 5 seconds
        if (elapsed % 5000 < 100) {
            console.log('Test running... Elapsed time:', Math.floor(elapsed / 1000), 'seconds');
            
            // Log lives
            const livesValue = document.getElementById('livesValue');
            if (livesValue) {
                console.log('Lives:', livesValue.textContent);
            }
            
            // Log ship position and velocity
            if (typeof ship !== 'undefined') {
                console.log('Ship visible:', ship.visible);
                console.log('Ship invincible:', ship.invincible);
                console.log('Ship respawn time:', ship.respawnTime);
            }
            
            // Log number of asteroids and bullets
            if (typeof asteroids !== 'undefined') {
                console.log('Asteroids count:', asteroids.length);
            }
            if (typeof bullets !== 'undefined') {
                console.log('Bullets count:', bullets.length);
            }
        }
        
        // Track lives lost
        const livesValue = document.getElementById('livesValue');
        if (livesValue) {
            const currentLives = parseInt(livesValue.textContent);
            if (currentLives < 3 - livesLost) {
                livesLost = 3 - currentLives;
                console.log('Life lost! Lives remaining:', currentLives);
            }
        }
    }, 100);
    
    // Add error handling to catch any crashes
    window.addEventListener('error', function(e) {
        console.error('An error occurred:', e.error);
        console.error('Error message:', e.message);
        console.error('Error filename:', e.filename);
        console.error('Error line number:', e.lineno);
        console.error('Error column number:', e.colno);
        
        // Stop the test
        clearInterval(testInterval);
        clearInterval(thrustInterval);
    });
}