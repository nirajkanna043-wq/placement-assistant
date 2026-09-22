// ---------------------------------------------------------------------------
// AI/LLM layer (Phase 5 of the execution plan)
//
// In production this should call YOUR OWN backend (e.g. a FastAPI/Django
// or Node route), which in turn calls the Anthropic/OpenAI API with your
// server-side API key. Never call the LLM provider directly from the
// browser — that would expose your API key.
//
// Expected backend contract:
//   POST /api/generate-plan
//   body: { studentName, role, plan }
//   response: { narrative: string }
//
// Below is a fetch call to that backend, with a local fallback so the
// frontend demo still works if no backend is running yet.
// ---------------------------------------------------------------------------

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export async function generatePlanNarrative({ studentName, role, plan }) {
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, role, plan }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.narrative;
      }
    } catch (e) {
      // fall through to local fallback below
    }
  }

  return localFallbackNarrative({ studentName, role, plan });
}

/** Deterministic, template-based narrative used when no backend/API key is configured yet. */
function localFallbackNarrative({ studentName, role, plan }) {
  const greeting = studentName ? `Hi ${studentName},` : 'Hi,';
  const totalSkills = plan.reduce((sum, w) => sum + w.items.length, 0);
  const lines = [
    `${greeting} here's your ${plan.length}-week plan toward ${role}.`,
    `You have ${totalSkills} skill areas to work through, prioritized by how much each one affects your readiness score.`,
    ...plan.map((w) => `Week ${w.week}: focus on ${w.items.map((i) => i.skill).join(', ')}.`),
    `Work through the linked resources and check them off as you go — your readiness score updates automatically.`,
  ];
  return lines.join('\n');
}
