# Roses Feature Implementation

## Overview
Added roses that spit poison bullets and kill army men. These roses are friendly plants that help the player by targeting enemy army men within a 5-inch range.

## Implementation Details

### 1. Data Structures
- Added `roses` array to track all rose objects
- Each rose has:
  - Position (x, y)
  - Radius (15)
  - Poison cooldown timer
  - Maximum poison cooldown (180 frames / 3 seconds)
  - Array of poison bullets

### 2. Spawning
- Added `createRose()` function to spawn roses at random positions
- Roses are created away from the center to avoid immediate conflicts
- One rose is created at game start

### 3. Behavior
- Added `updateRoses()` function to control rose behavior
- Roses automatically target the closest army man within range
- Range is approximately 5 inches (500 pixels at typical screen resolution)
- Roses shoot poison bullets every 3 seconds when targets are in range

### 4. Poison Bullets
- Added `fireRosePoisonBullet()` function to create poison bullets
- Poison bullets are green and slower than regular bullets (speed 5)
- Poison bullets have a radius of 3
- Each rose maintains its own array of poison bullets

### 5. Rendering
- Added `drawRoses()` function to render roses as pink flowers
- Roses are drawn as a circle with 8 petal details
- Added `drawRosePoisonBullets()` function to render poison bullets
- Poison bullets are drawn as green circles

### 6. Combat
- Added collision detection for rose poison bullets vs army men
- When a poison bullet hits an army man, the army man is destroyed
- Player earns 25 points for each army man killed by roses
- Roses do not target or harm the player's ship

### 7. Physics
- Roses move with the world physics like other objects
- Rose poison bullets also move with the world physics

### 8. Integration
- Added roses to the main game loop
- Integrated with existing collision detection system
- Works with world coordinate system

## Files Modified
- `script.js` - Main game implementation
- `test_roses.js` - Test script for roses functionality
- `test_roses.html` - Test HTML file

## How to Test
1. Open `test_roses.html` in a browser
2. Click "START TEST"
3. A pink rose will appear on screen
4. Army men will spawn and move around
5. When army men come within 5 inches of the rose, it will shoot poison bullets
6. Poison bullets will destroy army men and grant 25 points each
7. Roses do not harm the player's ship