# Army Men Feature Implementation

## Overview
Added army men that chase the player in the asteroids game. These are enemy soldiers that spawn at the edges of the screen and pursue the player.

## Implementation Details

### 1. Data Structures
- Added `armyMen` array to track all army men objects
- Each army man has:
  - Position (x, y)
  - Velocity (x, y)
  - Radius (8)
  - Speed properties (speed: 1.5, maxSpeed: 2.5)

### 2. Spawning
- Added `createArmyMan()` function to spawn army men at screen edges
- Added `spawnArmyMen()` function to periodically spawn new army men (1/300 chance per frame)

### 3. Movement
- Added `updateArmyMen()` function that makes army men chase the player
- Army men accelerate toward the player's position
- Movement is limited by a maximum speed
- Army men wrap around screen edges like other game objects

### 4. Rendering
- Added `drawArmyMen()` function to render army men as red triangles
- Army men are drawn pointing toward the player

### 5. Collisions
- Bullet-army man collisions: Army men are destroyed by player bullets (25 points)
- Player-army man collisions: Player loses a life when colliding with army men

### 6. Integration
- Added army men to world movement physics
- Integrated army men into the main game loop

## Files Modified
- `script.js` - Main game implementation
- `test_army_men.js` - Test script for army men functionality
- `test_army_men.html` - Test HTML file

## How to Test
1. Open `test_army_men.html` in a browser
2. Click "START TEST"
3. Army men will spawn and chase the player ship
4. Shoot army men to earn points
5. Avoid collisions with army men to preserve lives