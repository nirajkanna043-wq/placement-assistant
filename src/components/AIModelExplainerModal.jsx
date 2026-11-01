import React from 'react';

export default function AIModelExplainerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-line rounded-lg max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 bg-runway text-white rounded font-bold">
              ACADEMIC VIVA SPEC
            </span>
            <h3 className="font-display text-xl font-semibold">AI System Architecture & Methodologies</h3>
          </div>
          <button onClick={onClose} className="text-ink/40 hover:text-ink text-xl leading-none">
            &times;
          </button>
        </div>

        <p className="text-xs text-ink/70 mb-5 leading-relaxed">
          This system was engineered as an <strong>Artificial Intelligence & Machine Learning course project</strong>. It implements foundational AI algorithms across Information Extraction (NLP), Adaptive Knowledge Tracing, Explainable AI (XAI) Classifiers, and Conversational Rubric Evaluation.
        </p>

        <div className="space-y-4">
          {/* Module 1 */}
          <div className="border border-line rounded p-4 bg-paper/40">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="font-medium text-sm text-runway">
                1. NLP Resume Parser & Semantic Entity Extractor
              </h4>
              <span className="font-mono text-[10px] bg-paper px-2 py-0.5 rounded border border-line">
                NLP / Information Extraction
              </span>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed mb-2">
              Preprocesses raw text through tokenization, punctuation filtering, and multi-scale n-gram generation (unigrams to trigrams). Matches against a weighted domain taxonomy with keyword density formulas:
            </p>
            <div className="bg-ink text-amber font-mono text-[11px] p-2.5 rounded">
              Confidence = min(95, 35 + (hits × 18) + (density × 4) + bonus_multiword)
            </div>
          </div>

          {/* Module 2 */}
          <div className="border border-line rounded p-4 bg-paper/40">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="font-medium text-sm text-runway">
                2. Bayesian Knowledge Tracing (BKT) & Item Response Theory (IRT)
              </h4>
              <span className="font-mono text-[10px] bg-paper px-2 py-0.5 rounded border border-line">
                Adaptive AI Assessment
              </span>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed mb-2">
              Models candidate latent skill mastery \(P(L_t)\) using Bayesian updates accounting for slip probabilities \(P(S) = 0.10\) and guess rates \(P(G) = 0.25\):
            </p>
            <div className="bg-ink text-amber font-mono text-[11px] p-2.5 rounded">
              P(L_t | Correct) = [P(L) · (1 - S)] / [P(L)·(1 - S) + (1 - P(L))·G]
              <br />
              P(L_{t+1}) = Posterior + (1 - Posterior) · LearningRate
            </div>
          </div>

          {/* Module 3 */}
          <div className="border border-line rounded p-4 bg-paper/40">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="font-medium text-sm text-runway">
                3. Placement Probability Predictor & Explainable AI (XAI)
              </h4>
              <span className="font-mono text-[10px] bg-paper px-2 py-0.5 rounded border border-line">
                Machine Learning / XAI
              </span>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed mb-2">
              A calibrated Logistic Regression classifier predicts campus placement probability \(\sigma(z)\). Features include skill coverage, verified diagnostic scores, roadmap velocity, mock interview performance, and ATS alignment.
            </p>
            <div className="bg-ink text-amber font-mono text-[11px] p-2.5 rounded mb-2">
              z = β₀ + β₁·Coverage + β₂·Quiz + β₃·Roadmap + β₄·Interview + β₅·ATS
            </div>
            <p className="text-xs text-ink/70 leading-relaxed">
              <strong>Explainable AI (SHAP-style Decomposition):</strong> Decomposes output into marginal feature attributions \(\phi_i = w_i(x_i - \bar{x}_i)\), providing complete transparency on positive drivers and risk factors.
            </p>
          </div>

          {/* Module 4 */}
          <div className="border border-line rounded p-4 bg-paper/40">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="font-medium text-sm text-runway">
                4. Automated AI Mock Interview Rubric Evaluator
              </h4>
              <span className="font-mono text-[10px] bg-paper px-2 py-0.5 rounded border border-line">
                Conversational Heuristics / LLM
              </span>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed">
              Evaluates spoken/written candidate responses across 3 distinct dimensions: Technical Vocabulary Density, STAR (Situation, Task, Action, Result) methodology compliance, and communication conciseness. Provides immediate exemplar gold-standard comparisons.
            </p>
          </div>

          {/* Module 5 */}
          <div className="border border-line rounded p-4 bg-paper/40">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="font-medium text-sm text-runway">
                5. TPO Batch Cohort Clustering
              </h4>
              <span className="font-mono text-[10px] bg-paper px-2 py-0.5 rounded border border-line">
                Unsupervised Clustering / Analytics
              </span>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed">
              Segments large campus student batches into actionable pedagogical clusters (Direct Placement Ready, Core Tech Deficit, Assessment Gap, At-Risk) with automated institutional intervention recommendations.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-line flex justify-end">
          <button
            onClick={onClose}
            className="bg-ink text-white text-xs px-5 py-2.5 rounded hover:bg-ink/90"
          >
            Close Methodology Spec
          </button>
        </div>
      </div>
    </div>
  );
}
