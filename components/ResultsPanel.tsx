import React from 'react';
import type { CalculatedOutputs } from '../types';

const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const Section: React.FC<{ title: string; children: React.ReactNode, icon: string }> = ({ title, children, icon }) => (
  <div>
    <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center">
      <span className="mr-2 text-xl">{icon}</span>
      {title}
    </h3>
    <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
      {children}
    </div>
  </div>
);

const Metric: React.FC<{ label: string; value: string; isTotal?: boolean, colorClass?: string }> = ({ label, value, isTotal = false, colorClass = 'text-slate-300' }) => (
  <div className={`flex justify-between items-center ${isTotal ? 'py-2 border-t border-slate-700' : ''}`}>
    <p className={`text-sm ${isTotal ? 'font-bold' : 'text-slate-400'}`}>{label}</p>
    <p className={`font-semibold ${isTotal ? 'text-lg' : 'text-md'} ${colorClass}`}>{value}</p>
  </div>
);

const RoiMetric: React.FC<{ label: string; value: string; large?: boolean }> = ({ label, value, large = false }) => (
    <div className="text-center bg-slate-900/50 p-4 rounded-lg">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className={`font-bold ${large ? 'text-4xl text-cyan-400' : 'text-2xl text-slate-100'}`}>{value}</dd>
    </div>
);

export const ResultsPanel: React.FC<{ results: CalculatedOutputs }> = ({ results }) => {
  const hasMonthlyCost = results.monthlyServiceProCost > 0;
  const hasOneTimeCost = results.oneTimeServiceProCost > 0;

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6">
      
      <Section title="ROI Summary" icon="🎯">
        <div className="grid grid-cols-1 gap-4">
            <RoiMetric label="Net Monthly Profit" value={formatCurrency(results.netMonthlyProfit)} large />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hasMonthlyCost && <RoiMetric label="Monthly ROI" value={`${results.roiPercentage.toFixed(0)}%`} />}
                {hasOneTimeCost && <RoiMetric label="Payback" value={`${results.paybackPeriodDays.toFixed(0)} days`} />}
                <RoiMetric label="Break-Even" value={`${results.breakEvenBookings.toFixed(1)} jobs`} />
            </div>
        </div>
      </Section>

      <Section title="Monthly Gains with ServicePro" icon="🟢">
        <Metric label="Time Savings" value={formatCurrency(results.timeSavingsGain)} colorClass="text-green-400" />
        {/* Fix: Corrected typo from format_Currency to formatCurrency */}
        <Metric label="Calls Captured" value={formatCurrency(results.callsCapturedGain)} colorClass="text-green-400" />
        <Metric label="No-Show Reduction" value={formatCurrency(results.noShowReductionGain)} colorClass="text-green-400" />
        <Metric label="Conversion Lift" value={formatCurrency(results.conversionLiftGain)} colorClass="text-green-400" />
        <Metric label="After-Hours Bookings" value={formatCurrency(results.afterHoursBookingsGain)} colorClass="text-green-400" />
        <Metric label="Total Monthly Gain" value={formatCurrency(results.totalMonthlyGain)} isTotal colorClass="text-green-400"/>
      </Section>
      
      <Section title="Current Monthly Costs" icon="🔴">
        <Metric label="Labor (Scheduling)" value={formatCurrency(results.laborCostScheduling)} colorClass="text-red-400" />
        <Metric label="Lost Bookings (Missed Calls)" value={formatCurrency(results.lostBookings)} colorClass="text-red-400" />
        <Metric label="Lost Revenue (No-Shows)" value={formatCurrency(results.lostRevenueNoShows)} colorClass="text-red-400" />
        <Metric label="Opportunity Cost (Conversion)" value={formatCurrency(results.opportunityCost)} colorClass="text-red-400" />
        <Metric label="Total Hidden Costs" value={formatCurrency(results.totalCurrentCost)} isTotal colorClass="text-red-400" />
      </Section>

    </div>
  );
};
