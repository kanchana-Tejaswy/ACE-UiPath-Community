# 16 — Community Intelligence & Analytics

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Impact Metrics, Download Counters & Growth Telemetry  

---

## 1. Purpose
Track and demonstrate community growth and automation return on investment (ROI) for student encouragement, leadership reporting, and official **UiPath Academic Alliance** annual reviews.

---

## 2. Core KPI Telemetry
1. **Students Trained**: Count of unique students participating in chapter workshops.
2. **Production Bots Built**: Verified campus and enterprise automations.
3. **Certifications Earned**: UiPath Certified Associate and Professional holders.
4. **Manual Hours Saved**: Cumulative time saved by deployed software robots.

---

## 3. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- Impact counters on homepage rendered from `settings.totalStudentsTrained`, `settings.totalBotsBuilt`, etc.
- Local download count increment in `src/data/store.ts`.

### PLANNED (Decided & Approved)
- Dynamic SQL aggregations (`COUNT(*)`, `SUM(hours_saved)`).
- Privacy-first telemetry (GDPR/FERPA compliant, zero third-party tracking).

### FUTURE (Under Consideration)
- Real-time community growth graph showing semester-by-semester adoption.
