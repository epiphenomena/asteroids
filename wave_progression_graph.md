# Wave Progression Graph

```
Enemies per Wave (1-15)

Asteroids (█)    |███████████████
Mines (■)        |  ■■■  ■■■  ■■■  ■■■  ■
Army Men (♦)     |♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦
Turrets (▲)     |    ▲  ▲  ▲  ▲  ▲
Roses (●)        | ● ● ● ● ● ● ● ● ●

Wave: 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
      ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓
      1  2  3  4  5  6  7  8  9 10 11 12 13 14 15  <- Asteroids
      0  0  1  1  1  2  2  2  3  3  3  4  4  4  5  <- Mines
      3  3  3  3  3  3  3  3  3  3  3  3  3  3  3  <- Army Men
      0  0  0  1  0  0  1  0  0  1  0  0  1  0  0  <- Turrets
      0  1  0  1  0  1  0  1  0  1  0  1  0  1  0  <- Roses

Detailed Breakdown:
Wave  1: 1 asteroid, 0 mines, 3 army men, 0 turrets, 0 roses
Wave  2: 2 asteroids, 0 mines, 3 army men, 0 turrets, 1 rose
Wave  3: 3 asteroids, 1 mine, 3 army men, 0 turrets, 0 roses
Wave  4: 4 asteroids, 1 mine, 3 army men, 1 turret, 1 rose
Wave  5: 5 asteroids, 1 mine, 3 army men, 0 turrets, 0 roses
Wave  6: 6 asteroids, 2 mines, 3 army men, 0 turrets, 1 rose
Wave  7: 7 asteroids, 2 mines, 3 army men, 1 turret, 0 roses
Wave  8: 8 asteroids, 2 mines, 3 army men, 0 turrets, 1 rose
Wave  9: 9 asteroids, 3 mines, 3 army men, 0 turrets, 0 roses
Wave 10: 10 asteroids, 3 mines, 3 army men, 1 turret, 1 rose
Wave 11: 11 asteroids, 3 mines, 3 army men, 0 turrets, 0 roses
Wave 12: 12 asteroids, 4 mines, 3 army men, 0 turrets, 1 rose
Wave 13: 13 asteroids, 4 mines, 3 army men, 1 turret, 0 roses
Wave 14: 14 asteroids, 4 mines, 3 army men, 0 turrets, 1 rose
Wave 15: 15 asteroids, 5 mines, 3 army men, 0 turrets, 0 roses

Total Enemies Per Wave:
Wave  1:  4 total enemies
Wave  2:  6 total enemies
Wave  3:  7 total enemies
Wave  4:  9 total enemies
Wave  5:  8 total enemies
Wave  6: 12 total enemies
Wave  7: 12 total enemies
Wave  8: 14 total enemies
Wave  9: 15 total enemies
Wave 10: 18 total enemies
Wave 11: 17 total enemies
Wave 12: 20 total enemies
Wave 13: 21 total enemies
Wave 14: 22 total enemies
Wave 15: 23 total enemies

Key Features:
- Linear asteroid growth (1 new per wave)
- Mines increase every 3 waves
- Army men spawn consistently every wave (3 per wave)
- Turrets added every 3 waves (starting at wave 4)
- Roses added every 2 waves (starting at wave 2)
- Victory achieved at wave 15
```