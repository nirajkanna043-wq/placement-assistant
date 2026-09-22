// ---------------------------------------------------------------------------
// Skill-gap engine
// Rule-based / vector-matching approach (Phase 2 recommendation): a
// student's skills and a role's required skills are represented as vectors
// keyed by skill name, and the gap is the weighted shortfall between them.
// Deliberately explainable (no black-box ML) so every output can be traced
// back to a rule — this is what "Add explainability" in Phase 5 asks for.
// ---------------------------------------------------------------------------

/**
 * @param {{skill: string, level: number}[]} studentSkills  level is 0-100 self-rated or quiz-derived
 * @param {{skill: string, weight: number}[]} roleRequirements
 * @returns {{
 *   gaps: {skill: string, required: number, current: number, gap: number, weight: number, status: string}[],
 *   coveragePercent: number
 * }}
 */
export function computeSkillGap(studentSkills, roleRequirements) {
  const studentMap = new Map(studentSkills.map((s) => [s.skill, s.level]));

  const gaps = roleRequirements.map(({ skill, weight }) => {
    const current = studentMap.get(skill) ?? 0;
    const required = 70; // proficiency bar considered "placement ready" for a skill
    const gap = Math.max(0, required - current);
    let status = 'strong';
    if (current === 0) status = 'missing';
    else if (gap > 30) status = 'weak';
    else if (gap > 0) status = 'developing';
    return { skill, required, current, gap, weight, status };
  });

  // Weighted coverage: how much of the role's total weight is "met" (current/required, capped at 1)
  const totalWeight = roleRequirements.reduce((sum, r) => sum + r.weight, 0);
  const earnedWeight = gaps.reduce((sum, g) => {
    const fraction = Math.min(1, g.current / g.required);
    return sum + fraction * g.weight;
  }, 0);
  const coveragePercent = totalWeight === 0 ? 0 : Math.round((earnedWeight / totalWeight) * 100);

  // Rank gaps by impact = weight * (gap size), so high-weight missing skills surface first
  const ranked = [...gaps].sort((a, b) => b.weight * b.gap - a.weight * a.gap);

  return { gaps: ranked, coveragePercent };
}

/**
 * Readiness score formula (Phase 5): combines
 *  - skill coverage percentage (from computeSkillGap)
 *  - quiz performance (0-100 average across attempted quizzes)
 *  - progress completion (% of recommended resources marked complete)
 * Weights are explicit and tunable — kept interpretable rather than learned.
 */
export function computeReadinessScore({ coveragePercent, quizAvg, progressCompletion }) {
  const weights = { coverage: 0.5, quiz: 0.25, progress: 0.25 };
  const score =
    coveragePercent * weights.coverage +
    quizAvg * weights.quiz +
    progressCompletion * weights.progress;
  return Math.round(score);
}

/**
 * Builds a short, human-readable explanation for why a resource/skill was
 * recommended — used by the "Add explainability" step in Phase 5 so every
 * suggestion is traceable to a rule rather than a black box.
 */
export function explainRecommendation(gapEntry) {
  const { skill, weight, status, current, required } = gapEntry;
  if (status === 'missing') {
    return `${skill} carries ${weight}% weight for this role and no proficiency is recorded yet — closing this gap first has the largest effect on readiness.`;
  }
  if (status === 'weak') {
    return `Current level (${current}/${required}) is well below the placement-ready bar for ${skill}, a ${weight}%-weighted skill for this role.`;
  }
  return `${skill} is developing (${current}/${required}) — a short refresher should close the remaining gap.`;
}

/** Turns a ranked gap list into a prioritized weekly plan (Phase 4/5). */
export function buildWeeklyPlan(gaps, resourceMap, weeks = 4) {
  const actionable = gaps.filter((g) => g.status !== 'strong').slice(0, weeks * 2);
  const plan = Array.from({ length: weeks }, (_, i) => ({ week: i + 1, items: [] }));

  actionable.forEach((gap, idx) => {
    const week = plan[idx % weeks];
    const resources = resourceMap[gap.skill] || [];
    week.items.push({
      skill: gap.skill,
      status: gap.status,
      explanation: explainRecommendation(gap),
      resources: resources.slice(0, 2),
    });
  });

  return plan.filter((w) => w.items.length > 0);
}
