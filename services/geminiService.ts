
import { GoogleGenAI, Type } from "@google/genai";
import type { CalculatorInputs } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    monthlyBookings: {
      type: Type.INTEGER,
      description: "Average number of jobs booked per month for this type of small business."
    },
    avgJobValue: {
      type: Type.INTEGER,
      description: "Average revenue in USD from a single job for this business."
    },
    schedulingTime: {
      type: Type.INTEGER,
      description: "Typical hours the owner or an employee spends on scheduling per week."
    },
    hourlyRate: {
      type: Type.INTEGER,
      description: "A realistic blended hourly rate in USD for an employee handling scheduling in this industry."
    },
    missedCallsPerWeek: {
      type: Type.INTEGER,
      description: "A realistic number of potential customer calls that are missed each week for a business of this size."
    },
    noShowRate: {
      type: Type.INTEGER,
      description: "A common percentage (as a whole number, e.g., 15 for 15%) of booked jobs that are no-shows."
    },
    conversionRate: {
      type: Type.INTEGER,
      description: "A typical percentage (as a whole number, e.g., 65 for 65%) of inquiries that turn into booked jobs."
    },
  },
  required: ["monthlyBookings", "avgJobValue", "schedulingTime", "hourlyRate", "missedCallsPerWeek", "noShowRate", "conversionRate"]
};


export async function generateBusinessProfile(businessDescription: string): Promise<Partial<CalculatorInputs>> {
  try {
    const prompt = `
      You are a business consultant specializing in small to medium-sized service businesses.
      Your task is to generate a realistic business profile for an ROI calculator.
      The business is: "${businessDescription}".
      
      Based on this description, provide typical, conservative, and realistic operational metrics.
      Do not use extreme or high-end values. Focus on a typical small business owner's reality.
      
      Provide your response as a JSON object that strictly follows the provided schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    
    const jsonText = response.text.trim();
    const generatedProfile = JSON.parse(jsonText);

    return generatedProfile;

  } catch (error) {
    console.error("Error generating business profile:", error);
    throw new Error("Failed to generate AI profile. Please try a different description or check the console.");
  }
}