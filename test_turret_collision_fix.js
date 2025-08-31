// Test script for turret collision fix
console.log('Turret collision fix test script loaded');

// Function to verify turrets are not colliding with asteroids
function testTurretAsteroidCollision() {
    // Wait a bit for game to initialize
    setTimeout(() => {
        if (typeof turrets !== 'undefined' && typeof asteroids !== 'undefined') {
            console.log('Testing turret-asteroid collision prevention...');
            console.log('Turrets count:', turrets.length);
            console.log('Asteroids count:', asteroids.length);
            
            let collisionCount = 0;
            
            // Check each turret against each asteroid
            for (const turret of turrets) {
                for (const asteroid of asteroids) {
                    const dx = turret.x - asteroid.x;
                    const dy = turret.y - asteroid.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < turret.radius + asteroid.radius) {
                        collisionCount++;
                        console.log('Collision detected between turret and asteroid!');
                        console.log('Turret position:', turret.x, turret.y);
                        console.log('Asteroid position:', asteroid.x, asteroid.y);
                        console.log('Distance:', distance);
                        console.log('Minimum safe distance:', turret.radius + asteroid.radius);
                    }
                }
            }
            
            if (collisionCount === 0) {
                console.log('✓ No turret-asteroid collisions detected');
            } else {
                console.log('✗ Found', collisionCount, 'turret-asteroid collisions');
            }
        }
    }, 3000);
}

// Wait for the page to load
window.addEventListener('load', function() {
    console.log('Turret collision fix test script loaded');
    
    // Test collision prevention after game starts
    setTimeout(() => {
        testTurretAsteroidCollision();
    }, 3000);
});