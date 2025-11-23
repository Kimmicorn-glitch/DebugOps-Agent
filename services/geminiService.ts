import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { PatchSolution, AppError } from "../types";

// Schema definition for the agent's output
const patchSchema = {
  type: Type.OBJECT,
  properties: {
    root_cause: { type: Type.STRING, description: "The underlying technical reason for the error, or the summary of the input task." },
    severity: { type: Type.STRING, description: "Severity level: LOW, MEDIUM, HIGH, CRITICAL" },
    files_to_modify: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of filenames that need changes or created." 
    },
    patch: { type: Type.STRING, description: "The actual code fix, diff, data cleaning script, or detailed summary." },
    explanation: { type: Type.STRING, description: "A concise explanation of the solution or analysis." },
    next_steps: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Recommended follow-up actions."
    }
  },
  required: ["root_cause", "severity", "files_to_modify", "patch", "explanation", "next_steps"]
};

export const analyzeErrorWithGemini = async (error: AppError, apiKey: string): Promise<PatchSolution> => {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // We make the prompt flexible to handle both "Crash Reports" and "User Tasks" (Text/File/URL inputs)
  const prompt = `
    You are an expert Senior Site Reliability Engineer and Full Stack Developer.
    You are analyzing an input which could be a production error, a code snippet, a data file, or a URL to analyze.
    
    Input Context:
    Title/Message: ${error.message}
    Source Identifier: ${error.sourceFile}
    
    Content/Stack Trace/Data:
    ${error.stackTrace}
    
    Task:
    1. Identify the root cause (or analyze the intent of the input data).
    2. Assess severity (If it's just a task, default to LOW or MEDIUM).
    3. Generate a output. 
       - If it's a bug: Provide the code patch.
       - If it's a data file (CSV/JSON): Provide a script to parse/clean it or a summary of the data.
       - If it's a URL: Summarize the likely content or issue based on the URL structure.
    4. Explain your reasoning.
    
    Output MUST be strictly valid JSON matching the requested schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: patchSchema,
        temperature: 0.2,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    return JSON.parse(text) as PatchSolution;
  } catch (err) {
    console.error("Gemini Analysis Failed:", err);
    throw err;
  }
};