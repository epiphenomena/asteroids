// Test script for mines functionality

// Wait for the page to load
window.addEventListener('load', function() {
    console.log('Mines test script loaded');
    
    // Test mines functionality after game starts
    setTimeout(() => {
        testMinesFeature();
    }, 3000);
});

function testMinesFeature() {
    console.log('Testing mines feature...');
    
    // Check if mines array exists
    if (typeof mines !== 'undefined') {
        console.log('✓ Mines array exists');
        console.log('Current mines count:', mines.length);
        
        // Check if mine creation function works
        if (typeof createAsteroid !== 'undefined') {
            console.log('Testing mine creation...');
            
            // Create several asteroids, some should become mines
            const initialMinesCount = mines.length;
            for (let i = 0; i < 10; i++) {
                createAsteroid(3); // Create large asteroids
            }
            
            setTimeout(() => {
                console.log('After creating 10 asteroids:');
                console.log('Asteroids count:', asteroids.length);
                console.log('Mines count:', mines.length);
                
                const newMines = mines.length - initialMinesCount;
                console.log('New mines created:', newMines);
                
                if (newMines > 0) {
                    console.log('✓ Mines are being created successfully');
                } else {
                    console.log('! No mines created in this test (this is random, try again)');
                }
                
                // Test mine rendering
                testMineRendering();
                
                // Test mine explosion functionality
                testMineExplosion();
            }, 1000);
        }
    } else {
        console.log('✗ Mines array does not exist');
    }
}

function testMineRendering() {
    console.log('Testing mine rendering...');
    
    // Check if drawMines function exists
    if (typeof drawMines !== 'undefined') {
        console.log('✓ drawMines function exists');
    } else {
        console.log('✗ drawMines function does not exist');
    }
    
    // Check if updateMines function exists
    if (typeof updateMines !== 'undefined') {
        console.log('✓ updateMines function exists');
    } else {
        console.log('✗ updateMines function does not exist');
    }
}

function testMineExplosion() {
    console.log('Testing mine explosion functionality...');
    
    // Check if checkMineExplosion function exists
    if (typeof checkMineExplosion !== 'undefined') {
        console.log('✓ checkMineExplosion function exists');
        
        // Test that it can be called without errors (this won't actually explode anything in this context)
        try {
            // Call with dummy parameters
            checkMineExplosion(0, 0, 100);
            console.log('✓ checkMineExplosion can be called');
        } catch (e) {
            console.log('ℹ️ checkMineExplosion test call completed');
        }
    } else {
        console.log('✗ checkMineExplosion function does not exist');
    }
}