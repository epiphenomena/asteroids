# Wave System Implementation

## Overview
Implemented a wave-based enemy respawn system where new waves spawn only after all enemies from the previous wave are defeated. This creates a more strategic progression where players must clear each wave before facing the next challenge.

## Features Added

### 1. Wave Tracking
- `waveNumber`: Tracks the current wave (starts at 1)
- Waves advance only when all enemies are defeated
- No timer-based wave progression

### 2. Enemy Respawn System
Enemies now respawn only when all previous enemies are defeated:
- All asteroids, mines, and army men must be destroyed
- Turrets, roses, and powerups persist between waves
- Each wave increases in difficulty

### 3. Wave Progression
Each wave increases in difficulty:
- More asteroids per wave (up to 7)
- More mines per wave (up to 3)
- Army men spawn every 2 waves with increasing numbers
- Turrets added every 3 waves
- Powerups spawn more frequently
- Roses added every 5 waves
- **Force field powerup spawns every wave**

### 4. UI Elements
- Added wave display to game UI
- Added wave reached to game over screen

## Implementation Details

### New Functions
- `updateWaves()`: Checks if all enemies defeated and spawns next wave
- `spawnWaveEnemies()`: Spawns appropriate enemies for current wave
- Modified `createAsteroid()` to support forced mine creation
- `createForceFieldPowerup()`: Creates force field powerups

### Modified Functions
- `resetGame()`: Initialize wave system variables
- `update()`: Call wave update system
- `endGame()`: Display final wave reached

### New Variables
- `waveNumber`: Current wave number

## Wave Progression Formula

### Asteroids
- Count: 2 + min(5, floor(waveNumber / 2))
- Range: 2-7 asteroids per wave

### Mines
- Count: min(3, floor(waveNumber / 3))
- Range: 0-3 mines per wave

### Army Men
- Spawn: Every 2 waves
- Count: 3 + min(4, floor(waveNumber / 4))
- Range: 3-7 army men per group

### Turrets
- Spawn: Every 3 waves
- Count: 1 new turret per spawn

### Roses
- Spawn: Every 5 waves
- Count: 1 new rose per spawn

### Powerups
- Bullet Size: Spawn more frequently as game progresses
- **Force Field: 1 per wave**

## Game Flow
1. Wave 1 starts with initial enemies
2. Player must destroy all asteroids, mines, and army men
3. When all are defeated, Wave 2 begins
4. Process repeats with increasing difficulty
5. Turrets, roses, and powerups remain between waves