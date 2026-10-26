# Techfest 2027 — The Future Unfolds

**An immersive, scroll-driven 3D web experience for Asia's largest science & technology festival.**
A single-page WebGL universe where scrolling flies a camera through six technological futures — AI, Robotics, Space, Quantum, Sustainability and Human Innovation — while the festival's content (events, competitions, speakers, schedule, registration) scrolls over the top of the live 3D scene.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Three.js](https://img.shields.io/badge/three.js-r185-black?logo=three.js)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## Highlights

- **Scroll-driven 3D journey** — a `CatmullRomCurve3` camera spline threads nine sections; scroll position, velocity and mouse input drive the camera every frame through React Three Fiber.
- **Six WebGL worlds** — neural city, assembly line, orbital space, quantum realm, sustainability grid and human innovation hall, each with its own accent palette and props.
- **Custom GLSL core** — the morphing Techfest core is a hand-written vertex/fragment shader pair (`src/components/canvas/shaders/`) with noise-driven displacement, a wireframe shell and an instanced particle field that reacts to section, scroll velocity and pointer.
- **Post-processing stack** — bloom, chromatic aberration and vignette tuned per frame via `@react-three/postprocessing`.
- **Content over canvas** — a transparent document layer scrolls *over* the fixed WebGL canvas, so the festival's full content modules (events, robo wars, exhibition, gallery, speakers, sponsors, schedule, timeline) are normal, accessible, crawlable HTML.
- **Gamified exploration** — XP achievement system with levels and unlocks persisted in `sessionStorage`, five hidden easter eggs, a Nova assistant and a `⌘K` command palette covering every section.
- **Accessibility built in** — `prefers-reduced-motion` honoured on first paint, a persistent reduced-motion toggle, focus-visible styling, keyboard-reachable search and mobile navigation.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | React 19, TypeScript 5 |
| 3D | [three](https://threejs.org) r185, `@react-three/fiber` 9, `@react-three/drei` 10, `@react-three/postprocessing` 3 |
| Animation | GSAP + `@gsap/react`, Framer Motion 13, Lenis smooth scrolling |
| Styling | Tailwind CSS 4 (CSS-first `@theme` config) + CSS custom-property design tokens |
| State | Zustand 5 (selector-based subscriptions) |
| Fonts | Clash Display + Satoshi (Fontshare), JetBrains Mono (`@fontsource`) |

## Getting started

**Requirements:** Node.js **20.9+** (Node 22 LTS recommended) and npm.

```bash
git clone https://github.com/dolambikaachyutha/techfest3d-.git
cd techfest3d-
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the boot sequence plays once, then scroll.

No environment variables or API keys are required; the site runs fully client-side.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Production build with type checking |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

> **Note:** Next.js 16 no longer runs ESLint as part of `next build` — lint is the separate command above, and TypeScript is still type-checked during the build.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│  z-30  Boot sequence / flash cards / nav (fixed)         │
│  z-20  Content modules — normal document flow            │
│        (scrolls over the canvas on a transparent bg)     │
│  z-10  Hero overlay, section label, hologram panel       │
│  z-0   Fixed WebGL <Canvas> — always rendering           │
└──────────────────────────────────────────────────────────┘
                     ▲
     1200vh spacer drives the camera through the spline
```

1. `src/app/page.tsx` renders a fixed `<Canvas>` plus fixed overlays, then a **1200vh spacer** that gives the 3D journey room to scroll, then the content modules in normal flow.
2. `InputTracker` inside the canvas writes scroll progress, velocity and the active section into the Zustand store **and** into refs updated every frame, so the render loop never waits on React state.
3. `getCameraState(progress)` in `src/lib/cameraPath.ts` samples the camera spline and returns position, look-at and FOV for that point of the journey.
4. Each section scene (`src/components/canvas/sections/*`) reads the store and morphs its props in; the core shader cross-fades colour, noise frequency and scale per section.

### Project structure

```
src/
├── app/
│   ├── layout.tsx          # Metadata, fonts, viewport
│   ├── page.tsx            # Layer composition + scroll spacer
│   ├── globals.css         # Design tokens (@theme) + base styles
│   └── not-found.tsx
├── components/
│   ├── canvas/             # WebGL layer (client-only, ssr: false)
│   │   ├── Experience.tsx      # Canvas, camera rig, post-processing
│   │   ├── TechfestCore.tsx    # Morphing shader core
│   │   ├── shaders/            # GLSL sources + bundled strings
│   │   └── sections/           # The six world scenes
│   └── ui/                 # HTML overlay + content modules
│       ├── Nav.tsx, MobileNav.tsx, HeroOverlay.tsx, LoadingScreen.tsx
│       ├── EventsHub, CompetitionsGalaxy, RobowarsArena, ExhibitionCity,
│       │   Gallery, Speakers, SponsorsUniverse, ScheduleTimeline,
│       │   TimelineTunnel, AboutSection, ImpactCTA, FooterCore
│       ├── WorldSelector, RegistrationFlow, RotatingCarousel3D
│       └── NovaAI, AchievementSystem, SearchMultiverse, AudioSystem,
│           EasterEggs, SentientIdle, ReducedMotionToggle, CursorFollower
└── lib/
    ├── constants.ts        # Palette, section map, camera ranges, timing
    ├── cameraPath.ts       # CatmullRom camera spline
    └── store.ts            # Zustand app store + selectors
```

## Design system

All tokens live in [`src/app/globals.css`](src/app/globals.css) and [`src/lib/constants.ts`](src/lib/constants.ts) — components never hardcode hex values.

| Token | Value | Role |
|---|---|---|
| `--void` | `#05060A` | Background |
| `--deep-slate` | `#0C1220` | Panel surfaces |
| `--signal-cyan` | `#4CE0D2` | Primary / AI accent |
| `--plasma-magenta` | `#FF3D8A` | Alert / highlight |
| `--solar-amber` | `#FFB347` | Sustainability accent |
| `--quantum-violet` | `#8B5CF6` | Quantum accent |
| `--ice` / `--ice-dim` | `#EAF2FF` / `#9AACC4` | Text primary / secondary |

Typography: **Clash Display** (display), **Satoshi** (body), **JetBrains Mono** (HUD labels and code-styled UI).

## Interactive systems

- **Boot sequence** — a terminal-style boot screen gates the experience until the scene is ready.
- **Command palette** — `⌘K` / `Ctrl+K` searches events, competitions and sections, `Esc` closes it.
- **Nova assistant** — a contextual chat-style helper with per-section tips on first visit.
- **Achievements** — XP, level-ups, discovery orbs and toasts, persisted in `sessionStorage`.
- **Ambient audio** — a per-world Web Audio oscillator (opt-in, off by default) retunes as you move between sections.
- **Sentient idle** — the scene reacts when you stop interacting; hidden easter eggs reward triple-clicks and off-path exploration.
- **Reduced motion** — honours `prefers-reduced-motion` on mount and exposes a manual toggle that flattens scroll-driven animation.

## Building for production

```bash
npm run build   # type-checked production build
npm start       # serve it locally
```

The output is a standard Next.js build and deploys to any Node host (Vercel, Netlify, or `next start` behind your own server). `next.config.ts` pins Turbopack's root to this directory so builds stay deterministic regardless of lockfiles higher up the filesystem.

## Roadmap / known gaps

- `npm run lint` currently reports pre-existing warnings and errors from the React Compiler rules enabled by `eslint-config-next` 16 — none of them block the build.
- Content (speakers, events, sponsors, schedule) is currently authored inline in the components; moving it to a CMS or JSON source is the natural next step.

---

Built with Next.js, React Three Fiber and far too much cyan.
