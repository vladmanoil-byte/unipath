// WizardStepper.jsx
// Displays the four-step progress indicator for the onboarding wizard.
const WizardStepper = ({ steps, currentStep }) => (
  <nav aria-label="Wizard steps" className="space-y-3">
    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
      <span>
        Step {currentStep + 1} of {steps.length}
      </span>
    </div>
    <ol className="flex flex-wrap items-center gap-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;
        return (
          <li key={step} className="flex items-center gap-2 text-sm">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition ${
                isActive
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : isComplete
                  ? 'border-brand-200 bg-brand-100 text-brand-700'
                  : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              {index + 1}
            </span>
            <span className={isActive ? 'font-semibold text-brand-700' : 'text-slate-500'}>{step}</span>
          </li>
        );
      })}
    </ol>
  </nav>
);

export default WizardStepper;
