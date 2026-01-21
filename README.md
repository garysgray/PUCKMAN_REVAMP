| ![Game Splash](PUCKMAN_REVAMP/assets/sprites/billBoards/gameSplash.png) |
|:---------------------------------------------------------------------:|
| **PUCKMAN (Revamped)** |

# PUCKMAN (Revamped)

A modern rebuild of my original HTML5 **PUCKMAN** game.

This version focuses on clean modular architecture, procedural level generation, deterministic collision handling, and flexible input systems, while preserving the classic arcade feel.

Built entirely with **vanilla JavaScript and HTML5 Canvas** — no frameworks, no bundlers, no build step.  
Runs directly in modern browsers.

This project also doubles as a proving ground for ideas feeding into my evolving **HIT_ME HTML5 Game Engine (v1)**.

---

## Tech Stack
- Vanilla JavaScript (ES6+)
- HTML5 Canvas
- No frameworks
- No bundlers
- No build step
- Runs in Chrome, Firefox, and Edge

---

## Core Systems & Features

### 1. Procedural Map & Level Generation
- Grid-based procedural map system.
- Walkable paths with collision-safe wall placement.
- Guaranteed playable layouts.
- Difficulty scales via **level tiers**, not raw randomness.
- Tunable generation parameters:
  - `mapSafeMargin` – prevents spawns near borders
  - `mapLaneSpacing` – structured wall spacing
  - `mapEmptyChance` – openness vs density
  - `mapSpawnRadius` – protected player spawn zone
- Difficulty caps after a maximum tier to prevent impossible maps.
- Optional rainbow-tile effect based on distance from map center.
- Cached map rendering for performance.

---

### 2. Level Progression System
- Infinite player level progression.
- Difficulty increases in discrete tiers (every N levels).
- After a defined cap, difficulty stabilizes.
- Ensures endless play without runaway difficulty.

---

### 3. Goals & Objectives
- Configurable goal count per level.
- Goal count scales with difficulty tier.
- Smart goal placement:
  - Never overlaps walls, enemies, or player
  - Avoids spawn-safe zones
- Goal collection:
  - Increases score
  - Plays audio feedback
  - Advances the game state when all goals are collected

---

### 4. Player & Movement
- Player entity with internal state handling.
- Keyboard input support:
  - WASD
  - Arrow keys
  - Diagonal movement with normalization
- Collision-aware movement:
  - Solid wall blocking
  - No clipping or tunneling
- Shooting mechanic with cooldown timer.
- Player interactions:
  - Goals → score
  - Enemies → damage and life loss

---

### 5. Enemy / NPC System
- `Enemy` class extends base `GameObject`.
- Autonomous movement.
- Player proximity awareness.
- Integrated with the shared collision system.
- Designed for easy extension with additional behaviors.

---

### 6. Input System (Keyboard + Gamepad)
- Unified input handling layer.
- Keyboard and gamepad coexist cleanly.
- Gamepad support via the HTML5 Gamepad API.
- Runtime toggle for enabling/disabling gamepad input.
- Proper **edge-triggered input handling** using a generic `toggleOnce` utility:
  - Prevents repeated toggles while a button is held
  - Used for pause, mode switching, and state transitions
- Pause can be triggered via:
  - Keyboard key
  - Gamepad button (when enabled)

---

### 7. Game State System
Centralized finite-state flow:
- `INIT` – setup and splash
- `PLAY` – active gameplay
- `PAUSE` – frozen game state
- `WIN` – level complete
- `LOSE` – game over

Each state controls its own update and transition rules.

---

### 8. Rendering & Performance
- Layered rendering pipeline:
  - Billboards / splash screens
  - Game objects (map, player, enemies, goals)
  - HUD (score, lives)
  - Text overlays
- Canvas caching:
  - Borders and maps rendered once per level
  - Minimizes draw calls during gameplay
- Explicit separation between logic and rendering layers.

---

### 9. Audio & Feedback
- Sound effects for:
  - Goal collection
  - Player damage
  - Shooting actions
- Audio pooling to avoid playback stutter.
- Designed for future expansion.

---

### 10. Debug & Dev Tooling
- Optional on-screen debug panel.
- Runtime toggles for:
  - Debug text
  - Hitbox visualization
- Fixed-step game loop for deterministic behavior.
- Safe startup checks to prevent race conditions before rendering begins.

---

## Design Philosophy
- No magic behavior
- No hidden state
- No framework abstractions
- Everything explicit and debuggable

This project prioritizes:
- Readable, inspectable code
- Modular systems with minimal coupling
- Difficulty tuning without rewrites
- Performance-first Canvas rendering
- Reusable engine-level concepts

---

## Future Ideas
- Expanded enemy AI behaviors
- Power-ups and modifiers
- Boss encounters
- Persistent high scores
- Mobile-friendly controls
- Additional visual polish

---

## Notes
This project is both:
- A revamp of the original **PUCKMAN**
- A real-world testbed for systems that will feed into the **HIT_ME HTML5 Game Engine**

Expect continued iteration, refactoring, and system hardening.
