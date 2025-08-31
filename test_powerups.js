// Test script for powerups functionality
console.log('Powerups test script loaded');

// Function to verify powerups creation
function testPowerupsCreation() {
    // Check if powerups array exists
    if (typeof powerups !== 'undefined') {
        console.log('✓ Powerups array exists');
        console.log('Current powerups count:', powerups.length);
        
        // Check if powerups creation function works
        if (typeof createPowerup !== 'undefined') {
            console.log('Testing powerups creation...');
            
            // Create several powerups
            const initialPowerupsCount = powerups.length;
            for (let i = 0; i < 3; i++) {
                createPowerup();
            }
            
            setTimeout(() => {
                console.log('After creating 3 powerups:');
                console.log('Powerups count:', powerups.length);
                
                const newPowerups = powerups.length - initialPowerupsCount;
                console.log('New powerups created:', newPowerups);
                
                if (newPowerups === 3) {
                    console.log('✓ Powerups are being created successfully');
                } else {
                    console.log('! Expected 3 new powerups, got', newPowerups);
                }
                
                // Test powerups rendering
                testPowerupsRendering();
                
                // Test powerups update
                testPowerupsUpdate();
            }, 1000);
        }
    } else {
        console.log('✗ Powerups array does not exist');
    }
}

// Function to verify powerups rendering
function testPowerupsRendering() {
    console.log('Testing powerups rendering...');
    
    // Check if drawPowerups function exists
    if (typeof drawPowerups !== 'undefined') {
        console.log('✓ drawPowerups function exists');
    } else {
        console.log('✗ drawPowerups function does not exist');
    }
    
    // Check if updatePowerups function exists
    if (typeof updatePowerups !== 'undefined') {
        console.log('✓ updatePowerups function exists');
    } else {
        console.log('✗ updatePowerups function does not exist');
    }
}

// Function to verify powerups update
function testPowerupsUpdate() {
    console.log('Testing powerups update...');
    
    // Check if bulletSizeMultiplier exists
    if (typeof bulletSizeMultiplier !== 'undefined') {
        console.log('✓ bulletSizeMultiplier variable exists');
        console.log('Current bullet size multiplier:', bulletSizeMultiplier);
    } else {
        console.log('✗ bulletSizeMultiplier variable does not exist');
    }
}

// Wait for the page to load
window.addEventListener('load', function() {
    console.log('Powerups test script loaded');
    
    // Test powerups functionality after game starts
    setTimeout(() => {
        testPowerupsCreation();
    }, 3000);
});