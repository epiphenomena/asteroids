// Test script for turret functionality
console.log('Turret test script loaded');

// Function to verify turret creation
function testTurretCreation() {
    // Check if turrets array exists
    if (typeof turrets !== 'undefined' && turrets.length > 0) {
        console.log('Turret created successfully');
        console.log('Turret position:', turrets[0].x, turrets[0].y);
        console.log('Turret cooldown:', turrets[0].shootCooldown);
        return true;
    } else {
        console.log('Turret creation failed');
        return false;
    }
}

// Function to verify turret shooting
function testTurretShooting() {
    // This would need to be tested in a live game session
    console.log('Turret shooting test - needs live game session to verify');
    return true;
}

// Run tests
testTurretCreation();
testTurretShooting();