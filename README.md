# asteroids
Your basic asteroids clone with explosive mines

This entire project other than the contents of this file is vibe coded by a 4th grader using the Qwen coder cli.

Asteroids is a game where the user is a small triangular ship that shoots asteroid destroying bullets out the front and flies around in space.
The space is sized based upon the viewport and just outside the viewport it wraps around to the opposing side. So asteroids that float off one side eventually appear coming back in the other side.
The bullets that the user's ship shoots do not wrap around in space.

This enhanced version also includes mines - special red asteroids that act as bombs when collided with. When a mine is hit by a bullet or collided with by your ship, it explodes in a 1-inch radius, destroying all objects nearby. The explosion is visualized by a red circle showing the area of effect. When you collide with a regular asteroid, both you and the asteroid are destroyed. Mines are worth more points but are more dangerous than regular asteroids. Regular asteroids pass through mines without triggering them.

This is an html/js/css game. It should all be vanilla js/css. It is a static html page. Optimized for and intended for use on mobile.