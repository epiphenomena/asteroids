# Force Field Powerup Implementation

## Overview
Implemented a force field powerup that protects the ship from all damage and gets destroyed when hit. This powerup provides temporary invulnerability to make the game more forgiving during intense moments.

## Features Added

### 1. Force Field Mechanics
- **Activation**: Collect blue circle powerups to activate force field
- **Duration**: 10 seconds (600 frames) of protection
- **Protection**: Negates all damage from asteroids, mines, army men, and turret bullets
- **Destruction**: Force field is destroyed when player would take damage (1 hit = 1 use)
- **Visual Feedback**: Distinct blue dashed circle around ship with pulsing effect

### 2. Powerup System
- **Spawn Rate**: 20% of powerups are force field, 80% are bullet size
- **Visual Distinction**: 
  - Force Field: Blue circle with inner circle
  - Bullet Size: Yellow star
- **Point Value**: Force field powerups are worth 75 points (vs 50 for bullet size)

### 3. Visual Effects
- **Active Field**: Blue dashed circle with pulsing animation
- **Destruction**: Explosion effect when force field is destroyed
- **UI Feedback**: No additional UI elements (visual effect is sufficient)

## Implementation Details

### New Variables
- `forceFieldActive`: Boolean tracking if force field is active
- `forceFieldRadius`: Size of force field (30 pixels)
- `forceFieldLifetime`: Remaining time for force field
- `forceFieldMaxLifetime`: Maximum duration (600 frames = 10 seconds)

### New Functions
- `drawForceField()`: Renders the force field around the ship
- `updateForceField()`: Manages force field lifetime

### Modified Functions
- `resetGame()`: Initialize force field variables
- `update()`: Call force field update
- `render()`: Call force field drawing
- `createPowerup()`: Add force field powerup type
- `drawPowerups()`: Distinguish force field powerups visually
- `checkCollisions()`: Add force field protection to all ship collision detections

### Game Balance
- **Spawn Probability**: 20% chance for force field powerups
- **Duration**: 10 seconds (long enough to be useful but not overpowered)
- **Destruction**: Single-use per activation (1 hit destroys it)
- **Points**: 75 points (higher value than bullet size to reflect utility)

## Collision Protection
The force field protects against:
1. Asteroid collisions
2. Mine collisions
3. Army man collisions
4. Turret bullet collisions

When any of these would cause damage, the force field is destroyed instead of the player losing a life.

## Visual Design
- **Force Field Powerup**: Blue circle with smaller inner circle
- **Active Force Field**: Blue dashed circle (30px radius) with pulsing animation
- **Destruction Effect**: Particle explosion at ship position