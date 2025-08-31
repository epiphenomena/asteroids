// Test script for roses functionality
console.log('Roses test script loaded');

// Function to verify roses creation
function testRosesCreation() {
    // Check if roses array exists
    if (typeof roses !== 'undefined') {
        console.log('✓ Roses array exists');
        console.log('Current roses count:', roses.length);
        
        // Check if roses creation function works
        if (typeof createRose !== 'undefined') {
            console.log('Testing roses creation...');
            
            // Create a rose
            const initialRosesCount = roses.length;
            createRose();
            
            setTimeout(() => {
                console.log('After creating 1 rose:');
                console.log('Roses count:', roses.length);
                
                const newRoses = roses.length - initialRosesCount;
                console.log('New roses created:', newRoses);
                
                if (newRoses === 1) {
                    console.log('✓ Roses are being created successfully');
                } else {
                    console.log('! Expected 1 new rose, got', newRoses);
                }
                
                // Test roses rendering
                testRosesRendering();
                
                // Test roses update
                testRosesUpdate();
            }, 1000);
        }
    } else {
        console.log('✗ Roses array does not exist');
    }
}

// Function to verify roses rendering
function testRosesRendering() {
    console.log('Testing roses rendering...');
    
    // Check if drawRoses function exists
    if (typeof drawRoses !== 'undefined') {
        console.log('✓ drawRoses function exists');
    } else {
        console.log('✗ drawRoses function does not exist');
    }
    
    // Check if updateRoses function exists
    if (typeof updateRoses !== 'undefined') {
        console.log('✓ updateRoses function exists');
    } else {
        console.log('✗ updateRoses function does not exist');
    }
}

// Function to verify roses update
function testRosesUpdate() {
    console.log('Testing roses update...');
    
    // Check if fireRosePoisonBullet function exists
    if (typeof fireRosePoisonBullet !== 'undefined') {
        console.log('✓ fireRosePoisonBullet function exists');
    } else {
        console.log('✗ fireRosePoisonBullet function does not exist');
    }
}

// Wait for the page to load
window.addEventListener('load', function() {
    console.log('Roses test script loaded');
    
    // Test roses functionality after game starts
    setTimeout(() => {
        testRosesCreation();
    }, 3000);
});