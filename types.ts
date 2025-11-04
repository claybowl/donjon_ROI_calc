export interface BaseConfig {
  label: string;
  description: string;
  type: 'currency' | 'percentage' | 'number' | 'hours';
  min: number;
  max: number;
  step: number;
}

export interface InputConfig extends BaseConfig {
  id: keyof CalculatorInputs;
}

export interface AssumptionConfig extends BaseConfig {
  id: keyof ModelAssumptions;
}

export type Gain = 'timeSavings' | 'callsCaptured' | 'noShowReduction' | 'conversionLift' | 'afterHoursBookings';

export interface Product {
  id: string;
  name: string;
  description: string;
  priceOneTime: number;
  priceMonthly: number;
  gains: Gain[];
}

export interface ProductCategory {
  name: string;
  description: string;
  products: Product[];
  selectionType: 'single' | 'multiple';
}

export interface CalculatorInputs {
  monthlyBookings: number;
  avgJobValue: number;
  schedulingTime: number; // hrs/wk
  hourlyRate: number;
  missedCallsPerWeek: number;
  noShowRate: number; // percentage
  conversionRate: number; // percentage
}

export interface ModelAssumptions {
  callToBookingRate: number;
  voicemailCallbackRate: number;
  monthlyLeads: number;
  targetConversionRate: number;
  serviceProCaptureRate: number;
  schedulingTimeReduction: number;
  targetNoShowRate: number;
  conversionLift: number;
  afterHoursBookingRate: number;
}

export interface CalculatedOutputs {
  // Current Costs
  currentMonthlyRevenue: number;
  laborCostScheduling: number;
  lostBookings: number;
  lostRevenueNoShows: number;
  opportunityCost: number;
  totalCurrentCost: number;
  
  // ServicePro Gains
  timeSavingsGain: number;
  callsCapturedGain: number;
  noShowReductionGain: number;
  conversionLiftGain: number;
  afterHoursBookingsGain: number;
  totalMonthlyGain: number;

  // ROI Summary
  monthlyServiceProCost: number;
  oneTimeServiceProCost: number;
  netMonthlyProfit: number;
  roiPercentage: number;
  paybackPeriodDays: number;
  breakEvenBookings: number;
}