import * as Sentry from "@sentry/react";

let isInitialized = false;

export const initSentry = (dsn: string) => {
  if (!dsn || isInitialized) return;
  
  try {
    Sentry.init({
      dsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, 
      // Session Replay
      replaysSessionSampleRate: 0.1, 
      replaysOnErrorSampleRate: 1.0,
      
      beforeSend(event) {
        // Sanitize sensitive data if necessary
        return event;
      }
    });
    isInitialized = true;
    console.log("Sentry Initialized");
  } catch (e) {
    console.error("Failed to initialize Sentry:", e);
  }
};

export const captureError = (error: Error, context?: Record<string, any>) => {
  if (!isInitialized) return;
  
  Sentry.captureException(error, {
    extra: context
  });
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  if (!isInitialized) return;
  Sentry.captureMessage(message, level);
};