| ![Game Splash](PUCKMAN_REVAMP/assets/sprites/billBoards/gameSplash.png) |
|:---------------------------------------------------------------------:|
| **PUCKMAN (Revamped)** |

# PUCKMAN (Revamped)

A modern rebuild of the classic HTML5 **PUCKMAN** game.  

This version emphasizes **modular architecture, deterministic collision handling, procedural level generation, and flexible input systems**, while preserving the classic arcade feel.  

Built entirely with **vanilla JavaScript and HTML5 Canvas** — no frameworks, bundlers, or build step required. Runs directly in modern browsers.  

Also serves as a **proving ground for HIT_ME HTML5 Game Engine v1**, testing core game engine concepts in a real game scenario.

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
- Walls placed safely without clipping player spawns
- Difficulty scales via **level tiers** rather than randomness
- Tunable generation parameters:
  - `mapSafeMargin` – prevents spawns near borders
  - `mapLaneSpacing` – controls wall spacing
  - `mapEmptyChance` – balance between open space vs walls
  - `mapSpawnRadius` – protected area around player
- Optional rainbow-tile effect based on distance from map center
- Map cached after generation for **fast rendering**
- Guaranteed playable layouts with no unreachable goals

---

### 2. Level Progression System
- Infinite levels with discrete **difficulty tiers**
- Difficulty stabilizes after a maximum tier to prevent impossible maps
- Scales **goal count, enemy AI behavior, and map density** with difficulty
- Score scaling and level-specific modifiers built in

---

### 3. Goals & Objectives
- Configurable goal count per level, scaling with difficulty
- Smart goal placement ensures:
  - No overlap with walls, enemies, or player
  - Respecting spawn-safe zones
- Goal collection:
  - Increases player score
  - Plays audio feedback
  - Triggers game state progression when all goals collected
- Fully **collision-aware** with map and entity holders

---

### 4. Player & Movement
- `Player` entity extends **GameObject**
- Keyboard support:
  - WASD & Arrow keys
  - Smooth diagonal movement with normalization
- Collision-aware movement:
  - Solid wall blocking
  - Player cannot tunnel through walls or other objects
- Shooting mechanic with cooldown support
- Interactions:
  - Goals → score & state updates
  - Enemies → damage and life loss
- Saved position system allows for **pause/resume mechanics**

---

### 5. Enemy / NPC System
- `Enemy` class extends **GameObject**
- Autonomous roaming, following, or stopping behavior
- Proximity-aware AI:
  - Switches between `ROAM`, `FOLLOW`, and `STOP` states
  - Integrated with deterministic collision system
- Easy to extend for custom AI behaviors

---

### 6. Input System (Keyboard + Gamepad)
- Unified input layer for **keyboard + gamepad**
- Gamepad via HTML5 Gamepad API
- Pause, mode switching, and state transitions fully supported
- Runtime toggle for enabling/disabling gamepad input

---

### 7. Game State System
Centralized finite-state flow:
- `INIT` – startup and splash screen
- `PLAY` – active gameplay
- `PAUSE` – frozen game state
- `WIN` – level complete
- `LOSE` – game over

Each state controls its own **update loop, entity updates, and rendering rules**

---

### 8. Collision System
- `GameObject` provides:
  - `getHitbox()` for precise collisions
  - `tryMoveWithCollision()` to safely move entities against a holder
- Global utility functions:
  - `rectsCollide()`, `roughNear()`, `overlapsAny()` for deterministic checks
- Supports both **map & entity collision**
- Optimized for performance and **debug-friendly**

---

### 9. Rendering & Performance
- Layered rendering pipeline:
  - Billboards / splash screens
  - Game objects (map, player, enemies, goals)
  - HUD (score, lives)
  - Text overlays
- Canvas caching:
  - Borders and maps rendered once per level
  - Reduces per-frame draw calls
- Clean separation of logic and rendering
- Optional **debug overlay** shows hitboxes and runtime info

---

### 10. Audio & Feedback
- Sound effects for:
  - Goal collection
  - Player damage
- Audio pooling prevents playback stutter
- Designed for easy future expansion (music, power-ups, etc.)

---

### 11. Debug & Dev Tooling
- Optional on-screen debug panel
- Hitbox visualization for testing collisions
- Safe initialization checks prevent race conditions
- Fixed-step game loop ensures deterministic updates

---

## Design Philosophy
- **Explicit behavior:** No hidden state or magic
- **Modular systems:** Minimal coupling, maximum clarity
- **Deterministic collisions:** Avoids glitches and tunneling
- **Performance-first:** Optimized Canvas drawing
- **Debug-friendly:** Fully inspectable, easy to reason about

---

## Possible Future Ideas
- Expanded enemy AI behaviors (bosses, patrollers)
- Power-ups and modifiers
- Persistent high scores

---

## Notes
This project is both a **tribute to the original PUCKMAN** and a **live testbed for engine-level concepts**, including procedural generation, deterministic collision, and flexible input systems.  

Expect ongoing iteration, refactoring, and system hardening.
