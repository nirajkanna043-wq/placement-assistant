import React from 'react';
import Sidebar from './components/Sidebar.jsx';
import StudentOnboarding from './components/StudentOnboarding.jsx';
import SkillAssessment from './components/SkillAssessment.jsx';
import SkillGapDashboard from './components/SkillGapDashboard.jsx';
import WeeklyPlan from './components/WeeklyPlan.jsx';
import ProgressTracker from './components/ProgressTracker.jsx';
import TPODashboard from './components/TPODashboard.jsx';
import { useApp } from './context/AppContext.jsx';

const STUDENT_SCREENS = {
  onboarding: StudentOnboarding,
  assessment: SkillAssessment,
  dashboard: SkillGapDashboard,
  plan: WeeklyPlan,
  progress: ProgressTracker,
};

export default function App() {
  const { view, step } = useApp();

  const StudentScreen = STUDENT_SCREENS[step] || StudentOnboarding;

  return (
    <div className="flex min-h-screen font-body">
      <Sidebar />
      <main className="flex-1 px-10 py-10 bg-parchment">
        {view === 'student' ? <StudentScreen /> : <TPODashboard />}
      </main>
    </div>
  );
}
