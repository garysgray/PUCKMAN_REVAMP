![Game Splash](PUCKMAN_REVAMP/assets/sprites/billBoards/gameSplash.png)

# PUCKMAN (Revamped)

A modern rebuild of the classic HTML5 **PUCKMAN** game.  

Focuses on **modular architecture, deterministic collision handling, procedural level generation, and flexible input systems**, while preserving the original arcade gameplay.

Built entirely with **vanilla JavaScript and HTML5 Canvas** — no frameworks, bundlers, or build steps required. Runs directly in modern browsers.

---

## Tech Stack
- Vanilla JavaScript (ES6+)
- HTML5 Canvas
- HTML5 Gamepad API
- No frameworks, bundlers, or build tools
- Runs in Chrome, Firefox, and Edge

---

## Core Systems & Features

### 1. Procedural Map & Level Generation
- Grid-based procedural maps with **walkable paths**
- Walls placed safely without overlapping player spawns or goals
- Difficulty scales with **level tiers**
- Configurable generation parameters:
  - `mapSafeMargin` – prevents spawns near borders
  - `mapLaneSpacing` – controls wall spacing
  - `mapEmptyChance` – balance of open space vs walls
  - `mapSpawnRadius` – protected area around player
- Map and borders cached after generation for efficiency
- Ensures all goals are reachable
- Safe initialization prevents overlap with player, enemies, or map edges

---

### 2. Level Progression
- Infinite levels with **difficulty tiers**
- Goal count, enemy AI, and map density scale with level
- Score and level-specific modifiers applied automatically
- Progression triggered when all goals are collected
- Supports automatic reset and next-level transition

---

### 3. Goals & Objectives
- Configurable number of goals per level
- Placement avoids walls, enemies, and player spawns
- Goal collection:
  - Increases score via `scoreManager`
  - Plays audio feedback
  - Advances game state
- Fully collision-aware
- Supports dynamic repositioning if blocked

---

### 4. Player & Movement
- `Player` extends **GameObject**
- Keyboard support: WASD & Arrow keys
- Gamepad support via HTML5 Gamepad API
- Smooth movement with diagonal normalization
- Collision-aware movement prevents tunneling
- Interactions:
  - Goals → score and state update
  - Enemies → life reduction
- Handles runtime input changes without breaking movement

---

### 5. Enemy / NPC System
- `Enemy` extends **GameObject**
- AI states:
  - `ROAM`
  - `FOLLOW`
  - `STOP`
- Integrated with collision system
- Movement respects map layout and player position
- Avoids goals and spawn conflicts
- Designed for easy extension with additional behaviors

---

### 6. Input System
- Unified input for **keyboard + gamepad**
- Per-frame input clearing prevents stuck/repeated actions
- Clean separation between held inputs and one-shot presses
- Supports pause, state switching, and runtime toggling
- Prevents accidental browser scrolling or focus issues

---

### 7. Game States
- `INIT` – startup and splash screen
- `PLAY` – active gameplay
- `PAUSE` – paused state
- `WIN` – level complete
- `LOSE` – game over
- `TOP_SCORE` – high score entry screen
- Each state manages its own update loop and rendering rules
- State transitions are deterministic and reset properly
- Guards prevent double-entry and timing race conditions

---

### 8. Score & High Score Management
- `scoreManager` tracks score, bonuses, and extra lives
- Automatic calculation of:
  - Goal rewards
  - Time bonuses
  - Win bonuses
- Tracks high scores in a top-10 table
- Handles player initials entry at high score screen
- High score persistence ready for local storage integration
- HUD displays current score and remaining lives

---

### 9. Collision System
- `GameObject` provides:
  - `getHitbox()`
  - `tryMoveWithCollision()`
- Utility functions:
  - `rectsCollide()`
  - `roughNear()`
  - `overlapsAny()`
  - `checkPlayerGameObjCollisions()`
- Handles collisions with map, player, enemies, and goals
- Optimized for performance
- Prevents tunneling and overlap glitches

---

### 10. HUD & Rendering
- Dynamic HUD placement based on canvas size
- Rendering pipeline:
  - Background / splash screens
  - Game objects (map, player, enemies, goals)
  - HUD (score, lives, level)
  - Text overlays
- Map and borders rendered once per level for efficiency
- Optional debug overlay shows hitboxes, entity positions, and runtime info
- Flexible layering allows easy addition of visual effects

---

### 11. Audio
- Audio pooling prevents playback issues
- Fully integrated with game state changes
- Supports per-event sounds:
  - Goal pickup
  - Hurt
  - Life gained
  - Win/lose

---

### 12. Timers & Timing Control
- Centralized timer system replaces ad-hoc `setTimeout`
- Timers used for:
  - State transition delays
  - Game clock
  - Last-life lose delay
- Prevents timing drift and state-related race conditions
- Makes timing behavior explicit and debuggable

---

### 13. Fullscreen & Display Handling
- Optional fullscreen mode
- Canvas dynamically resizes with window and fullscreen changes
- Maintains correct aspect ratio and HUD positioning
- Supports both embedded arcade layout and fullscreen play
- Supports both embedded arcade layout and fullscreen play

---

### 14. Project Structure & Modularity
- Code split into focused files by responsibility:
  - Game loop
  - State handlers
  - Entities
  - Input
  - Collision
  - Timers
  - Rendering
  - Score & high score management
- Reduces coupling between systems
- Supports gradual evolution toward a lightweight game engine
- Easier debugging and refactoring

---

### 15. Game Instructions 
- Instructions for Keyboard and Gamepad users
- Better basic gameplay instructions added
- Arcade like message system using HTML and CSS
- Instructions fade in and out on rotation when not in Full Screen

---

### 16. Debug & Development
- Optional on-screen debug panel
- Hitbox visualization
- Safe initialization checks prevent race conditions
- Fixed-step game loop ensures consistent updates
- Console logging for debugging

---

## Design Principles
- **Explicit behavior** – predictable and testable
- **Modular systems** – minimal coupling
- **Deterministic collisions** – avoids glitches
- **Performance-aware** – optimized Canvas rendering
- **Debug-friendly** – easy to inspect and reason about
- **Extendable** – supports new entities, input, or map rules

---

## Future Work
- Expanded enemy AI behaviors
- Power-ups and modifiers

