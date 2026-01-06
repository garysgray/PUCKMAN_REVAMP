| ![Game Splash](PUCKMAN_REVAMP/assets/sprites/billBoards/gameSplash.png) |
|:-----------------------------------------------------------------------:|
PUCKMAN (Revamped)

A rebuilt version of my original HTML5 PUCKMAN game.
Modular, cleaner, and designed to be easier to extend.

Built with vanilla JS and Canvas, and attempting to use my meger HIT_ME HTML5 game engine v1
Runs directly in modern browsers (Chrome, Firefox, Edge); no build step needed.


# Puckman Revamp

A modern revamp of the classic Puckman game, built with modular game architecture, procedural map generation, and collision-aware gameplay. This project focuses on clean code structure, extensibility, and performance optimizations while keeping the classic gameplay feel.

## Features & Additions

### 1. Map & Level Generation
- Procedural **map generator** with a grid of walkable tiles and walls.
- Configurable parameters:
  - `mapSafeMargin` → keeps player/enemies away from edges.
  - `mapLaneSpacing` → structured spacing for walls.
  - `mapEmptyChance` → randomness for wall placement.
  - `mapSpawnRadius` → safe zone around player start.
- **Rainbow effect** on tiles: color shifts based on distance from map center.
- **Goal placement**:
  - Randomized but non-overlapping with walls, enemies, or player.
  - Spread evenly across quadrants to avoid empty sections.
- **Borders** built around the map with caching for performance.

### 2. Player & Movement
- Player class tracks `playerState` and `savedPlayerState`.
- Keyboard movement (WASD + arrow keys) with **diagonal normalization**.
- **Collision-aware movement** prevents passing through walls.
- Shoot mechanic with **cooldown timer**.
- **Collision detection** with:
  - Goals → collect, play sound, increase score.
  - Enemies → take damage, lose lives, log events.

### 3. Enemy / NPCs
- Enemy class extends `GameObject`:
  - Moves autonomously.
  - Reacts to player proximity.
  - Integrated with collision system for interactions with player.

### 4. Collision Utilities
- `rectsCollide` → precise AABB collision detection.
- `roughNear` → fast proximity check to reduce calculations.
- `overlapsAny` → checks if an object overlaps any objects in a holder.
- `checkPlayerGameObjCollisions` → centralizes player collisions with goals/enemies.

### 5. Game State & Controller
- `updateGameStates` manages game states:
  - `INIT` → waiting to start
  - `PLAY` → main gameplay loop
  - `PAUSE` → temporary pause
  - `WIN` / `LOSE` → game end conditions
- Player and enemy updates are called each frame.
- Centralized collision checks during the play state.
- `Controller` class:
  - Manages game logic, device input, and render layers.
  - Handles per-frame updates and clears frame-specific input.

### 6. Rendering & Optimization
- Layered rendering system:
  - `billBoardsLayer` → backgrounds
  - `hudRenderLayer` → score/lives display
  - `textRenderLayer` → in-game messages
  - `gameObjectsLayer` → tiles, goals, enemies, player
- **Canvas caching** for map and borders to improve performance.
- Dynamic rainbow effect applied to map tiles for visual variety.

### 7. Audio / Feedback
- Sound effects integrated:
  - `GET` → goal collected.
  - `HURT` → player hit by enemy (placeholder).
  - Shooting sound for player actions.

### 8. Miscellaneous
- Configurable constants via `GameConsts` and `GameDefs`.
- Flexible sprite assignment with `setImagesForType`.
- Safe margins and spawn zones prevent inaccessible areas.
- Modular and test-friendly design for easy expansion.

---

## Notes
This revamp focuses on modularity, procedural generation, and collision handling. Future updates may include:
- More enemy behaviors and AI.
- Power-ups and collectibles.
- Level progression and increasing difficulty.
- Enhanced sound and visual effects.
