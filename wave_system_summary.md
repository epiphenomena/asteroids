# Wave System Implementation

## Overview
Implemented a wave-based enemy respawn system where all enemy types continuously spawn throughout the game. Enemies respawn both periodically based on a timer and when all asteroids/mines are destroyed.

## Features Added

### 1. Wave Tracking
- `waveNumber`: Tracks the current wave (starts at 1)
- `waveTimer`: Counts frames since last wave
- `maxWaveTimer`: Base time between waves (30 seconds)
- Wave timer decreases as game progresses (waves come faster)

### 2. Enemy Respawn System
Enemies now respawn in two ways:
1. **Periodic Waves**: Every 30 seconds (decreasing) a new wave spawns
2. **Clear-based Respawn**: When all asteroids/mines are destroyed

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
- `updateWaves()`: Manages wave timing and progression
- `spawnWaveEnemies()`: Spawns appropriate enemies for current wave
- Modified `createAsteroid()` to support forced mine creation
- `createForceFieldPowerup()`: Creates force field powerups

### Modified Functions
- `resetGame()`: Initialize wave system variables
- `update()`: Call wave update system
- `endGame()`: Display final wave reached

### New Variables
- `waveNumber`: Current wave number
- `waveTimer`: Timer for wave progression
- `maxWaveTimer`: Base time between waves

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

### Wave Timer
- Base: 30 seconds (1800 frames)
- Decrease: 0.5 seconds per wave (30 frames)
- Minimum: 10 seconds (600 frames)