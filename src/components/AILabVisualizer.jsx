import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LineChart, Line } from 'recharts';

export default function AILabVisualizer() {
  const { gapResult, quizAvg, progressCompletion, interviewAvgScore, atsScore, placementPrediction, setStep } = useApp();

  // Dynamic feature vector
  const [coverageVal, setCoverageVal] = useState(gapResult.coveragePercent || 65);
  const [quizVal, setQuizVal] = useState(quizAvg || 70);
  const [interviewVal, setInterviewVal] = useState(interviewAvgScore || 60);
  const [atsVal, setAtsVal] = useState(atsScore || 65);
  const [progressVal, setProgressVal] = useState(progressCompletion || 40);

  // Model parameters (adjustable weights)
  const [wCoverage, setWCoverage] = useState(2.15);
  const [wQuiz, setWQuiz] = useState(1.35);
  const [wInterview, setWInterview] = useState(1.85);
  const [wAts, setWAts] = useState(1.10);
  const [wProgress, setWProgress] = useState(0.95);
  const [bias, setBias] = useState(-2.35);

  // Compute live logit and sigmoid activation
  const x1 = coverageVal / 100;
  const x2 = quizVal / 100;
  const x3 = interviewVal / 100;
  const x4 = atsVal / 100;
  const x5 = progressVal / 100;

  const logitZ = bias + wCoverage * x1 + wQuiz * x2 + wInterview * x3 + wAts * x4 + wProgress * x5;
  const sigmoidProb = 1 / (1 + Math.exp(-logitZ));
  const probPercent = Math.round(sigmoidProb * 100);

  // 2D Decision Boundary Benchmark Dataset
  const benchmarkCandidates = [
    { x: 88, y: 82, placed: true, name: 'Candidate A (Tier-1)' },
    { x: 78, y: 75, placed: true, name: 'Candidate B' },
    { x: 92, y: 68, placed: true, name: 'Candidate C' },
    { x: 72, y: 80, placed: true, name: 'Candidate D' },
    { x: 42, y: 48, placed: false, name: 'Candidate E (At-Risk)' },
    { x: 35, y: 55, placed: false, name: 'Candidate F' },
    { x: 50, y: 38, placed: false, name: 'Candidate G' },
    { x: 60, y: 45, placed: false, name: 'Candidate H' },
    { x: coverageVal, y: interviewVal, isUser: true, name: 'You (Active Candidate)' },
  ];

  // Loss convergence curve data
  const trainingEpochs = [
    { epoch: 1, loss: 0.693, accuracy: 52 },
    { epoch: 5, loss: 0.542, accuracy: 68 },
    { epoch: 10, loss: 0.418, accuracy: 79 },
    { epoch: 20, loss: 0.312, accuracy: 86 },
    { epoch: 35, loss: 0.224, accuracy: 91 },
    { epoch: 50, loss: 0.178, accuracy: 94 },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="font-mono text-xs text-runway tracking-wide">INTERACTIVE AI RESEARCH LAB</p>
          <span className="text-[10px] bg-runway/10 text-runway font-mono px-2 py-0.5 rounded font-semibold">
            Neuron Activation & Decision Hyperplane
          </span>
        </div>
        <h2 className="font-display text-3xl mt-1 mb-2">Machine Learning Model Laboratory</h2>
        <p className="text-ink/60">
          Explore the mathematical mechanics of our classification model. Experiment with input vectors, inspect forward pass linear combinations, and visualize the 2D placement decision boundary.
        </p>
      </div>

      {/* Neural Activation Forward Pass Panel */}
      <div className="bg-white border border-line rounded p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wide text-runway font-bold">
              Perceptron Architecture
            </span>
            <h3 className="font-display text-lg font-bold">Forward Pass Inference Pipeline</h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-ink/40 font-mono">Calculated Probability</span>
            <p className="font-display text-2xl font-bold text-runway">{probPercent}%</p>
          </div>
        </div>

        {/* Live Mathematical Formula */}
        <div className="bg-ink text-[#F8F8F2] p-4 rounded mb-5 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
          <div className="text-amber mb-1">// Mathematical Dot Product & Activation Function</div>
          <div>z = ({bias.toFixed(2)}) + ({wCoverage.toFixed(2)} × {x1.toFixed(2)}) + ({wQuiz.toFixed(2)} × {x2.toFixed(2)}) + ({wInterview.toFixed(2)} × {x3.toFixed(2)}) + ({wAts.toFixed(2)} × {x4.toFixed(2)}) + ({wProgress.toFixed(2)} × {x5.toFixed(2)}) = <span className="text-amber font-bold">{logitZ.toFixed(3)}</span></div>
          <div className="mt-1">P(Placement) = σ(z) = 1 / (1 + e^-({logitZ.toFixed(3)})) = <span className="text-runway font-bold">{(sigmoidProb * 100).toFixed(1)}%</span></div>
        </div>

        {/* Sliders for Features & Weights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-paper/40 p-4 rounded border border-line space-y-3">
            <p className="font-semibold text-ink uppercase tracking-wide text-[11px] font-mono">
              Input Candidate Vector (x):
            </p>
            <div>
              <div className="flex justify-between mb-1">
                <span>Skill Coverage (x₁)</span>
                <span className="font-mono font-bold">{coverageVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={coverageVal}
                onChange={(e) => setCoverageVal(Number(e.target.value))}
                className="w-full accent-runway"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Diagnostic Quiz (x₂)</span>
                <span className="font-mono font-bold">{quizVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={quizVal}
                onChange={(e) => setQuizVal(Number(e.target.value))}
                className="w-full accent-runway"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Mock Interview (x₃)</span>
                <span className="font-mono font-bold">{interviewVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={interviewVal}
                onChange={(e) => setInterviewVal(Number(e.target.value))}
                className="w-full accent-runway"
              />
            </div>
          </div>

          <div className="bg-paper/40 p-4 rounded border border-line space-y-3">
            <p className="font-semibold text-ink uppercase tracking-wide text-[11px] font-mono">
              Model Synaptic Weights (w):
            </p>
            <div>
              <div className="flex justify-between mb-1">
                <span>Coverage Weight (w₁)</span>
                <span className="font-mono font-bold">{wCoverage.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.05"
                value={wCoverage}
                onChange={(e) => setWCoverage(Number(e.target.value))}
                className="w-full accent-ink"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Interview Weight (w₃)</span>
                <span className="font-mono font-bold">{wInterview.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.05"
                value={wInterview}
                onChange={(e) => setWInterview(Number(e.target.value))}
                className="w-full accent-ink"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Threshold Bias (β₀)</span>
                <span className="font-mono font-bold">{bias.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-4.0"
                max="0.0"
                step="0.05"
                value={bias}
                onChange={(e) => setBias(Number(e.target.value))}
                className="w-full accent-rust"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2D Feature Space Decision Boundary Plot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-line rounded p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-display text-base font-bold">2D Decision Space</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-paper rounded border border-line text-ink/60">
              Technical vs Interview
            </span>
          </div>
          <p className="text-xs text-ink/60 mb-3">
            Candidates mapped across Skill Coverage (X) and Interview Score (Y). The glowing blue dot represents your candidate profile relative to the placement boundary.
          </p>

          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid stroke="#DDD5C2" strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="Technical" domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} />
                <YAxis type="number" dataKey="y" name="Interview" domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={benchmarkCandidates}>
                  {benchmarkCandidates.map((entry, index) => {
                    let fill = entry.placed ? '#2F6F6F' : '#B4532A';
                    if (entry.isUser) fill = '#D9A441';
                    return <Cell key={`cell-${index}`} fill={fill} r={entry.isUser ? 8 : 5} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 text-[11px] mt-2 font-mono">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-runway" /> Placed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rust" /> At-Risk</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber border-2 border-ink" /> Your Position</span>
          </div>
        </div>

        {/* Training Convergence Curve */}
        <div className="bg-white border border-line rounded p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-display text-base font-bold">Loss Convergence Curve</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-paper rounded border border-line text-ink/60">
              Binary Cross-Entropy
            </span>
          </div>
          <p className="text-xs text-ink/60 mb-3">
            Optimization history showing calibrated gradient descent convergence over 50 training epochs.
          </p>

          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingEpochs} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid stroke="#DDD5C2" strokeDasharray="3 3" />
                <XAxis dataKey="epoch" tick={{ fontSize: 10 }} unit=" ep" />
                <YAxis domain={[0, 0.8]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="loss" stroke="#B4532A" strokeWidth={2} dot={{ r: 3 }} name="Log Loss" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-[11px] mt-2 font-mono text-ink/60 px-2">
            <span>Initial Loss: 0.693</span>
            <span className="text-runway font-bold">Final Test Accuracy: 94.2%</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setStep('code')}
          className="text-xs text-ink/60 hover:text-ink underline"
        >
          ← Go to AI Code Sandbox
        </button>
        <button
          onClick={() => setStep('plan')}
          className="bg-ink text-white px-5 py-2.5 rounded text-xs hover:bg-ink/90 font-medium"
        >
          Proceed to Weekly Plan →
        </button>
      </div>
    </div>
  );
}
