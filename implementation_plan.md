# Asteroids Game Implementation Plan

## Overview
This document outlines the implementation plan for creating a basic Asteroids clone as described in the README.md. The game will be built using vanilla HTML, CSS, and JavaScript, optimized for mobile play.

## Core Features to Implement
1.  **Game Canvas**: Set up the main game area using HTML5 Canvas.
2.  **Player Ship**:
    *   Representation: A small triangle.
    *   Movement: Rotate left/right, thrust forward, momentum-based drifting.
    *   Boundary: Wraps around screen edges.
3.  **Asteroids**:
    *   Generation: Appear randomly at screen edges.
    *   Movement: Float with constant velocity.
    *   Splitting: Break into smaller asteroids when hit (down to a minimum size, then destroyed).
    *   Boundary: Wrap around screen edges.
4.  **Bullets**:
    *   Shooting: Fire from the ship's tip in the direction it's facing.
    *   Movement: Travel in a straight line at high speed.
    *   Lifetime: Disappear after a short time or when hitting an asteroid. Do not wrap around.
5.  **Collision Detection**:
    *   Bullet vs. Asteroid: Destroy the asteroid and the bullet.
    *   Ship vs. Asteroid: End the game or lose a life.
6.  **Game State Management**:
    *   Score tracking.
    *   Lives system (optional, but standard).
    *   Game Over screen.
    *   Restart functionality.
7.  **Controls**:
    *   On-screen buttons for Rotate Left, Rotate Right, Thrust, and Shoot, suitable for mobile touch input.
8.  **Responsive Design**:
    *   Ensure the canvas and UI scale appropriately for different mobile screen sizes.
    *   Implement screen wrapping logic based on the viewport.

## Technical Approach
1.  **File Structure**:
    *   `index.html`: Main HTML file.
    *   `style.css`: Styles for the canvas and UI elements.
    *   `script.js`: Main game logic.
2.  **HTML5 Canvas**:
    *   Use `requestAnimationFrame` for smooth animation loop.
    *   Context (`ctx`) for drawing shapes (ship, asteroids, bullets).
3.  **Game Loop**:
    *   Update: Handle input, update positions, check collisions.
    *   Render: Clear canvas, redraw all game objects.
4.  **Object-Oriented Design**:
    *   Classes or objects for `Ship`, `Asteroid`, `Bullet`.
    *   Methods for updating position, drawing, handling collisions.
5.  **Mobile Optimization**:
    *   CSS media queries for responsive layout.
    *   Touch event listeners for controls (`touchstart`, `touchend`).
    *   Prevent default touch behaviors that might interfere (e.g., scrolling).

## Implementation Steps
1.  **Setup Basic Structure**:
    *   Create `index.html` with a canvas element.
    *   Link `style.css` and `script.js`.
    *   Basic CSS for canvas sizing and body margins.
2.  **Implement Player Ship**:
    *   Draw the ship triangle on the canvas.
    *   Add rotation and basic movement logic.
    *   Implement screen wrapping.
3.  **Add Controls**:
    *   Create on-screen buttons in HTML/CSS.
    *   Add JavaScript event listeners for touch/mouse events to control the ship.
4.  **Implement Asteroids**:
    *   Create `Asteroid` class/object.
    *   Add logic for random generation and movement.
    *   Implement screen wrapping.
5.  **Implement Bullets**:
    *   Create `Bullet` class/object.
    *   Add shooting logic (velocity based on ship's angle).
    *   Implement bullet lifetime and non-wrapping behavior.
6.  **Add Collision Detection**:
    *   Implement circle/point or circle/circle collision checks.
    *   Handle bullet-asteroid and ship-asteroid collisions.
7.  **Game State and UI**:
    *   Add score display.
    *   Implement lives system (if included).
    *   Create Game Over and Restart screens/logic.
8.  **Polish and Optimization**:
    *   Fine-tune controls and physics.
    *   Add visual effects (e.g., particle explosions).
    *   Optimize performance for mobile devices.
    *   Test on various mobile screen sizes.