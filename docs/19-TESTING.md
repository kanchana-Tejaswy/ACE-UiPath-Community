# 19 — Testing & Quality Assurance Strategy

**Product**: ACE UiPath Community Digital Operating System  
**Coverage**: Unit, Integration, End-to-End (E2E), Accessibility & Data Integrity  

---

## 1. Testing Pyramid

```text
       ▲
      / \     E2E Tests (Playwright: Critical User Paths)
     /───\    
    /     \   Integration Tests (API Routes, Server Actions, RLS)
   /───────\  
  /         \ Unit Tests (Data parsers, time formatters, filter logic)
 ─────────────
```

---

## 2. Critical End-to-End (E2E) Test Scenarios

### Test Suite 1: Frictionless Public Exploration
* **Scenario**: A guest visitor navigates to `/activities`, applies the "2024" filter, opens an activity detail page, and clicks "Download .XAML Starter".
* **Assertion**: Page renders instantly without prompting for login; download triggers successfully.

### Test Suite 2: Zero-Code Admin Mutation & Multi-User Propagation
* **Scenario**:
  1. Browser A (Admin): Logs into `/admin`, changes hero tagline to "Automate Everything 2026", and saves.
  2. Browser B (Student on separate incognito session): Navigates to `/`.
* **Assertion**: Browser B receives the updated tagline immediately upon loading.

### Test Suite 3: Security & Authorization Perimeter
* **Scenario**: An unauthenticated user attempts to send a `POST /api/admin/activities` or `PUT /api/admin/settings`.
* **Assertion**: Server returns `401 Unauthorized` / `403 Forbidden`; database remains unaltered.

---

## 3. Automated Quality Commands

```bash
# Type check & lint
npm run lint
npx tsc --noEmit

# Unit & integration tests
npm run test

# End-to-end browser automation
npx playwright test
```
