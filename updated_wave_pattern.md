# Updated Wave Progression Pattern

## Overview
Updated the wave progression to implement the specific asteroid and army men spawning pattern:

- **Asteroids**: 1 on wave 1, 2 on wave 2, 3 on wave 3, and so on (linear increase)
- **Army Men**: 
  - Waves 1-3: 3 army men per wave
  - Waves 4-6: 6 army men per wave
  - Waves 7-9: 9 army men per wave
  - Waves 10-12: 12 army men per wave
  - Waves 13-15: 15 army men per wave

## Wave-by-Wave Breakdown

```
Wave | Asteroids | Mines | Army Men | Turrets | Roses | Total Enemies
-----|-----------|-------|----------|---------|-------|---------------
   1 |     1     |   0   |    3     |    0    |   0   |      4
   2 |     2     |   0   |    3     |    0    |   1   |      6
   3 |     3     |   1   |    3     |    0    |   0   |      7
   4 |     4     |   1   |    6     |    1    |   1   |     13
   5 |     5     |   1   |    6     |    0    |   0   |     12
   6 |     6     |   2   |    6     |    0    |   1   |     15
   7 |     7     |   2   |    9     |    1    |   0   |     19
   8 |     8     |   2   |    9     |    0    |   1   |     20
   9 |     9     |   3   |    9     |    0    |   0   |     21
  10 |    10     |   3   |   12     |    1    |   1   |     27
  11 |    11     |   3   |   12     |    0    |   0   |     26
  12 |    12     |   4   |   12     |    0    |   1   |     29
  13 |    13     |   4   |   15     |    1    |   0   |     33
  14 |    14     |   4   |   15     |    0    |   1   |     34
  15 |    15     |   5   |   15     |    0    |   0   |     35
```

## Pattern Details

### Asteroid Progression
- Wave 1: 1 asteroid
- Wave 2: 2 asteroids
- Wave 3: 3 asteroids
- ...
- Wave 15: 15 asteroids

Linear increase of 1 asteroid per wave.

### Mine Progression
- Waves 1-3: 0 mines
- Waves 4-6: 1 mine
- Waves 7-9: 2 mines
- Waves 10-12: 3 mines
- Waves 13-15: 4 mines

Step increase of 1 mine every 3 waves.

### Army Men Progression
- Waves 1-3: 3 army men per wave (9 total)
- Waves 4-6: 6 army men per wave (18 total)
- Waves 7-9: 9 army men per wave (27 total)
- Waves 10-12: 12 army men per wave (36 total)
- Waves 13-15: 15 army men per wave (45 total)

Step increase of 3 army men per wave every 3 waves.

### Supporting Elements
- **Turrets**: 1 new turret every 3 waves (starting at wave 4)
- **Roses**: 1 new rose every 2 waves (starting at wave 2)
- **Powerups**: Regular spawning with force field powerups every wave
- **Victory**: Achieved at wave 15

## Challenge Curve

### Early Game (Waves 1-3)
- **Focus**: Basic asteroid avoidance and army men management
- **Enemies**: 4-7 total enemies
- **Challenge**: Low, learning curve focused

### Mid Game (Waves 4-9)
- **Focus**: Managing increasing army men groups and additional threats
- **Enemies**: 12-21 total enemies
- **Challenge**: Moderate, requires skill development

### Late Game (Waves 10-15)
- **Focus**: Mastering all systems under heavy pressure
- **Enemies**: 26-35 total enemies
- **Challenge**: High, ultimate test of player mastery

## Strategic Implications

### Resource Management
- Force field powerups every wave provide consistent survival tools
- Roses help manage army men threat (especially valuable in later waves)
- Bullet size powerups become increasingly important for dealing with more enemies

### Tactical Evolution
- Early waves: Focus on basic avoidance and powerup collection
- Mid waves: Develop strategies for managing larger army men groups
- Late waves: Master multitasking with all threat types simultaneously

### Victory Path
Players must successfully defeat all enemies in waves 1 through 15, with the challenge scaling appropriately to provide a satisfying progression from beginner to expert level play.