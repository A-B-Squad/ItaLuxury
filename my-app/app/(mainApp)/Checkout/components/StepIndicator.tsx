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
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 max-w-3xl mx-auto px-4 sm:px-0">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex items-center sm:flex-col sm:items-center mb-4 sm:mb-0 w-full sm:w-auto">
            <div
              className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full ${
                step.id <= currentStep
                  ? "bg-primaryColor text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.id < currentStep ? <Check className="w-5 h-5" /> : step.id}
            </div>
            <div className="ml-3 sm:ml-0 sm:mt-2 text-sm font-medium">{step.name}</div>
            {index < steps.length - 1 && (
              <div
                className={`hidden sm:block flex-1 w-full h-0.5 sm:w-16 sm:mx-2 ${
                  step.id < currentStep ? "bg-primaryColor" : "bg-gray-300"
                }`}
              />
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`sm:hidden flex-1 w-0.5 h-4 mx-4 ${
                step.id < currentStep ? "bg-primaryColor" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;