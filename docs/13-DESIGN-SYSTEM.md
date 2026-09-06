# 13 — Design System & Visual Tokens

**Product**: ACE UiPath Community Digital Operating System  
**Aesthetic Benchmark**: Apple, Linear, Stripe, Framer, Vercel  
**Core Implementation**: CSS Custom Properties (`src/index.css`)  

---

## 1. Design Philosophy & Aesthetic Standards

> **The platform must NEVER look like a generic template or an AI-generated website.**

The visual system is engineered around:
1. **Technical Credibility**: Crisp typography, high-contrast dark mode, and precise micro-borders that evoke an enterprise developer tool.
2. **Branded UiPath Identity**: Radiant UiPath Electric Orange (`#FA4616`) reserved for focal actions, active states, and glowing timeline nodes.
3. **Purposeful Visual Restraint**: Glassmorphism and gradients are used subtly to create depth and layering, never as distracting decorative clutter.

---

## 2. Design Tokens Specification

### 2.1 Color Palette
```css
/* Surface Canvas */
--bg-primary: #07080B;       /* Deep Obsidian Canvas */
--bg-secondary: #0D0F16;     /* Elevated Surface / Card Background */
--bg-tertiary: #131722;      /* Input Fields & Nested Cards */
--bg-surface: #181D2A;       /* Active Hover Surface */

/* Brand & Accents */
--uipath-orange: #FA4616;       /* Primary Action & Brand Hero */
--uipath-orange-hover: #FF5A2E; /* Hover State */
--uipath-orange-glow: rgba(250, 70, 22, 0.25);
--uipath-orange-subtle: rgba(250, 70, 22, 0.12);

/* Status Accents */
--accent-blue: #0070F3;      /* Cloud & Orchestrator Badges */
--accent-emerald: #10B981;   /* Live Status, Passing Bots */
--accent-amber: #F59E0B;     /* Hackathon Prizes, Awards */

/* Text & Typography */
--text-primary: #F8FAFC;     /* Crisp High-Contrast Headlines */
--text-secondary: #94A3B8;   /* Body Paragraphs & Descriptions */
--text-muted: #64748B;       /* Metadata, Timestamps & Labels */

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.08);
--border-medium: rgba(255, 255, 255, 0.16);
--border-glow: rgba(250, 70, 22, 0.35);
```

---

## 3. Typography Hierarchy

* **Headings & Display**: `Space Grotesk`, sans-serif (Weights: 600, 700, 800; Letter-spacing: `-0.02em`).
* **Body & UI**: `Inter`, sans-serif (Weights: 400, 500, 600; Line-height: `1.6`).
* **Code & Variables**: `JetBrains Mono` / `Fira Code`, monospace (Weights: 400, 500).

---

## 4. Reusable Component Rules

1. **Buttons (`.btn`)**: Tactile micro-press feedback (`transform: translateY(-1px)` on hover; `translateY(0)` on active).
2. **Badges (`.badge`)**: Compact pill tags (`padding: 0.25rem 0.65rem`, uppercase `0.75rem`) for category identification.
3. **Glass Cards (`.glass-card`)**: `backdrop-filter: blur(12px)` with subtle `rgba(255,255,255,0.08)` border transitioning to orange glow on hover.
