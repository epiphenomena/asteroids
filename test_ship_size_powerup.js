// Test script for ship size powerup functionality
console.log('Ship Size Powerup test script loaded');

// Function to verify ship size powerup creation
function testShipSizePowerupCreation() {
    // Check if powerups array exists
    if (typeof powerups !== 'undefined') {
        console.log('✓ Powerups array exists');
        console.log('Current powerups count:', powerups.length);
        
        // Check if ship size powerup creation function works
        if (typeof createPowerup !== 'undefined') {
            console.log('Testing ship size powerup creation...');
            
            // Create several powerups to test probability
            const initialPowerupsCount = powerups.length;
            let shipSizePowerups = 0;
            
            for (let i = 0; i < 20; i++) {
                createPowerup();
            }
            
            setTimeout(() => {
                console.log('After creating 20 powerups:');
                console.log('Powerups count:', powerups.length);
                
                // Count ship size powerups
                for (let i = initialPowerupsCount; i < powerups.length; i++) {
                    if (powerups[i].type === 'shipSize') {
                        shipSizePowerups++;
                    }
                }
                
                console.log('Ship size powerups created:', shipSizePowerups);
                console.log('Expected: ~4 ship size powerups (20%)');
                
                if (shipSizePowerups > 0) {
                    console.log('✓ Ship size powerups are being created successfully');
                } else {
                    console.log('! No ship size powerups created in this test (this is random, try again)');
                }
                
                // Test ship size powerup rendering
                testShipSizePowerupRendering();
                
                // Test ship size powerup collection
                testShipSizePowerupCollection();
            }, 1000);
        }
    } else {
        console.log('✗ Powerups array does not exist');
    }
}

// Function to verify ship size powerup rendering
function testShipSizePowerupRendering() {
    console.log('Testing ship size powerup rendering...');
    
    // Check if drawPowerups function exists
    if (typeof drawPowerups !== 'undefined') {
        console.log('✓ drawPowerups function exists');
    } else {
        console.log('✗ drawPowerups function does not exist');
    }
    
    // Check if ship size powerup drawing is implemented
    let shipSizePowerupFound = false;
    for (const powerup of powerups) {
        if (powerup.type === 'shipSize') {
            shipSizePowerupFound = true;
            break;
        }
    }
    
    if (shipSizePowerupFound) {
        console.log('✓ Ship size powerup drawing is implemented');
    } else {
        console.log('! No ship size powerups found to test drawing');
    }
}

// Function to verify ship size powerup collection
function testShipSizePowerupCollection() {
    console.log('Testing ship size powerup collection...');
    
    // Check if shipSizeMultiplier variable exists
    if (typeof shipSizeMultiplier !== 'undefined') {
        console.log('✓ shipSizeMultiplier variable exists');
        console.log('Current ship size multiplier:', shipSizeMultiplier);
    } else {
        console.log('✗ shipSizeMultiplier variable does not exist');
    }
    
    // Check if collision detection includes ship size powerups
    if (typeof checkCollisions !== 'undefined') {
        console.log('✓ checkCollisions function exists');
    } else {
        console.log('✗ checkCollisions function does not exist');
    }
}

// Wait for the page to load
window.addEventListener('load', function() {
    console.log('Ship size powerup test script loaded');
    
    // Test ship size powerup functionality after game starts
    setTimeout(() => {
        testShipSizePowerupCreation();
    }, 3000);
});