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
- Each wave increases in difficulty (but at a reduced rate)

### 3. Wave Progression
Each wave increases in difficulty at a more manageable pace:
- Asteroids: 1-4 per wave (reduced from 2-7)
- Mines: 0-2 per wave (reduced from 0-3)
- Army men: Every 3 waves instead of every 2, 2-5 per group (reduced from 3-7)
- Turrets: Every 5 waves instead of every 3
- Powerups: More frequent random spawning
- Roses: Every 7 waves instead of every 5
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
- Count: 1 + min(3, floor(waveNumber / 3))
- Range: 1-4 asteroids per wave (reduced)

### Mines
- Count: min(2, floor(waveNumber / 4))
- Range: 0-2 mines per wave (reduced)

### Army Men
- Spawn: Every 3 waves (less frequent)
- Count: 2 + min(3, floor(waveNumber / 5))
- Range: 2-5 army men per group (reduced)

### Turrets
- Spawn: Every 5 waves (less frequent)
- Count: 1 new turret per spawn

### Roses
- Spawn: Every 7 waves (less frequent)
- Count: 1 new rose per spawn

### Powerups
- Bullet Size: Increased random chance (30% -> 40%)
- **Force Field: 1 per wave**

## Game Flow
1. Wave 1 starts with initial enemies
2. Player must destroy all asteroids, mines, and army men
3. When all are defeated, Wave 2 begins
4. Process repeats with increasing difficulty
5. Turrets, roses, and powerups remain between waves