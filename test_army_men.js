// Test script for army men functionality
console.log('Army Men test script loaded');

// Function to verify army men creation
function testArmyMenCreation() {
    // Check if armyMen array exists
    if (typeof armyMen !== 'undefined') {
        console.log('✓ Army men array exists');
        console.log('Current army men count:', armyMen.length);
        
        // Check if army men creation function works
        if (typeof createArmyMenGroup !== 'undefined') {
            console.log('Testing army men group creation...');
            
            // Create two groups of 5 army men each
            const initialArmyMenCount = armyMen.length;
            createArmyMenGroup(5); // First group
            createArmyMenGroup(5); // Second group
            
            setTimeout(() => {
                console.log('After creating 2 groups of 5 army men:');
                console.log('Army men count:', armyMen.length);
                
                const newArmyMen = armyMen.length - initialArmyMenCount;
                console.log('New army men created:', newArmyMen);
                
                if (newArmyMen === 10) {
                    console.log('✓ Army men groups are being created successfully');
                } else {
                    console.log('! Expected 10 new army men, got', newArmyMen);
                }
                
                // Test army men rendering
                testArmyMenRendering();
                
                // Test army men movement
                testArmyMenMovement();
            }, 1000);
        }
    } else {
        console.log('✗ Army men array does not exist');
    }
}

// Function to verify army men rendering
function testArmyMenRendering() {
    console.log('Testing army men rendering...');
    
    // Check if drawArmyMen function exists
    if (typeof drawArmyMen !== 'undefined') {
        console.log('✓ drawArmyMen function exists');
    } else {
        console.log('✗ drawArmyMen function does not exist');
    }
    
    // Check if updateArmyMen function exists
    if (typeof updateArmyMen !== 'undefined') {
        console.log('✓ updateArmyMen function exists');
    } else {
        console.log('✗ updateArmyMen function does not exist');
    }
}

// Function to verify army men movement
function testArmyMenMovement() {
    console.log('Testing army men movement...');
    
    // Check if createArmyMenGroup function exists
    if (typeof createArmyMenGroup !== 'undefined') {
        console.log('✓ createArmyMenGroup function exists');
    } else {
        console.log('✗ createArmyMenGroup function does not exist');
    }
}

// Wait for the page to load
window.addEventListener('load', function() {
    console.log('Army men test script loaded');
    
    // Test army men functionality after game starts
    setTimeout(() => {
        testArmyMenCreation();
    }, 3000);
});