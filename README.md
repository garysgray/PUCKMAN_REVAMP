| ![Game Splash](PUCKMAN_REVAMP/assets/sprites/billBoards/gameSplash.png) |
|:---------------------------------------------------------------------:|
| **PUCKMAN (Revamped)** |

# PUCKMAN (Revamped)

A rebuild of the classic HTML5 **PUCKMAN** game.  

Focuses on **modular architecture, deterministic collision handling, procedural level generation, and flexible input systems**, while keeping the original arcade gameplay intact.  

Built entirely with **vanilla JavaScript and HTML5 Canvas**, with no frameworks or build steps required. Runs directly in modern browsers.

---

## Tech Stack
- Vanilla JavaScript (ES6+)
- HTML5 Canvas
- No frameworks, bundlers, or build tools
- Runs in Chrome, Firefox, and Edge

---

## Core Systems & Features

### 1. Procedural Map & Level Generation
- Grid-based procedural map system with **walkable paths**
- Walls placed safely without overlapping player spawns
- Difficulty scales with **level tiers**
- Configurable generation parameters:
  - `mapSafeMargin` – prevents spawns near borders
  - `mapLaneSpacing` – controls wall spacing
  - `mapEmptyChance` – balance of open space vs walls
  - `mapSpawnRadius` – protected area around player
- Optional tile color variation based on distance from map center
- Map and borders cached after generation for efficiency
- Ensures all goals are reachable

---

### 2. Level Progression
- Infinite levels with **difficulty tiers**
- Goal count, enemy AI, and map density scale with level
- Score and level-specific modifiers applied automatically
- Progression triggered when all goals are collected

---

### 3. Goals & Objectives
- Configurable goal count per level
- Placement avoids walls, enemies, and player spawns
- Goal collection:
  - Increases score
  - Plays audio feedback
  - Advances game state
- Fully collision-aware with map and entity holders

---

### 4. Player & Movement
- `Player` extends **GameObject**
- Keyboard support: WASD & Arrow keys
- Smooth movement with diagonal normalization
- Collision-aware movement prevents tunneling
- Shooting with cooldown support
- Interactions:
  - Goals → score and state update
  - Enemies → life reduction

---

### 5. Enemy / NPC System
- `Enemy` extends **GameObject**
- Basic AI with `ROAM`, `FOLLOW`, and `STOP` states
- Integrated with collision system
- Designed for easy extension with additional behaviors

---

### 6. Input System
- Unified input for **keyboard + gamepad**
- Gamepad via HTML5 Gamepad API
- Supports pause, state switching, and runtime toggle

---

### 7. Game States
- `INIT` – startup and splash screen
- `PLAY` – active gameplay
- `PAUSE` – paused state
- `WIN` – level complete
- `LOSE` – game over
- Each state manages its own update loop and rendering rules

---

### 8. Collision System
- `GameObject` provides:
  - `getHitbox()` for collisions
  - `tryMoveWithCollision()` for safe movement
- Utility functions:
  - `rectsCollide()`, `roughNear()`, `overlapsAny()`, `checkPlayerGameObjCollisions()`
- Handles collisions with map, player, and other entities
- Optimized for performance

---

### 9. HUD & Rendering
- Dynamic HUD placement based on canvas size
- Rendering pipeline:
  - Billboards / splash screens
  - Game objects (map, player, enemies, goals)
  - HUD (score, lives, level)
  - Text overlays
- Map and borders rendered once per level for efficiency
- Optional debug overlay shows hitboxes and runtime info

---

### 10. Audio
- Sound effects for:
  - Goal collection
  - Player damage
- Audio pooling prevents playback issues
- Designed for easy future expansion

---

### 11. Debug & Development
- Optional on-screen debug panel
- Hitbox visualization
- Safe initialization checks prevent race conditions
- Fixed-step game loop ensures consistent updates
- Console logging for debugging

---

## Design Principles
- **Explicit behavior:** predictable and testable systems
- **Modular systems:** minimal coupling, easy to modify
- **Deterministic collisions:** avoids glitches
- **Performance-aware:** optimized Canvas rendering
- **Debug-friendly:** easy to inspect and reason about

---

## Future Work
- Expanded enemy AI behaviors
- Power-ups and modifiers
- Persistent high scores
- Optional mobile-friendly input
- More map variety in procedural generation

---

## Notes
This project serves as both a **modernized PUCKMAN game** and a **testing environment for engine-level concepts**, including procedural generation, deterministic collisions, dynamic HUD scaling, and flexible input systems.
