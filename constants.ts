import type { CalculatorInputs, InputConfig, ModelAssumptions, AssumptionConfig, ProductCategory } from './types';

export const INITIAL_INPUTS: CalculatorInputs = {
  monthlyBookings: 50,
  avgJobValue: 200,
  schedulingTime: 4,
  hourlyRate: 50,
  missedCallsPerWeek: 10,
  noShowRate: 15,
  conversionRate: 65,
};

export const INITIAL_ASSUMPTIONS: ModelAssumptions = {
  callToBookingRate: 50,
  voicemailCallbackRate: 50,
  monthlyLeads: 100,
  targetConversionRate: 85,
  serviceProCaptureRate: 95,
  schedulingTimeReduction: 75,
  targetNoShowRate: 5,
  conversionLift: 25,
  afterHoursBookingRate: 20,
};

export const PRODUCTS_CONFIG: ProductCategory[] = [
  {
    name: 'ServicePro AI Platform',
    description: 'Bundled packages for complete digital transformation.',
    selectionType: 'single',
    products: [
      { id: 'solo', name: 'SOLO Package', description: 'Website, AI chatbot, booking, database, email/SMS, Google integrations.', priceOneTime: 1299, priceMonthly: 29, gains: ['timeSavings', 'callsCaptured', 'noShowReduction', 'conversionLift', 'afterHoursBookings'] },
      { id: 'crew', name: 'CREW Package', description: 'Everything in SOLO + multi-user, unlimited customers, invoicing, payments.', priceOneTime: 2499, priceMonthly: 59, gains: ['timeSavings', 'callsCaptured', 'noShowReduction', 'conversionLift', 'afterHoursBookings'] },
      { id: 'fleet', name: 'FLEET Package', description: 'Everything in CREW + multi-location, route optimization, full CRM, API.', priceOneTime: 3999, priceMonthly: 99, gains: ['timeSavings', 'callsCaptured', 'noShowReduction', 'conversionLift', 'afterHoursBookings'] },
    ]
  },
  {
    name: 'A La Carte Tools',
    description: 'Select individual tools when you only need one piece of the puzzle.',
    selectionType: 'multiple',
    products: [
      { id: 'chatbot', name: 'AI Chatbot', description: '24/7 lead capture, FAQs, warm hand-offs.', priceOneTime: 0, priceMonthly: 49, gains: ['callsCaptured', 'conversionLift', 'afterHoursBookings'] },
      { id: 'booking', name: 'Booking System', description: 'Self-serve scheduling, reminders, calendar sync.', priceOneTime: 0, priceMonthly: 39, gains: ['timeSavings', 'noShowReduction'] },
      { id: 'crm', name: 'Simple CRM', description: 'Pipeline tracking, customer notes, follow-ups.', priceOneTime: 0, priceMonthly: 59, gains: ['conversionLift'] },
      { id: 'analytics', name: 'Analytics Dashboard', description: 'Dashboards for leads, bookings, revenue, and ROI.', priceOneTime: 0, priceMonthly: 29, gains: [] },
    ]
  }
];

export const INPUT_CONFIG: InputConfig[] = [
  { id: 'monthlyBookings', label: 'Monthly Bookings', description: 'Average number of jobs booked per month.', type: 'number', min: 10, max: 375, step: 5 },
  { id: 'avgJobValue', label: 'Avg Job Value', description: 'Average revenue from a single job.', type: 'currency', min: 50, max: 1500, step: 10 },
  { id: 'schedulingTime', label: 'Scheduling Time (hrs/wk)', description: 'Hours your team spends on scheduling, reminders, and follow-ups per week.', type: 'hours', min: 0, max: 30, step: 1 },
  { id: 'hourlyRate', label: 'Blended Hourly Rate', description: 'Average hourly cost of an employee handling scheduling.', type: 'currency', min: 20, max: 115, step: 5 },
  { id: 'missedCallsPerWeek', label: 'Missed Calls Per Week', description: 'Number of potential customer calls that go to voicemail or are missed.', type: 'number', min: 0, max: 75, step: 1 },
  { id: 'noShowRate', label: 'Current No-Show Rate', description: 'Percentage of booked jobs that are no-shows.', type: 'percentage', min: 0, max: 40, step: 1 },
  { id: 'conversionRate', label: 'Current Conversion Rate', description: 'Percentage of inquiries that turn into booked jobs.', type: 'percentage', min: 10, max: 100, step: 1 },
];

export const ASSUMPTION_CONFIG: AssumptionConfig[] = [
  { id: 'callToBookingRate', label: 'Call-to-Booking Rate', description: 'Percentage of qualified calls that should result in a booking.', type: 'percentage', min: 10, max: 100, step: 1 },
  { id: 'voicemailCallbackRate', label: 'Voicemail Callback Rate', description: 'Percentage of missed calls where the customer calls back or you successfully reconnect.', type: 'percentage', min: 0, max: 100, step: 1 },
  { id: 'serviceProCaptureRate', label: 'ServicePro Capture Rate', description: 'Percentage of missed calls captured and engaged by the AI assistant.', type: 'percentage', min: 80, max: 100, step: 1 },
  { id: 'monthlyLeads', label: 'Monthly Leads', description: 'Total inquiries used for conversion lift calculation.', type: 'number', min: 20, max: 750, step: 10 },
  { id: 'targetConversionRate', label: 'Target Conversion Rate', description: 'The achievable conversion rate with ServicePro\'s instant engagement.', type: 'percentage', min: 50, max: 100, step: 1 },
  { id: 'conversionLift', label: 'Conversion Lift', description: 'The percentage increase in booking conversion from instant, 24/7 responses.', type: 'percentage', min: 5, max: 40, step: 1 },
  { id: 'schedulingTimeReduction', label: 'Scheduling Time Reduction', description: 'Percentage of manual scheduling time automated by ServicePro.', type: 'percentage', min: 50, max: 100, step: 1 },
  { id: 'targetNoShowRate', label: 'Target No-Show Rate', description: 'The new, lower no-show rate achieved with automated reminders and deposits.', type: 'percentage', min: 0, max: 15, step: 1 },
  { id: 'afterHoursBookingRate', label: 'After-Hours Booking %', description: 'Percentage of total bookings that could be captured outside of business hours.', type: 'percentage', min: 5, max: 40, step: 1 },
];