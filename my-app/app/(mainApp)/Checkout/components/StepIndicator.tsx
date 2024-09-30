import React from "react";
import { Check } from "lucide-react";

interface Steps {
  id: number;
  name: string;
}
interface StepIndicatorProps {
  currentStep: number;
  steps: Steps[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <div className="flex justify-between items-center mb-8 max-w-3xl mx-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                step.id <= currentStep
                  ? "bg-primaryColor text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.id < currentStep ? <Check className="w-5 h-5" /> : step.id}
            </div>
            <div className="mt-2 text-sm font-medium">{step.name}</div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                step.id < currentStep ? "bg-primaryColor" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
