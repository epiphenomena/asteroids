// Test script to reproduce the crash when ship collides with an asteroid

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
    let testDuration = 30000; // Run test for 30 seconds
    
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
        }
        
        // Check if game is over
        const gameOverScreen = document.getElementById('gameOverScreen');
        if (gameOverScreen && gameOverScreen.style.display !== 'none') {
            console.log('Game over detected, stopping test');
            clearInterval(testInterval);
            clearInterval(thrustInterval);
            
            // Log final score
            const finalScore = document.getElementById('finalScore');
            if (finalScore) {
                console.log('Final score:', finalScore.textContent);
            }
        }
        
        // Log current status every 5 seconds
        if (elapsed % 5000 < 100) {
            console.log('Test running... Elapsed time:', Math.floor(elapsed / 1000), 'seconds');
            
            // Log ship position and velocity
            if (typeof ship !== 'undefined') {
                console.log('Ship position:', ship.x, ship.y);
                console.log('Ship velocity:', ship.velocity.x, ship.velocity.y);
            }
            
            // Log number of asteroids and bullets
            if (typeof asteroids !== 'undefined') {
                console.log('Asteroids count:', asteroids.length);
            }
            if (typeof bullets !== 'undefined') {
                console.log('Bullets count:', bullets.length);
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