# 14 — Challenges, Hackathons & Competitive Sprints

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Competitive Automation Sprints, Team Submissions & Hall of Champions  

---

## 1. Purpose
Drive hands-on competitive bot building under time constraints, identifying top student talent for leadership and industry placement.

---

## 2. Competition Formats
1. **Flagship Enterprise Hackathon**: 24-48h hackathons with ₹25,000+ prize pools.
2. **Monthly Bot Sprints**: 2-week focused capability challenges.
3. **Ideation & Architecture Sprints**: Solution blueprinting.
4. **Bug Bashes**: Finding and fixing intentional errors in REFramework workflows.

---

## 3. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- Challenges UI in [`src/pages/ChallengesPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/ChallengesPage.tsx) with countdown cards, evaluation criteria rubrics, team submission forms, and Hall of Hackathon Champions.
- 2 competitions seeded in [`src/data/initialData.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/data/initialData.ts).

### PLANNED (Decided & Approved)
- `challenges` and `challenge_submissions` PostgreSQL tables.
- Automated team submission confirmation emails.

### FUTURE (Under Consideration)
- Live real-time hackathon countdown timer with automated submission closure at deadline.
