/**
 * CLOUD FUNCTIONS FOR DEBUGOPS
 * 
 * Note: The React App includes a client-side simulation of this logic 
 * for the "Mock Mode" demo. To use these actual functions:
 * 1. `npm install` inside /functions
 * 2. Set API key: `firebase functions:config:set gemini.key="YOUR_KEY"`
 * 3. Deploy: `firebase deploy --only functions`
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenAI, Type } from "@google/genai";
import * as Sentry from "@sentry/node";

// Init Sentry for Backend
if (functions.config().sentry?.dsn) {
  Sentry.init({
    dsn: functions.config().sentry.dsn,
    tracesSampleRate: 1.0,
  });
}

admin.initializeApp();
const db = admin.firestore();

const API_KEY = functions.config().gemini?.key || process.env.API_KEY;

// 1. Trigger: New Error Added
export const onNewError = functions.firestore
  .document("errors/{errorId}")
  .onCreate(async (snap, context) => {
    const errorData = snap.data();
    const errorId = context.params.errorId;

    await db.collection("errors").doc(errorId).update({ status: "ANALYZING" });
    await logAgentStep(errorId, "Error Received", "Cloud Function triggered. Starting analysis.");

    try {
      await callGeminiAndPatch(errorId, errorData);
    } catch (e) {
      console.error(e);
      Sentry.captureException(e);
      await logAgentStep(errorId, "Failure", "Analysis failed internally.");
    }
  });

// 2. Helper: Call Gemini
async function callGeminiAndPatch(errorId: string, errorData: any) {
  if (!API_KEY) {
    throw new Error("Missing Gemini API Key in functions config");
  }

  await logAgentStep(errorId, "Gemini Analysis", "Sending stack trace to LLM.");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = "gemini-2.5-flash";

  const prompt = `
    Analyze this error:
    Message: ${errorData.message}
    Stack: ${errorData.stackTrace}
    Source: ${errorData.sourceFile}
    
    Return JSON with root_cause, severity, files_to_modify (array), patch (string), explanation, next_steps (array).
  `;

  // Define Schema
  const schema = {
    type: Type.OBJECT,
    properties: {
      root_cause: { type: Type.STRING },
      severity: { type: Type.STRING },
      files_to_modify: { type: Type.ARRAY, items: { type: Type.STRING } },
      patch: { type: Type.STRING },
      explanation: { type: Type.STRING },
      next_steps: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  };

  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: schema
    }
  });

  const responseJson = JSON.parse(result.text || "{}");

  // 3. Store Patch
  await db.collection("patches").add({
    errorId,
    ...responseJson,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  await db.collection("errors").doc(errorId).update({ status: "PATCH_PROPOSED" });
  await logAgentStep(errorId, "Patch Created", "Fix generated and stored in database.");
}

async function logAgentStep(errorId: string, step: string, desc: string) {
  await db.collection("agent_logs").add({
    errorId,
    step,
    description: desc,
    timestamp: Date.now(),
    status: "success"
  });
}