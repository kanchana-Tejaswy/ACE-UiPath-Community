# 03 — Design System & Visual Tokens

**Product**: ACE UiPath Community Digital Operating System  
**Aesthetic Benchmark**: Apple, Linear, Stripe, Framer, Vercel  
**Implementation**: CSS Custom Properties ([`src/index.css`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/index.css))  

---

## 1. Visual Design Philosophy

The design target is **Premium SaaS + Modern Developer Platform + UiPath Ecosystem**.

* **Intentional & Polished**: High-contrast typography (`Inter` + `Space Grotesk`), subtle micro-borders (`rgba(255,255,255,0.08)`), and deep obsidian dark mode.
* **Branded UiPath Identity**: Radiant UiPath Electric Orange (`#FA4616`) reserved for focal actions, active status badges, and laser timeline nodes.
* **Restraint**: Gradients and glassmorphism are applied only to establish visual elevation, never as gratuitous decorative noise.

---

## 2. Token Specifications

### 2.1 Color Tokens
```css
--bg-primary: #07080B;       /* Deep Obsidian Canvas */
--bg-secondary: #0D0F16;     /* Card & Surface Layer */
--bg-tertiary: #131722;      /* Input Fields & Nested Rows */
--bg-surface: #181D2A;       /* Hover Elevation Surface */

--uipath-orange: #FA4616;       /* Primary Action & Brand Accent */
--uipath-orange-hover: #FF5A2E; /* Active Hover State */
--uipath-orange-glow: rgba(250, 70, 22, 0.25);
--uipath-orange-subtle: rgba(250, 70, 22, 0.12);

--text-primary: #F8FAFC;     /* Primary High-Contrast Text */
--text-secondary: #94A3B8;   /* Body Copy & Explanations */
--text-muted: #64748B;       /* Meta Tags & Timestamps */

--border-subtle: rgba(255, 255, 255, 0.08);
--border-medium: rgba(255, 255, 255, 0.16);
--border-glow: rgba(250, 70, 22, 0.35);
```

### 2.2 Typography Scale
* **Headings / Display**: `Space Grotesk`, sans-serif (Weights: 600, 700, 800; Letter-spacing: `-0.02em`).
* **Body / UI**: `Inter`, sans-serif (Weights: 400, 500, 600; Line-height: `1.6`).
* **Code / Selectors**: `JetBrains Mono` / `Fira Code`, monospace.

### 2.3 Radius & Spacing
* `--radius-sm`: `6px` (Badges, small inputs)
* `--radius-md`: `10px` (Cards, buttons)
* `--radius-lg`: `16px` (Panels, modal dialogs)
* `--radius-full`: `9999px` (Pill badges, avatars)

---

## 3. UI Component Catalog

1. **Buttons (`.btn`)**: `.btn-primary` (Orange solid glow), `.btn-secondary` (Slate outline), `.btn-outline` (Transparent orange hover).
2. **Cards (`.glass-card`)**: `backdrop-filter: blur(12px)` with subtle border transitioning to orange glow on hover.
3. **Badges (`.badge`)**: `.badge-orange`, `.badge-blue`, `.badge-green`, `.badge-purple`, `.badge-slate`.
4. **Timeline Laser Rail (`.timeline-rail`)**: Vertical orange gradient line with pulsing circle nodes (`.timeline-node`).
5. **Command Search Palette**: Modal triggered by `Ctrl+K` with real-time multi-entity query filter.

---

## 4. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- Complete design system tokens in `src/index.css`.
- Fully responsive across desktop (1280px+), tablet (768px), and mobile (375px).
- Dark mode optimized with high-contrast accessibility.

### PLANNED (Decided & Approved)
- Skeleton loading placeholder animations for server data fetching.
- Toast notification system for CRUD feedback and error states.

### FUTURE (Under Consideration)
- Optional Light Mode theme toggle with tailored enterprise high-contrast tokens.
