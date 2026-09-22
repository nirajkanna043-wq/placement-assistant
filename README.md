# AI-Based Placement Preparation Assistant — React Prototype

A working front-end prototype of the tool described in your proposal and
execution plan: students get a role-specific skill-gap analysis, a
prioritized weekly plan with explanations, and a readiness score; TPOs
get a batch-level dashboard. It runs entirely in the browser (no
database needed) so you can demo it immediately, with a clear seam to
plug in a real backend and LLM later.

## Quick start

```bash
npm install
npm run dev
```

Open the printed localhost URL. Data is kept in `localStorage`, so your
profile persists across refreshes; use "Reset demo data" in the sidebar
to start over.

## Project structure

```
src/
  data/mockData.js         Phase 3 — role→skill→weightage dataset,
                            curated resource map, diagnostic quiz bank,
                            seed batch for the TPO dashboard
  utils/skillGapEngine.js  Phase 2 — the core IP: rule-based skill-gap
                            matching, readiness score formula,
                            explainability, weekly-plan builder
  utils/llmClient.js       Phase 5 — AI/LLM layer contract (calls your
                            backend; falls back to a local template so
                            the demo works with zero setup)
  context/AppContext.jsx   Central state: student profile, skill levels,
                            quiz scores, progress, derived readiness score
  components/
    StudentOnboarding.jsx  Phase 1/4 — profile + target role selection
    SkillAssessment.jsx    Phase 3/4 — self-rating sliders + quizzes
    SkillGapDashboard.jsx  Phase 4 — ranked gap list + coverage chart
    WeeklyPlan.jsx         Phase 4/5 — recommendations + AI narrative
    ProgressTracker.jsx    Phase 4 — completion tracking, readiness score
    TPODashboard.jsx       Phase 4 — batch view, high-risk filter, role
                            averages
    Sidebar.jsx, ReadinessGauge.jsx   shared UI
  App.jsx                  Screen routing between student steps and the
                            TPO view

backend/                   Optional FastAPI service implementing the
                            AI/LLM layer from your Phase 2 architecture
                            table (Python + Anthropic API). Only needed
                            if you want real LLM-generated coaching
                            copy instead of the local fallback text.
```

## How this maps to the skill-gap algorithm

`computeSkillGap()` in `skillGapEngine.js` implements the "rule-based /
vector matching" approach your proposal recommends for the prototype:
each student skill and role requirement is a `{skill, level}` /
`{skill, weight}` pair, the gap is `max(0, required - current)`, and
gaps are ranked by `weight × gap` so the highest-impact missing skills
surface first. It's deliberately simple and fully explainable — every
number in the UI can be traced back to a rule, which is what
`explainRecommendation()` surfaces in the weekly plan.

## Wiring in the real AI/LLM layer

1. `cd backend && pip install -r requirements.txt`
2. `export ANTHROPIC_API_KEY=sk-ant-...`
3. `uvicorn main:app --reload --port 8000`
4. Copy `.env.example` to `.env` and set `VITE_BACKEND_URL=http://localhost:8000`
5. Restart `npm run dev` — the "Generate with AI" button on the Weekly
   Plan screen now calls the real model instead of the local template.

## Next steps toward the full execution plan

- **Persistence**: swap the `localStorage`-backed `AppContext` for calls
  to a real backend + PostgreSQL (Phase 2's suggested stack), so TPOs
  see actual student data instead of the seed batch.
- **Auth**: add real sign-up/login before the onboarding step (Phase 4).
- **Resume parsing**: extend the onboarding step with an upload + NLP
  skill-extraction call, feeding into `setSkillLevel` automatically.
- **Bigger datasets**: replace `mockData.js`'s `ROLES`/`RESOURCE_MAP`
  with the Kaggle/GitHub job-description dataset and a larger curated
  resource library described in Phase 3.
- **Pilot validation**: once real student data flows in, compare
  `readinessScore` against TPO manual assessments (Phase 6).
