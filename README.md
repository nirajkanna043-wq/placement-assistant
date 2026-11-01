# AI-Powered Placement Preparation Assistant & Predictor

An intelligent, full-stack placement readiness platform developed as an **Artificial Intelligence Course Project**. The system bridges the gap between student competencies and campus recruitment benchmarks using state-of-the-art AI and Machine Learning methodologies: **Natural Language Processing (NLP)** for resume parsing, **Bayesian Knowledge Tracing (BKT)** for adaptive skill diagnostic testing, **Calibrated Logistic Regression & Explainable AI (XAI)** for placement probability forecasting, and an **Automated Conversational Mock Interview Simulator** evaluated against industry rubrics.

---

## 🧠 Core AI & Machine Learning Architectures

### 1. NLP Resume Parser & Semantic Entity Extractor
- **Technique**: Tokenization, n-gram generation (unigram to trigram), stop-word removal, and domain taxonomy ontology mapping.
- **Function**: Parses unstructured resume text or project portfolios. Evaluates technical keyword density, context, and semantic frequency against target role requirements.
- **ATS Match Score**: Computes weighted alignment percentage and detects missing ATS keywords required by recruitment screeners.

### 2. Bayesian Knowledge Tracing (BKT) & Adaptive Diagnostics
- **Technique**: Bayesian updates based on Item Response Theory (IRT).
- **Formulation**: Models latent candidate mastery $P(L_t)$ per competency:
  $$P(L_t \mid \text{Observation}) = \frac{P(L)(1 - S)}{P(L)(1 - S) + (1 - P(L))G}$$
  $$P(L_{t+1}) = \text{Posterior} + (1 - \text{Posterior}) \cdot T$$
  *(where $S = 0.10$ slip probability, $G = 0.25$ guess probability, and $T$ is the learning transition rate).*
- **Adaptive Questions**: Automatically adjusts across Novice, Intermediate, and Advanced tiers, providing in-depth pedagogical AI explanations for every answer.

### 3. Predictive Placement Classifier & Explainable AI (XAI)
- **Model**: Multi-factor Calibrated Logistic Regression trained against recruitment benchmarks:
  $$P(\text{Placement}) = \sigma\left(\beta_0 + \sum_{i=1}^n \beta_i x_i\right) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 \cdot \text{Coverage} + \beta_2 \cdot \text{Quiz} + \beta_3 \cdot \text{Roadmap} + \beta_4 \cdot \text{Interview} + \beta_5 \cdot \text{ATS})}}$$
- **Explainable AI (SHAP-style Feature Attribution)**: Decomposes predictions into exact positive drivers and risk factors:
  $$\phi_i = w_i \cdot (x_i - \bar{x}_i)$$
- **Interactive What-If Sensitivity Simulator**: Allows candidates to simulate the marginal placement probability gain achieved by closing a specific competency gap.

### 4. AI Mock Interview Simulator (STAR Method Evaluator)
- **Evaluation Engine**: Automated rubric scoring evaluating candidates across:
  1. Technical Depth & Domain Terminology Density
  2. STAR (Situation, Task, Action, Result) Framework Compliance
  3. Communication Clarity & Conciseness
- **Pedagogical Feedback**: Highlights key candidate strengths, pinpoints missing considerations, and provides a benchmark Gold Standard / Exemplary Answer.

### 5. Unsupervised Cohort Clustering for Placement Officers (TPO)
- **Technique**: K-Means distance-based batch segmentation.
- **Clusters**:
  - *Tier-1 Placement Ready*
  - *Core Tech Deficit (High Potential)*
  - *Assessment Gap (Needs Practice)*
  - *At-Risk (Remedial Action Needed)*
- **Batch Intervention Strategy**: Generates institutional recommendations (e.g. targeted bootcamp recommendations) to optimize batch placement conversion rates.

### 6. Multi-Mode Generative AI Mentor
- Runs **100% autonomously in the browser** with zero external API dependencies via built-in AI heuristics.
- Optional Google Gemini / Anthropic API support for real-time live LLM coaching and question answering.

---

## 🚀 Running the Project

### Local Development
```bash
# Clone the repository
git clone https://github.com/nirajkanna043-wq/placement-assistant.git
cd placement-assistant

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Production Build & GitHub Pages Deployment
```bash
npm run build
npx gh-pages -d dist
```

---

## 📂 Project Structure

```
src/
├── data/
│   └── mockData.js               # Role competencies, weights, curated learning resources
├── utils/
│   ├── aiNlpEngine.js            # NLP resume entity extractor & ATS keyword scoring
│   ├── aiPredictiveModel.js      # Logistic regression, SHAP XAI attribution, & cohort clustering
│   ├── aiAdaptiveQuiz.js         # Bayesian Knowledge Tracing & IRT diagnostic question bank
│   ├── aiInterviewEngine.js      # Mock interview questions, rubric evaluator, & STAR scoring
│   ├── skillGapEngine.js         # Core algorithmic skill-gap matching & readiness formulas
│   └── llmClient.js              # Multi-mode AI client (Gemini / Anthropic / local synthesizer)
├── context/
│   └── AppContext.jsx            # Unified application state, ML inference pipeline, & persistence
├── components/
│   ├── StudentOnboarding.jsx     # Profile setup with AI Resume Scanner trigger
│   ├── ResumeParserModal.jsx     # Interactive NLP resume parsing modal with benchmark samples
│   ├── SkillAssessment.jsx       # Sliders + Adaptive Bayesian diagnostic quizzes with AI reasoning
│   ├── SkillGapDashboard.jsx     # Proficiency charts, ML probability gauge, XAI waterfall, & What-If simulator
│   ├── AIMockInterview.jsx       # Interactive AI Mock Interview round simulator & rubric feedback
│   ├── WeeklyPlan.jsx            # Personalized roadmap with interactive Ask AI Placement Mentor
│   ├── ProgressTracker.jsx       # Milestone completion tracking & readiness updates
│   ├── TPODashboard.jsx          # Institutional batch analytics & K-Means student clustering
│   ├── AIModelExplainerModal.jsx # Academic AI architecture & Viva evaluation guide
│   └── Sidebar.jsx               # Navigation, real-time ML metrics, and AI configuration
```
