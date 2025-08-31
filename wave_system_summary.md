# Wave System Implementation

## Overview
Implemented a wave-based enemy respawn system where new waves spawn only after all enemies from the previous wave are defeated. Players must defeat all 15 waves to win the game.

## Features Added

### 1. Wave Tracking
- `waveNumber`: Tracks the current wave (starts at 1)
- Waves advance only when all enemies are defeated
- No timer-based wave progression
- **Win Condition**: Defeat all 15 waves to win the game

### 2. Enemy Respawn System
Enemies now respawn only when all previous enemies are defeated:
- All asteroids, mines, and army men must be destroyed
- Turrets, roses, and powerups persist between waves
- Enemy count increases progressively with each wave

### 3. Victory Condition
- **Win at Wave 15**: After defeating wave 15, player wins the game
- **Victory Screen**: Special victory message and styling
- **Restart Option**: Play again after winning

### 4. Wave Progression
Each wave increases in difficulty through progressive enemy spawning:

**Army Men Progression:**
- Waves 1-3: 3 army men per wave
- Waves 4-6: 6 army men per wave
- Waves 7-9: 9 army men per wave
- Waves 10-12: 12 army men per wave
- Waves 13-15: 15 army men per wave
- And so on...

**Other Enemies:**
- **1 new asteroid every wave** (wave 1: 1 asteroid, wave 2: 2 asteroids, etc.)
- **1 mine every 3 waves** (starting at wave 3)
- **1 turret every 3 waves** (starting at wave 4)
- **1 rose every 2 waves** (starting at wave 2)
- **Force field powerup every wave** (guaranteed resource)
- **Bullet size powerups with increased frequency**

### 5. UI Elements
- Added wave display to game UI
- Added wave reached to game over screen
- **Special Victory Message**: Congratulatory message for completing all waves
- **Victory Styling**: Green text shadow for victory screen title

## Implementation Details

### New Functions
- `updateWaves()`: Checks if all enemies defeated and spawns next wave, handles win condition
- `spawnWaveEnemies()`: Spawns appropriate enemies for current wave
- `winGame()`: Handles victory condition and displays win screen
- Modified `createAsteroid()` to support forced mine creation
- `createForceFieldPowerup()`: Creates force field powerups

### Modified Functions
- `resetGame()`: Initialize wave system variables
- `update()`: Call wave update system
- `endGame()`: Display final wave reached
- `index.html`: Added victory message and updated start screen instructions

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
- Count: (floor((waveNumber - 1) / 3) + 1) * 3
- Cycle: 3 army men for waves 1-3, 6 for waves 4-6, 9 for waves 7-9, etc.

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
5. After wave 15, player wins the game
6. Turrets, roses, and powerups remain between waves