# 39 — Activity Routing & URL Hash Synchronization Architecture

**Product**: ACE UiPath Community Digital Ecosystem  
**Interface**: Bidirectional Router in `src/App.tsx`  

---

## 1. Routing Behavior Rules

1. Clicking an activity card on `/activities` or `/` invokes `onNavigate('activity_detail', activity.slug)`.
2. `App.tsx` sets `currentView = 'activity_detail'`, `selectedDetailId = slug`, and updates `window.location.hash = '#activities/[slug]'`.
3. Navigating via browser Back/Forward triggers `popstate` and `hashchange` listeners, automatically rendering the target view and detail slug.
4. Refreshing the browser or opening `#activities/reframework-masterclass-2026` directly parses the hash on mount and loads the activity institutional memory record.
