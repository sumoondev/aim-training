# Aim Trainer

A browser-based 3D aim training game built with React Three Fiber. Lock your pointer, click targets as fast as you can, and track your score, hits, misses, and accuracy over a timed round.

## Features

- **First-person aiming** via the Pointer Lock API — no mouse cursor, just raw camera look control
- **Randomly spawning targets** within a bounded 3D play area
- **30-second timed rounds** with a live HUD (timer + score)
- **Full game loop** — Ready → Playing → Paused → Ended, driven by a Zustand store
- **Post-round stats** — score, hits, misses, and accuracy
- **Pause/resume** on pointer-lock loss, plus an `R` key restart shortcut
- **Dev tooling** — Leva controls and an r3f-perf overlay for tuning the scene during development

## Tech Stack

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) / [Three.js](https://threejs.org/) for the 3D scene
- [drei](https://github.com/pmndrs/drei) for `PointerLockControls`, `Grid`, and other helpers
- [Zustand](https://github.com/pmndrs/zustand) for game state
- [Leva](https://github.com/pmndrs/leva) for live debug controls
- [r3f-perf](https://github.com/utsuboco/r3f-perf) for performance monitoring
- [Oxlint](https://oxc.rs/) for linting

## Getting Started

### Prerequisites

- Node.js and npm

### Installation

```bash
git clone https://github.com/sumoondev/aim-training.git
cd aim-training
npm install
```

> Note: `zustand` is used by the game store (`src/Experience/stores/useGame.jsx`) but isn't currently listed in `package.json`'s dependencies. If `npm install` doesn't pull it in, add it manually:
> ```bash
> npm install zustand
> ```

### Development

```bash
npm run dev
```

Opens the app with hot module reloading via Vite.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## How to Play

1. Click **START** to lock your pointer and enter the scene.
2. Move your mouse to aim, and click the red spheres to score points.
3. Score as many hits as possible before the 30-second timer runs out.
4. Losing pointer lock (e.g. pressing `Esc`) pauses the game — click **RESUME** to continue.
5. Press `R` at any time (once a round has started) to restart, or click **PLAY AGAIN** on the results screen.

## Project Structure

```
src/
├── Crosshair.jsx                 # Fixed center-screen crosshair overlay
├── main.jsx                      # App entry point, sets up the R3F <Canvas>
├── Experience/
│   ├── Experience.jsx            # Scene setup: lighting, controls, room, target
│   ├── Interface.jsx             # HUD + game-phase screens (ready/paused/ended)
│   ├── components/
│   │   ├── Room.jsx              # Static environment geometry
│   │   └── Target.jsx            # Target spawning & hit/miss detection
│   └── stores/
│       └── useGame.jsx           # Zustand store: phase, score, hits, misses
└── styles/                       # CSS for HUD and crosshair
```

## License

MIT © Sumoon Byanjankar — see [LICENSE](LICENSE) for details.