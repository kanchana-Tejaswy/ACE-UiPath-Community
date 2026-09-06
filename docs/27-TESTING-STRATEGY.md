# 27 — Testing Strategy & Quality Assurance

**Product**: ACE UiPath Community Digital Operating System  
**Coverage**: Unit, Integration, End-to-End (E2E) & Accessibility  

---

## 1. Testing Frameworks
* **Unit & Component Testing**: Vitest + React Testing Library (Filter chips, time formatters, state reducers).
* **End-to-End Testing**: Playwright (User flows: Activity discovery, .XAML download, bot submission, Admin CMS editing).
* **Accessibility Auditing**: axe-core (WCAG 2.1 AA contrast and screen-reader accessibility).

---

## 2. Core E2E Verification Suites
1. **Public Exploration Suite**: Verify guest student can navigate to `/activities`, filter by `2024`, open `/activities/[slug]`, and download `.xaml` without receiving login prompts.
2. **Admin Mutation Suite**: Verify admin updates in `/admin` persist to PostgreSQL and reflect immediately on public pages.
3. **Security Perimeter Suite**: Verify unauthenticated users cannot trigger administrative mutations.

---

## 3. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- TypeScript compile-time type verification (`tsc --noEmit`).

### PLANNED (Decided & Approved)
- Automated Playwright E2E test runs in GitHub Actions CI pipeline on every Pull Request.

### FUTURE (Under Consideration)
- Visual regression testing with Percy / Chromatic to detect unexpected CSS shifts.
