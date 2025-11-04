
import React, { useState, useMemo } from 'react';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { INITIAL_INPUTS, INITIAL_ASSUMPTIONS, PRODUCTS_CONFIG } from './constants';
import type { CalculatorInputs, CalculatedOutputs, ModelAssumptions, Gain } from './types';
import { generateBusinessProfile } from './services/geminiService';

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(INITIAL_INPUTS);
  const [assumptions, setAssumptions] = useState<ModelAssumptions>(INITIAL_ASSUMPTIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>(['crew']); // Default to Crew package
  const [businessType, setBusinessType] = useState('a small auto detailing shop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAssumptionChange = (field: keyof ModelAssumptions, value: number) => {
    setAssumptions(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateProfile = async () => {
    setIsGenerating(true);
    setAiError(null);
    try {
      const generatedProfile = await generateBusinessProfile(businessType);
      setInputs(prev => ({ ...prev, ...generatedProfile }));
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const results = useMemo<CalculatedOutputs>(() => {
    const { monthlyBookings, avgJobValue, schedulingTime, hourlyRate, missedCallsPerWeek, noShowRate, conversionRate } = inputs;
    
    // Determine active gains and costs from selected products
    const allProducts = PRODUCTS_CONFIG.flatMap(cat => cat.products);
    const selectedProducts = allProducts.filter(p => selectedIds.includes(p.id));
    
    const activeGains = new Set<Gain>();
    selectedProducts.forEach(p => {
      p.gains.forEach(gain => activeGains.add(gain));
    });

    let monthlyServiceProCost = 0;
    let oneTimeServiceProCost = 0;

    selectedProducts.forEach(p => {
      if (p.costType === 'monthly') {
        monthlyServiceProCost += p.price;
      } else {
        oneTimeServiceProCost += p.price;
      }
    });

    // Amortize one-time cost over 12 months for monthly profit calculation
    const amortizedOneTimeCost = oneTimeServiceProCost / 12;
    const totalMonthlyCostForProfitCalc = monthlyServiceProCost + amortizedOneTimeCost;

    // Convert assumption percentages to decimals
    const ctbRate = assumptions.callToBookingRate / 100;
    const vcbRate = assumptions.voicemailCallbackRate / 100;
    const tConvRate = assumptions.targetConversionRate / 100;
    const spcRate = assumptions.serviceProCaptureRate / 100;
    const stRed = assumptions.schedulingTimeReduction / 100;
    const tnsRate = assumptions.targetNoShowRate / 100;
    const cLift = assumptions.conversionLift / 100;
    const ahbRate = assumptions.afterHoursBookingRate / 100;

    // SECTION 1: Current System Costs
    const currentMonthlyRevenue = monthlyBookings * avgJobValue;
    const laborCostScheduling = (schedulingTime * 4) * hourlyRate;
    const lostBookings = (missedCallsPerWeek * 4) * (1 - vcbRate) * ctbRate * avgJobValue;
    const lostRevenueNoShows = monthlyBookings * (noShowRate / 100) * avgJobValue;
    const opportunityCost = assumptions.monthlyLeads * Math.max(0, tConvRate - (conversionRate / 100)) * avgJobValue;
    const totalCurrentCost = laborCostScheduling + lostBookings + lostRevenueNoShows + opportunityCost;

    // SECTION 2: ServicePro Impact Gains (Calculated conditionally)
    const CONSERVATIVE_FACTOR = 0.65; // 35% reduction for more conservative estimates
    const timeSavingsGain = activeGains.has('timeSavings') ? (laborCostScheduling * stRed) * CONSERVATIVE_FACTOR : 0;
    const callsCapturedGain = activeGains.has('callsCaptured') ? ((missedCallsPerWeek * 4 * avgJobValue * ctbRate) * (spcRate - vcbRate)) * CONSERVATIVE_FACTOR : 0;
    const noShowReductionGain = activeGains.has('noShowReduction') ? (monthlyBookings * Math.max(0, ((noShowRate / 100) - tnsRate)) * avgJobValue) * CONSERVATIVE_FACTOR : 0;
    const conversionLiftGain = activeGains.has('conversionLift') ? (assumptions.monthlyLeads * (((conversionRate / 100) * (1 + cLift)) - (conversionRate / 100)) * avgJobValue) * CONSERVATIVE_FACTOR : 0;
    const afterHoursBookingsGain = activeGains.has('afterHoursBookings') ? (monthlyBookings * ahbRate * avgJobValue) * CONSERVATIVE_FACTOR : 0;
    const totalMonthlyGain = timeSavingsGain + callsCapturedGain + noShowReductionGain + conversionLiftGain + afterHoursBookingsGain;

    // SECTION 3: ROI Summary
    const netMonthlyProfit = totalMonthlyGain - totalMonthlyCostForProfitCalc;
    const roiPercentage = monthlyServiceProCost > 0 ? ((totalMonthlyGain - monthlyServiceProCost) / monthlyServiceProCost) * 100 : 0;
    const paybackPeriodDays = oneTimeServiceProCost > 0 && totalMonthlyGain > 0 ? oneTimeServiceProCost / (totalMonthlyGain / 30) : 0;
    const breakEvenBookings = avgJobValue > 0 ? (monthlyServiceProCost + oneTimeServiceProCost) / avgJobValue : 0;

    return {
      currentMonthlyRevenue,
      laborCostScheduling,
      lostBookings,
      lostRevenueNoShows,
      opportunityCost,
      totalCurrentCost,
      timeSavingsGain,
      callsCapturedGain,
      noShowReductionGain,
      conversionLiftGain,
      afterHoursBookingsGain,
      totalMonthlyGain,
      monthlyServiceProCost,
      oneTimeServiceProCost,
      netMonthlyProfit,
      roiPercentage,
      paybackPeriodDays,
      breakEvenBookings
    };
  }, [inputs, assumptions, selectedIds]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cyan-400">
            ServicePro ROI Calculator
          </h1>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">Build a solution to see the real cost of your current system and the immediate impact of automation.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputPanel
            inputs={inputs}
            onInputChange={handleInputChange}
            assumptions={assumptions}
            onAssumptionChange={handleAssumptionChange}
            businessType={businessType}
            onBusinessTypeChange={setBusinessType}
            onGenerateProfile={handleGenerateProfile}
            isGenerating={isGenerating}
            aiError={aiError}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
          />
          <ResultsPanel 
            results={results}
          />
        </main>
        
        <footer className="text-center mt-12 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Donjon Systems. All rights reserved.</p>
          <p className="mt-1">Calculations are estimates based on industry benchmarks and provided data.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
