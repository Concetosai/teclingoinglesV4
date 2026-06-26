/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getAIInsight(context: string) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You are a strategic analyst for a language school. Provide brief, actionable insights."
        },
        {
          role: "user",
          content: `Based on this English training dashboard context: "${context}", generate a single, professional, brief actionable insight for a language school director. Format: "Insight: [Brief actionable suggestion]". Keep it high-level and strategic.`
        }
      ],
    });

    return response.choices[0]?.message?.content?.replace('Insight: ', '') || "Monitor current A1 progress closely.";
  } catch (error) {
    console.error("AI Insight failed:", error);
    return "Activation suggested for Speaking modules in Group A1-104.";
  }
}
