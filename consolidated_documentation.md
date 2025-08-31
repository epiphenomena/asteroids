# Asteroids Game - Complete Documentation

## Overview
This is an enhanced Asteroids game with multiple enemy types, powerups, and helper objects. The player controls a spaceship that can move and shoot to destroy enemies while avoiding collisions. Players must defeat all 15 waves to win the game.

## Game Objective
Defeat all 15 waves of enemies to achieve victory. Each wave increases in difficulty with more asteroids and stronger army men.

## Player Ship

### Properties
- Position: (x, y) - Center of the game world
- Radius: 10 pixels
- Angle: Rotation in radians (faces mouse/touch position)
- Velocity: {x, y} - Movement vector
- Rotation Speed: 0.05 radians per frame
- Acceleration: 0.75 - Applied when thrusting
- Max Speed: 5.75 - Maximum velocity magnitude
- Friction: 0.98 - Deceleration factor
- Shoot Cooldown: Timer for automatic shooting
- Max Shoot Cooldown: 20 frames between shots
- Invincibility: Temporary immunity after respawn
- Respawn Time: Timer for respawning after death
- Visible: Whether ship is visible (hidden during respawn)

### Abilities
1. **Movement**:
   - Rotate toward mouse/touch position
   - Thrust forward in the direction facing
   - Natural deceleration through friction

2. **Combat**:
   - Automatic shooting at a fixed rate
   - Bullets have base radius of 2 pixels (affected by powerups)
   - Bullets move at speed of 10 + ship velocity

## Game Objects

### Enemies

#### 1. Asteroids
- **Description**: Classic space rocks that bounce around the screen
- **Behavior**: 
  - Move with constant velocity
  - Wrap around screen edges
  - Split into smaller asteroids when shot (large → medium → small)
- **Sizes**: 
  - Large (30px radius) - 30 points
  - Medium (20px radius) - 20 points
  - Small (10px radius) - 10 points
- **Collision**: Destroys ship on contact

#### 2. Mines
- **Description**: Dangerous red explosives that detonate when asteroids are nearby
- **Behavior**:
  - Move with constant velocity
  - Wrap around screen edges
  - Explode when asteroids come within 100px radius
  - Explosion affects all objects within 100px
- **Points**: 15 × size (45, 30, or 15 points)
- **Collision**: Destroys ship on contact

#### 3. Turrets
- **Description**: Stationary green enemies that shoot at the player
- **Behavior**:
  - Fixed position on screen edges
  - Shoot bullets at player every 6 seconds (2 shots per sequence)
  - Bullets move at speed 7
- **Points**: 50 points when destroyed
- **Collision**: Destroyed by player bullets, don't directly harm ship

#### 4. Army Men
- **Description**: Red enemy soldiers that chase the player
- **Behavior**:
  - Spawn in groups at screen edges
  - Chase player with acceleration-based movement
  - Speed: 1.95, Max Speed: 3.25, Acceleration: 0.065
  - Wrap around screen edges
  - **Increased Hitbox**: Radius 12 (50% larger than original)
- **Points**: 25 points when destroyed
- **Collision**: Destroys ship on contact

#### 5. Turret Bullets
- **Description**: Bullets fired by turrets
- **Behavior**:
  - Move toward player's current position
  - Speed: 7 pixels per frame
- **Collision**: Destroys ship on contact

### Helpers

#### 1. Roses
- **Description**: Friendly pink plants that shoot poison at army men
- **Behavior**:
  - Stationary position
  - Automatically target closest army men within 500px
  - Shoot poison bullets every 3 seconds
  - Poison bullets move at speed 5
- **Points**: 25 points for each army man killed by rose
- **Collision**: Do not harm player

### Powerups

#### 1. Bullet Size Powerup
- **Description**: Yellow star that increases bullet size
- **Behavior**:
  - Pulsing animation
  - Increases bullet size multiplier by 0.5 per collection
  - Wrap around screen edges
- **Points**: 50 points when collected
- **Effect**: Larger bullets have better hit area

#### 2. Force Field Powerup
- **Description**: Blue circle that provides temporary invincibility
- **Behavior**:
  - Creates a protective barrier around the ship
  - Absorbs one hit before being destroyed
  - Lasts for 10 seconds or until destroyed
  - Visualized as a blue dashed circle around the ship
- **Points**: 75 points when collected
- **Effect**: Protects ship from all damage for one hit or 10 seconds

## Wave System

### Overview
Enemies spawn in waves that increase in difficulty. Players must defeat all enemies in a wave before advancing to the next one. After defeating wave 15, players win the game.

### Wave Progression
Each wave increases in difficulty through progressive enemy spawning:

**Army Men Progression:**
- Waves 1-3: 3 army men per wave
- Waves 4-6: 6 army men per wave
- Waves 7-9: 9 army men per wave
- Waves 10-12: 12 army men per wave
- Waves 13-15: 15 army men per wave

**Other Enemies:**
- **1 new asteroid every wave** (wave 1: 1 asteroid, wave 2: 2 asteroids, etc.)
- **1 mine every 3 waves** (starting at wave 3)
- **1 turret every 3 waves** (starting at wave 4)
- **1 rose every 2 waves** (starting at wave 2)
- **Force field powerup every wave** (guaranteed resource)
- **Bullet size powerups with increased frequency**

### Victory Condition
After defeating wave 15, players win the game with a special victory screen.

## Game Functions

### Core Functions

#### `init()`
- Initialize game canvas and event listeners
- Load high score from localStorage
- Start game loop

#### `resetGame()`
- Reset all game objects and state
- Create initial asteroids, turrets, army men, powerups, and roses
- Reset player ship to center
- Reset score and lives

#### `gameLoop()`
- Main game loop using requestAnimationFrame
- Update game state and render when game is active

#### `update()`
- Main update function that calls all update functions
- Handle controls, update all objects, check collisions

#### `render()`
- Clear canvas and draw all game objects
- Draw in order: particles, bullets, asteroids, mines, turrets, army men, powerups, roses, ship, radar

#### `handleControls()`
- Handle mouse/touch input for ship rotation
- Handle thrust input
- Handle automatic shooting

### Object Management Functions

#### `createAsteroid(size = 3, x = null, y = null, forceMine = false)`
- Create a single asteroid or mine
- Random position at screen edges if not specified

#### `createAsteroids(count)`
- Create specified number of asteroids

#### `createTurret(x = null, y = null)`
- Create a stationary turret
- Position at screen corners/edges if not specified
- Collision avoidance with asteroids, mines, and other turrets

#### `createArmyMan(x = null, y = null)`
- Create a single army man that chases player
- Random position at screen edges if not specified
- **Increased Hitbox**: Radius 12 for easier targeting

#### `createArmyMenGroup(count)`
- Create a group of army men

#### `createPowerup(x = null, y = null)`
- Create a bullet size powerup
- Random position away from center if not specified

#### `createForceFieldPowerup(x = null, y = null)`
- Create a force field powerup
- Random position away from center if not specified

#### `createRose(x = null, y = null)`
- Create a rose that shoots poison at army men
- Random position away from center if not specified

### Update Functions

#### `updateShip()`
- Apply friction to ship velocity
- Handle invincibility and respawn timing
- Move world objects opposite to ship movement

#### `updateBullets()`
- Update bullet positions
- Remove off-screen or expired bullets

#### `updateAsteroids()`
- Update asteroid positions
- Handle screen wrapping

#### `updateMines()`
- Update mine positions
- Handle screen wrapping
- Check for nearby asteroids and trigger explosions

#### `updateTurrets()`
- Handle turret shooting cooldown
- Fire bullets at player

#### `updateArmyMen()`
- Update army men positions to chase player
- Handle screen wrapping

#### `updatePowerups()`
- Update powerup animations
- Handle screen wrapping

#### `updateRoses()`
- Handle rose shooting cooldown
- Target closest army men and fire poison bullets
- Update poison bullet positions

#### `updateParticles()`
- Update particle positions and life
- Remove dead particles

#### `updateWaves()`
- Check if all enemies from current wave are defeated
- Spawn next wave when all enemies are defeated
- Check for victory condition (wave 15)

#### `updateForceField()`
- Update force field lifetime
- Deactivate force field when time expires

### Collision Functions

#### `checkCollisions()`
- Check all collision types:
  - Bullet vs Asteroid/Mine/Turret/ArmyMan
  - Ship vs Asteroid/Mine/ArmyMan
  - Ship vs Turret Bullet
  - Ship vs Powerup
  - Rose Poison Bullet vs ArmyMan
  - Ship vs Army Men (with force field protection)

#### `splitAsteroid(index)`
- Split asteroid into smaller ones when shot

#### `checkMineExplosion(x, y, radius)`
- Check for objects within mine explosion radius
- Destroy affected objects

### Drawing Functions

#### `drawShipAtCenter()`
- Draw player ship at center of screen
- Handle invincibility blinking

#### `drawBullets()`
- Draw all bullets as white circles

#### `drawAsteroids()`
- Draw all asteroids as white circles

#### `drawMines()`
- Draw all mines as red dashed circles with cross

#### `drawTurrets()`
- Draw all turrets as green squares with front indicator

#### `drawArmyMen()`
- Draw all army men as red triangles pointing at player
- **Larger Visual Size**: Matches increased hitbox

#### `drawPowerups()`
- Draw all powerups as yellow pulsing stars (bullet size)
- Draw force field powerups as blue circles with inner circle

#### `drawRoses()`
- Draw all roses as pink circles with petal details
- Draw rose poison bullets as green circles

#### `drawParticles()`
- Draw all particles as white circles with fading effect
- Special handling for mine explosion radius visualization

#### `drawForceField()`
- Draw force field as blue dashed circle around ship
- Pulsing animation effect

#### `drawRadarIndicators()`
- Draw radar arrows for off-screen objects
- Color-coded by object type

### Utility Functions

#### `fireBullet()`
- Fire a bullet from the player ship
- Affected by bullet size multiplier

#### `fireTurretBullet(turret, angle)`
- Fire a bullet from a turret toward the player

#### `fireRosePoisonBullet(rose, angle)`
- Fire a poison bullet from a rose toward an army man

#### `createThrustParticles()`
- Create particles when ship is thrusting

#### `createExplosion(x, y, isMine = false)`
- Create particle explosion effect
- Special handling for mine explosions

#### `distance(x1, y1, x2, y2)`
- Calculate distance between two points

#### `winGame()`
- Handle victory condition
- Display special victory screen

#### `endGame()`
- Handle game over state
- Save high score and show game over screen

#### `resizeCanvas()`
- Resize canvas to match window dimensions

#### `setupEventListeners()`
- Set up all event listeners for game controls

#### `loadHighScore()`
- Load high score from localStorage

#### `saveHighScore()`
- Save high score to localStorage

## Constants and Configuration

### Physics
- Friction: 0.98
- Rotation Speed: 0.05
- Ship Acceleration: 0.75
- Ship Max Speed: 5.75
- Bullet Speed: 10
- Turret Bullet Speed: 7
- Rose Poison Bullet Speed: 5
- Army Man Speed: 1.95
- Army Man Max Speed: 3.25
- Army Man Acceleration: 0.065

### Timing
- Max Shoot Cooldown: 20 frames
- Turret Shoot Cooldown: 360 frames (6 seconds)
- Turret Shot Sequence: 2 shots with 30 frame delay
- Rose Shoot Cooldown: 180 frames (3 seconds)
- Force Field Lifetime: 600 frames (10 seconds)
- Invincibility Time: 180 frames (3 seconds)
- Respawn Time: 120 frames (2 seconds)

### Scoring
- Small Asteroid: 10 points
- Medium Asteroid: 20 points
- Large Asteroid: 30 points
- Small Mine: 15 points
- Medium Mine: 30 points
- Large Mine: 45 points
- Turret: 50 points
- Army Man: 25 points
- Bullet Size Powerup: 50 points
- Force Field Powerup: 75 points
- Army Man killed by Rose: 25 points

### Visual Design
- Ship: White triangle
- Bullets: White circles
- Asteroids: White circles
- Mines: Red dashed circles with cross
- Turrets: Green squares with front indicator
- Army Men: Red triangles pointing at player (larger size)
- Bullet Size Powerups: Yellow pulsing stars
- Force Field Powerups: Blue circles with inner circle
- Roses: Pink circles with petal details
- Rose Bullets: Green circles
- Particles: White fading circles
- Radar Indicators: Color-coded arrows
- Force Field: Blue dashed circle with pulsing effect