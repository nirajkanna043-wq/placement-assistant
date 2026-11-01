# AI-Powered Placement Preparation Assistant & Predictor (Ultra Edition)

An enterprise-grade, comprehensive placement readiness platform built as an **Artificial Intelligence & Machine Learning Course Capstone Project**. The system bridges the gap between student competencies and competitive campus recruitment standards by combining:

- **NLP Resume Parser & Semantic Entity Extractor** (Tokenization, n-grams, ATS alignment)
- **Bayesian Knowledge Tracing (BKT) & Item Response Theory (IRT)** (Adaptive diagnostics with Bayesian belief updates)
- **Calibrated Logistic Placement Predictor & Explainable AI (XAI)** (SHAP-style feature attributions + What-If sensitivity simulator)
- **AI Voice & Speech Mock Interview Simulator** (Web Speech API text-to-speech, real-time microphone transcription, filler word detection, & STAR rubric evaluation)
- **AI Code Sandbox & AST Complexity Evaluator** (Static analysis, Big-O asymptotic deduction, edge-case vulnerability scoring)
- **Interactive Machine Learning Research Lab** (Live neuron forward-pass dot product, adjustable synaptic weights, 2D decision boundary scatter plot, & binary cross-entropy loss convergence curve)
- **Competency Radar Map** (Spider chart comparison against Tier-1 placement benchmarks)
- **Unsupervised Cohort Clustering for TPOs** (K-Means distance-based student grouping with automated institutional intervention plans)
- **Exportable Placement Audit Dossier & Certification** (Official candidate readiness verification document with cryptographic model verification hash)

---

## 🧠 Core AI & Machine Learning Architectures

### 1. NLP Resume Parser & Semantic Entity Extractor
- **Formulation**: Preprocesses raw text through tokenization, punctuation filtering, and multi-scale n-gram generation (unigrams to trigrams).
- **Matching Engine**: Scans text against a domain skill ontology with keyword density scoring:
  $$\text{Confidence} = \min(95, 35 + (\text{Hits} \times 18) + (\text{Density} \times 4) + \text{Bonus}_{\text{multiword}})$$
- **ATS Match Score**: Computes weighted alignment percentage and detects missing ATS keywords required by automated applicant tracking systems.

### 2. Bayesian Knowledge Tracing (BKT) & Adaptive Diagnostics
- **Formulation**: Models latent candidate mastery $P(L_t)$ per competency:
  $$P(L_t \mid \text{Observation}) = \frac{P(L)(1 - S)}{P(L)(1 - S) + (1 - P(L))G}$$
  $$P(L_{t+1}) = \text{Posterior} + (1 - \text{Posterior}) \cdot T$$
  *(where $S = 0.10$ slip probability, $G = 0.25$ guess probability, and $T$ is the learning transition rate).*
- **Adaptive Questions**: Dynamically serves questions calibrated from Novice to Advanced with detailed AI pedagogical explanations.

### 3. Predictive Placement Classifier & Explainable AI (XAI)
- **Model**: Multi-factor Calibrated Logistic Regression:
  $$P(\text{Placement}) = \sigma\left(\beta_0 + \sum_{i=1}^n \beta_i x_i\right) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 \cdot \text{Coverage} + \beta_2 \cdot \text{Quiz} + \beta_3 \cdot \text{Roadmap} + \beta_4 \cdot \text{Interview} + \beta_5 \cdot \text{ATS})}}$$
- **Explainable AI (SHAP-style Feature Attribution)**: Decomposes predictions into exact positive drivers and risk factors:
  $$\phi_i = w_i \cdot (x_i - \bar{x}_i)$$
- **Interactive What-If Sensitivity Simulator**: Computes marginal probability gains achieved by closing specific competency gaps.

### 4. Speech AI & Conversational Mock Interview Simulator
- **Voice Text-to-Speech:** Generates professional interviewer audio using `window.speechSynthesis`.
- **Live Microphone Transcription:** Transcribes student responses via the Web Speech Recognition API (`webkitSpeechRecognition`).
- **Fluency & Rubric Diagnostics:** Calculates Words Per Minute (WPM), tracks hesitation/filler words ("um", "uh", "like"), and evaluates answers across **Technical Depth**, **STAR Structure** (Situation, Task, Action, Result), and **Communication Clarity**.

### 5. AI Static Code Analysis & Big-O Complexity Engine
- **Static AST Pattern Detection:** Evaluates loop nesting, recursive calls, and data structure utilization to deduce asymptotic Big-O bounds ($O(n)$ vs. $O(n^2)$).
- **Edge-Case Resilience:** Tests defensive programming checks (empty collections, zero-division, null safety, boundary conditions).

### 6. Interactive Machine Learning Research Lab
- **Live Neuron Activation:** Interactive sliders allowing users to modify feature inputs ($x_i$), synaptic weights ($w_i$), and threshold bias ($\beta_0$) to see the activation output $\sigma(z)$ fire in real-time.
- **2D Decision Hyperplane:** Maps candidates onto a 2D feature plane separating "Placed" candidates from "At-Risk" candidates.
- **Training Loss Curve:** Visualizes Binary Cross-Entropy loss convergence across 50 gradient descent epochs.

### 7. Unsupervised Cohort Clustering for Placement Officers (TPO)
- **Technique**: K-Means distance-based batch segmentation into 4 actionable clusters (*Direct Placement Ready*, *Core Tech Deficit*, *Assessment Gap*, and *At-Risk*).
- **Institutional Action Engine**: Generates automated intervention recommendations for training heads and faculty mentors.

### 8. Official Placement Audit Dossier & Certification
- Instant 1-click printable PDF report certifying candidate readiness, complete with model verification hash and full competency breakdown.

---

## 🚀 Running the Project

### Local Development
```bash
git clone https://github.com/nirajkanna043-wq/placement-assistant.git
cd placement-assistant
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Deploy to GitHub Pages
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
│   ├── aiCodeEvaluator.js        # Static AST analysis, Big-O complexity deduction, & coding challenges
│   ├── skillGapEngine.js         # Core algorithmic skill-gap matching & readiness formulas
│   └── llmClient.js              # Multi-mode AI client (Gemini / Anthropic / local synthesizer)
├── context/
│   └── AppContext.jsx            # Unified application state, ML inference pipeline, & persistence
├── components/
│   ├── StudentOnboarding.jsx     # Profile setup with AI Resume Scanner trigger
│   ├── ResumeParserModal.jsx     # Interactive NLP resume parsing modal with benchmark samples
│   ├── SkillAssessment.jsx       # Sliders + Adaptive Bayesian diagnostic quizzes with AI reasoning
│   ├── SkillGapDashboard.jsx     # Proficiency charts, Competency Radar Map, ML probability, & XAI
│   ├── AIMockInterview.jsx       # Speech recognition + Voice Mock Interview with STAR rubric
│   ├── AICodeSandbox.jsx         # Live coding workspace with AI Big-O complexity evaluation
│   ├── AILabVisualizer.jsx       # Interactive ML lab with neural activation & 2D decision boundary
│   ├── WeeklyPlan.jsx            # Personalized roadmap with interactive Ask AI Placement Mentor
│   ├── ProgressTracker.jsx       # Milestone completion tracking & readiness updates
│   ├── TPODashboard.jsx          # Institutional batch analytics & K-Means student clustering
│   ├── PlacementDossierModal.jsx # Official printable audit dossier & certification
│   ├── AIModelExplainerModal.jsx # Academic AI architecture & Viva evaluation guide
│   └── Sidebar.jsx               # Navigation, real-time ML metrics, and AI configuration
```
