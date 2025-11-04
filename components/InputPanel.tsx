
import React from 'react';
import type { CalculatorInputs, InputConfig, ModelAssumptions, AssumptionConfig } from '../types';
import { INPUT_CONFIG, ASSUMPTION_CONFIG } from '../constants';
import { ProductSelector } from './ProductSelector';

interface InputPanelProps {
  inputs: CalculatorInputs;
  onInputChange: (field: keyof CalculatorInputs, value: number) => void;
  assumptions: ModelAssumptions;
  onAssumptionChange: (field: keyof ModelAssumptions, value: number) => void;
  businessType: string;
  onBusinessTypeChange: (value: string) => void;
  onGenerateProfile: () => void;
  isGenerating: boolean;
  aiError: string | null;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

const formatValue = (value: number, type: InputConfig['type']) => {
  switch (type) {
    case 'currency':
      return `$${value.toLocaleString()}`;
    case 'percentage':
      return `${value}%`;
    case 'hours':
      return `${value.toLocaleString()} hrs`;
    default:
      return value.toLocaleString();
  }
};

const InputSlider: React.FC<{
    config: InputConfig | AssumptionConfig;
    value: number;
    onChange: (value: number) => void;
}> = ({ config, value, onChange }) => (
    <div className="py-3">
        <div className="flex justify-between items-baseline mb-1">
            <label htmlFor={config.id} className="text-sm font-medium text-slate-300">{config.label}</label>
            <span className="text-sm font-semibold text-cyan-400">{formatValue(value, config.type)}</span>
        </div>
        <input
            id={config.id}
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            aria-describedby={`${config.id}-description`}
        />
        <p id={`${config.id}-description`} className="text-xs text-slate-500 mt-1">{config.description}</p>
    </div>
);

export const InputPanel: React.FC<InputPanelProps> = ({ inputs, onInputChange, assumptions, onAssumptionChange, businessType, onBusinessTypeChange, onGenerateProfile, isGenerating, aiError, selectedIds, onSelectedIdsChange }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-full">
      
      <div className="mb-6 pb-6 border-b border-slate-700/50">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Solution Builder</h2>
        <ProductSelector selectedIds={selectedIds} onSelectionChange={onSelectedIdsChange} />
      </div>

      <div className="mb-6 pb-6 border-b border-slate-700/50">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">AI Business Profile</h2>
        <label htmlFor="businessType" className="text-sm text-slate-400">Describe the business to generate a profile.</label>
        <div className="flex gap-2 mt-2">
            <input
                id="businessType"
                type="text"
                value={businessType}
                onChange={(e) => onBusinessTypeChange(e.target.value)}
                placeholder="e.g., a mobile dog grooming business"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            <button
                onClick={onGenerateProfile}
                disabled={isGenerating || !businessType}
                className="bg-cyan-600 text-white font-bold px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex-shrink-0"
            >
                {isGenerating ? 'Generating...' : 'Generate'}
            </button>
        </div>
        {aiError && <p className="text-red-400 text-sm mt-2">{aiError}</p>}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-1">Business Profile</h2>
        <p className="text-slate-400 mb-4">Adjust the sliders to match your current operations.</p>
        
        <div className="space-y-2 divide-y divide-slate-700/50">
          {INPUT_CONFIG.map(config => (
            <InputSlider
              key={config.id}
              config={config}
              value={inputs[config.id]}
              onChange={(val) => onInputChange(config.id, val)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <details className="group">
          <summary className="cursor-pointer text-lg font-semibold text-slate-100 list-none flex justify-between items-center">
            Model Assumptions
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-open:rotate-180">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </summary>
          <div className="mt-4">
            <p className="text-slate-400 mb-4 text-sm">Fine-tune the underlying assumptions of the ROI calculation.</p>
            <div className="space-y-2 divide-y divide-slate-700/50">
              {ASSUMPTION_CONFIG.map(config => (
                <InputSlider
                  key={config.id}
                  config={config}
                  value={assumptions[config.id]}
                  onChange={(val) => onAssumptionChange(config.id, val)}
                />
              ))}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};
