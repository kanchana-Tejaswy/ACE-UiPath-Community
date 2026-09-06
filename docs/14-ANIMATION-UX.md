# 14 — Motion Design & Micro-Interaction UX

**Product**: ACE UiPath Community Digital Operating System  
**Motion Philosophy**: Purposeful, Meaningful, Restrained & High-Performance  

---

## 1. Motion Principles

1. **Meaning Over Decoration**: Animations must communicate state transitions, spatial relationships, or execution status (e.g., active bots pulsing, timeline progression).
2. **Speed & Physics**: Interactions utilize smooth cubic-bezier easing (`cubic-bezier(0.16, 1, 0.3, 1)`) with durations under 250ms to ensure the UI feels instantaneous and responsive.
3. **Accessibility**: Strict respect for `prefers-reduced-motion: reduce`.

---

## 2. Core Motion Implementations

1. **Laser-Rail Timeline Pulse**: Animated vertical gradient line and pulsing node markers (`@keyframes pulseGlow`) indicating active/upcoming activities.
2. **Card Hover Elevations**: Subtle 2px elevation with smooth glow transition (`var(--transition-smooth)`).
3. **Command Palette (`Ctrl+K`) Modal**: Instant 50ms fade-and-scale overlay with automatic input focus.
4. **Interactive Journey Selector**: Instant tab highlight shift with zero layout thrashing.
