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
- Enemy count increases progressively with each wave

### 3. Wave Progression
Each wave increases in difficulty through more frequent enemy spawning:
- **1 new asteroid every wave** (wave 1: 1 asteroid, wave 2: 2 asteroids, etc.)
- **3 army men every wave** (consistent threat)
- **1 mine every 3 waves** (starting at wave 3)
- **1 turret every 3 waves** (starting at wave 4)
- **1 rose every 2 waves** (starting at wave 2)
- **Force field powerup every wave** (guaranteed resource)
- **Bullet size powerups with increased frequency**

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
- Count: waveNumber
- Increases by 1 every wave

### Mines
- Count: floor(waveNumber / 3)
- Increases by 1 every 3 waves

### Army Men
- Count: 3 per wave (consistent)
- Spawns every wave

### Turrets
- Spawn: Every 3 waves (starting at wave 4)
- Count: 1 new turret per spawn

### Roses
- Spawn: Every 2 waves (starting at wave 2)
- Count: 1 new rose per spawn

### Powerups
- Bullet Size: Increased random chance (40%)
- **Force Field: 1 per wave**

## Game Flow
1. Wave 1 starts with minimal enemies (1 asteroid, 3 army men)
2. Player must destroy all asteroids, mines, and army men
3. When all are defeated, next wave begins with more enemies
4. Process repeats with increasing difficulty
5. Turrets, roses, and powerups remain between waves