import { AiKitData } from "./types";

interface OpenRouterPayload {
  jobTitle: string;
  company: string;
  jobDescription: string;
  masterResumeText?: string | null;
  targetRole?: string | null;
  preferredTone?: string;
}

export async function generateAiKitWithOpenRouter(
  payload: OpenRouterPayload
): Promise<Omit<AiKitData, "jobId">> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your-openrouter-api-key-here") {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Please add your OpenRouter API key to the .env file in the project root."
    );
  }

  const model = process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet";

  const systemPrompt = `You are an elite, compassionate executive career coach, expert technical recruiter, and ATS (Applicant Tracking System) specialist.
Your mission is to empower a non-technical job seeker with a complete, world-class "AI Application Kit" tailored specifically to a target job opportunity.

You must return a single, strictly valid JSON object (no introductory commentary, no markdown code block formatting like \`\`\`json, just the raw JSON object).

The JSON object must have this exact structure:
{
  "coverLetter": "string (A compelling, professional 3-4 paragraph cover letter customized to the company and role, highlighting candidate relevance. Do not use generic placeholders where information is available.)",
  "rewrittenBullets": [
    "string (4 to 6 punchy, action-oriented STAR/XYZ formula resume bullet points highlighting relevant achievements tailored to the target JD)"
  ],
  "interviewQuestions": [
    {
      "question": "string (Five likely questions the candidate will be asked, covering behavioral, situational, and role-specific requirements)",
      "rationale": "string (Brief insight explaining why interviewers ask this and what they are listening for)",
      "recommendedAnswerStrategy": "string (Step-by-step STAR method pointers to deliver a winning answer)"
    }
  ],
  "companyBrief": "string (A crisp 1-page executive briefing covering: Company Mission & Core Product, Culture & Value Signals, Key Talking Points for the Candidate, and 3 Smart Questions to ask the interviewers)",
  "simplifiedSummary": "string (Job Description Simplifier: Demystify the JD into simple, friendly everyday English. Explain what the day-to-day actually looks like)",
  "essentialSkills": [
    "string (List of absolute non-negotiable must-have skills from the JD)"
  ],
  "optionalSkills": [
    "string (List of nice-to-have, bonus, or secondary skills from the JD)"
  ],
  "termsExplained": [
    {
      "term": "string (A technical term, acronym, or industry buzzword appearing in the JD)",
      "explanation": "string (A plain-English, non-intimidating explanation of what it means in real life)"
    }
  ],
  "atsScore": 85,
  "matchedKeywords": [
    "string (Keywords from the JD found in the candidate's resume)"
  ],
  "missingKeywords": [
    "string (High-priority keywords or skills from the JD that are absent or underrepresented in the resume)"
  ],
  "formattingIssues": [
    "string (Any ATS red flags, formatting improvements, or structural risks found in resume text)"
  ],
  "atsRecommendations": "string (Actionable advice to elevate the ATS score and match rate for this specific application)"
}

Ensure the interview questions array contains exactly 5 well-crafted items.
If the candidate's master resume is provided, analyze it rigorously against the Job Description for the ATS score and missing keywords. If no resume is provided, calculate baseline relevance and note recommendations to add standard credentials.`;

  const userPrompt = `TARGET JOB DETAILS:
- Job Title: ${payload.jobTitle}
- Company: ${payload.company}
- Preferred Tone: ${payload.preferredTone || "professional"}
- Target Role Category: ${payload.targetRole || "General"}

JOB DESCRIPTION:
${payload.jobDescription}

CANDIDATE'S MASTER RESUME:
${payload.masterResumeText && payload.masterResumeText.trim().length > 0 
  ? payload.masterResumeText 
  : "[No master resume provided yet. Provide tailored suggestions, sample baseline bullets, and instructions for what the candidate should include.]"}
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey.trim()}`,
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Job Search Copilot",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorDetail = errorBody;
    try {
      const parsedError = JSON.parse(errorBody);
      if (parsedError.error?.message) {
        errorDetail = parsedError.error.message;
      }
    } catch {
      // Keep errorDetail as raw text
    }
    throw new Error(`OpenRouter API error (${response.status}): ${errorDetail}`);
  }

  const result = await response.json();
  const rawContent = result.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error("No response content received from OpenRouter.");
  }

  // Parse JSON, cleaning potential markdown wrapper if present
  let cleanJson = rawContent.trim();
  if (cleanJson.startsWith("```json")) {
    cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
  } else if (cleanJson.startsWith("```")) {
    cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
  }

  try {
    const parsed = JSON.parse(cleanJson);
    return {
      coverLetter: parsed.coverLetter || "",
      rewrittenBullets: Array.isArray(parsed.rewrittenBullets) ? parsed.rewrittenBullets : [],
      interviewQuestions: Array.isArray(parsed.interviewQuestions) ? parsed.interviewQuestions : [],
      companyBrief: parsed.companyBrief || "",
      simplifiedSummary: parsed.simplifiedSummary || "",
      essentialSkills: Array.isArray(parsed.essentialSkills) ? parsed.essentialSkills : [],
      optionalSkills: Array.isArray(parsed.optionalSkills) ? parsed.optionalSkills : [],
      termsExplained: Array.isArray(parsed.termsExplained) ? parsed.termsExplained : [],
      atsScore: typeof parsed.atsScore === "number" ? parsed.atsScore : 75,
      matchedKeywords: Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [],
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
      formattingIssues: Array.isArray(parsed.formattingIssues) ? parsed.formattingIssues : [],
      atsRecommendations: parsed.atsRecommendations || "",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to parse AI response as structured JSON: ${message}`);
  }
}

