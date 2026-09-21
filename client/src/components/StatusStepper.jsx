import React from 'react';
import { Check, Clock, UserCheck, Wrench, CheckCircle2, Archive } from 'lucide-react';

const STEPS = [
  { id: 'Submitted', label: 'Submitted', desc: 'Complaint registered', icon: Clock },
  { id: 'Under Review', label: 'Under Review', desc: 'Admin evaluation', icon: UserCheck },
  { id: 'Assigned', label: 'Assigned', desc: 'Routed to department', icon: UserCheck },
  { id: 'In Progress', label: 'In Progress', desc: 'Action being taken', icon: Wrench },
  { id: 'Resolved', label: 'Resolved', desc: 'Issue resolved', icon: CheckCircle2 },
  { id: 'Closed', label: 'Closed', desc: 'Confirmed & finalized', icon: Archive },
];

export default function StatusStepper({ currentStatus }) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Connecting line behind icons */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
            style={{
              width: `${(activeIndex / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {STEPS.map((step, index) => {
          const isPassed = index < activeIndex;
          const isCurrent = index === activeIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10 group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-md ${
                  isPassed
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                    : isCurrent
                    ? 'bg-sky-600 text-white ring-4 ring-sky-100 scale-110'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                {isPassed ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center transition-colors hidden sm:block ${
                  isCurrent
                    ? 'text-sky-700 font-bold'
                    : isPassed
                    ? 'text-emerald-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Current Step Label */}
      <div className="mt-4 sm:hidden text-center bg-slate-100 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700">
        Current Stage: <span className="text-sky-700">{STEPS[activeIndex]?.label}</span>
      </div>
    </div>
  );
}
